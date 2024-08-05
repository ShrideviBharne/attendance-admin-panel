import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter hook
import { auth } from '../../firebaseConfig'; 
import { onAuthStateChanged } from 'firebase/auth';
import { db } from '../../firebaseConfig'; // Import Firestore database
import { collection, getDocs, query, where } from 'firebase/firestore'; // Import Firestore functions
import Navad from '../../components/navad';

const Reports = () => {
  const router = useRouter();
  const [selectedReportType, setSelectedReportType] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [reportData, setReportData] = useState([]);
  const [students, setStudents] = useState([]); // State for students
  const [classes, setClasses] = useState([]); // State for classes
  const [subjects, setSubjects] = useState([]); // State for subjects
  const [adminInstituteId, setAdminInstituteId] = useState(''); // New state for admin's institute ID
  const [searchTerm, setSearchTerm] = useState(''); // State for student search term
  const [filteredStudents, setFilteredStudents] = useState([]); // State for filtered students based on search

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace('/login'); // Use the router instance to replace the current route
      } else {
        // Fetch the admin's institute ID
        const instituteRef = collection(db, 'INSTITUTES');
        const q = query(instituteRef, where('admin_id', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const institute = querySnapshot.docs[0].data();
          setAdminInstituteId(user.uid); // Set the institute ID
        } else {
          console.error("No institute found for this admin."); // Log if no institute is found
          router.replace('/unauthorized'); // Redirect to unauthorized page
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!adminInstituteId) return; // Ensure adminInstituteId is set before fetching

      // Fetch students
      const studentRef = collection(db, 'STUDENTS');
      const studentQ = query(studentRef, where('institute_id', '==', adminInstituteId)); // Filter students by institute ID
      const studentSnapshot = await getDocs(studentQ);
      const studentList = studentSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().studentName })); // Include document ID
      setStudents(studentList); // Set students state

      // Fetch classes
      const classRef = collection(db, 'CLASSES');
      const classQ = query(classRef, where('institute_id', '==', adminInstituteId)); // Filter classes by institute ID
      const classSnapshot = await getDocs(classQ);
      const classList = classSnapshot.docs.map(doc => ({ classID: doc.id, className: doc.data().className }));
      setClasses(classList); // Set classes state

      // Fetch subjects
      const subjectRef = collection(db, 'SUBJECTS');
      const subjectQ = query(subjectRef, where('institute_id', '==', adminInstituteId)); // Filter subjects by institute ID
      const subjectSnapshot = await getDocs(subjectQ);
      const subjectList = subjectSnapshot.docs.map(doc => ({ subjectID: doc.id, subjectName: doc.data().subjectName }));
      setSubjects(subjectList); // Set subjects state
    };

    fetchData(); // Fetch data only if the institute ID is set
  }, [adminInstituteId]);

  const fetchReportData = async (type, filter) => {
    // Replace with actual data fetching logic based on `type` and `filter`
    const mockData = [
      { name: 'John Doe', rollNum: '123', class: '10A', subject: 'Math', daysPresent: 20, percentage: '80%' },
      { name: 'Jane Smith', rollNum: '124', class: '10A', subject: 'Math', daysPresent: 18, percentage: '72%' },
      // Add more mock data as needed
    ];
    setReportData(mockData);
  };

  const handleReportTypeChange = (event) => {
    setSelectedReportType(event.target.value);
    setSelectedStudent('');
    setSelectedClass('');
    setSelectedSubject('');
    setReportData([]);
    setSearchTerm(''); // Reset search term when report type changes
    setFilteredStudents([]); // Reset filtered students
  };

  const handleGenerateReport = () => {
    const filter = {
      student: selectedStudent,
      class: selectedClass,
      subject: selectedSubject,
    };
    fetchReportData(selectedReportType, filter);
  };

  const handleStudentSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value) {
      const filtered = students.filter(student => 
        student.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents([]);
    }
  };

  return (
    <>
    <Navad/>
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md mb-4">
        <h2 className="text-xl font-semibold mb-4">Select Report Type</h2>
        <select
          value={selectedReportType}
          onChange={handleReportTypeChange}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="" disabled>Select Report Type</option>
          <option value="studentwise">Studentwise</option>
          <option value="datewise">Datewise</option>
          <option value="classwise">Classwise</option>
          <option value="subjectwise">Subjectwise</option>
        </select>

        {selectedReportType === 'studentwise' && (
          <div className="mb-4">
            <label className="block mb-2">Search Student:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleStudentSearch}
              placeholder="Type student name..."
              className="w-full p-2 border rounded mb-2"
            />
            {filteredStudents.length > 0 && (
              <ul className="border rounded bg-white max-h-40 overflow-y-auto">
                {filteredStudents.map(student => (
                  <li 
                    key={student.id} 
                    onClick={() => {
                      setSelectedStudent(student.id);
                      setSearchTerm(student.name); // Set the input to the selected student's name
                      setFilteredStudents([]); // Clear the filtered list
                    }}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {student.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {selectedReportType === 'classwise' && (
          <div className="mb-4">
            <label className="block mb-2">Select Class:</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="" disabled>Select Class</option>
              {classes.map((className) => (
                <option key={className.classID} value={className.classID}>{className.className}</option>
              ))}
            </select>
          </div>
        )}

        {selectedReportType === 'subjectwise' && (
          <div className="mb-4">
            <label className="block mb-2">Select Subject:</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="" disabled>Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject.subjectID} value={subject.subjectID}>{subject.subjectName}</option>
              ))}
            </select>
          </div>
        )}

        {selectedReportType === 'datewise' && (
          <div className="mb-4">
            <label className="block mb-2">From:</label>
            <input type="date" className="w-full p-2 mb-4 border rounded" />
            <label className="block mb-2">To:</label>
            <input type="date" className="w-full p-2 mb-4 border rounded" />
          </div>
        )}

        <button
          onClick={handleGenerateReport}
          className="bg-blue-500 text-white p-2 rounded w-full"
          disabled={!selectedReportType || (selectedReportType === 'studentwise' && !selectedStudent) || (selectedReportType === 'classwise' && !selectedClass) || (selectedReportType === 'subjectwise' && !selectedSubject)}
        >
          Generate Report
        </button>
      </div>

      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Report Data</h2>
        {reportData.length > 0 ? (
          <table className="min-w-full bg-white rounded shadow-md">
            <thead>
              <tr>
                <th className="p-2 border-b">Name</th>
                <th className="p-2 border-b">Roll Number</th>
                <th className="p-2 border-b">Days Present</th>
                <th className="p-2 border-b">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((data, index) => (
                <tr key={index}>
                  <td className="p-2 border-b">{data.name}</td>
                  <td className="p-2 border-b">{data.rollNum}</td>
                  <td className="p-2 border-b">{data.daysPresent}</td>
                  <td className="p-2 border-b">{data.percentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data available. Please select a report type and generate a report.</p>
        )}
      </div>
    </div>
    </>
  );
};

export default Reports;