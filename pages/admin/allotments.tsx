import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; 
import { auth } from '../../firebaseConfig'; 
import { onAuthStateChanged } from 'firebase/auth';
import { db } from '../../firebaseConfig'; // Import Firestore database
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore'; // Import Firestore functions
import Navad from '../../components/navad';

const Allotments = () => {
  const router = useRouter();
  const [classID, setClassID] = useState('');
  const [facultyID, setFacultyID] = useState('');
  const [subjectID, setSubjectID] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [allotments, setAllotments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [adminInstituteId, setAdminInstituteId] = useState(''); // New state for admin's institute ID

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace('/login');
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
          router.replace('/unauthorized');
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      const facultyRef = collection(db, 'FACULTY');
      const facultyQ = query(facultyRef, where('institute_id', '==', adminInstituteId)); // Filter faculties by institute ID
      const facultySnapshot = await getDocs(facultyQ);
      const facultyList = facultySnapshot.docs.map(doc => ({ facultyID: doc.id, facultyName: doc.data().facultyName }));
      setFaculties(facultyList);

      const classRef = collection(db, 'CLASSES');
      const classQ = query(classRef, where('institute_id', '==', adminInstituteId)); // Filter classes by institute ID
      const classSnapshot = await getDocs(classQ);
      const classList = classSnapshot.docs.map(doc => ({ classID: doc.id, className: doc.data().className }));
      setClasses(classList);

      const subjectRef = collection(db, 'SUBJECTS');
      const subjectQ = query(subjectRef, where('institute_id', '==', adminInstituteId)); // Filter subjects by institute ID
      const subjectSnapshot = await getDocs(subjectQ);
      const subjectList = subjectSnapshot.docs.map(doc => ({ subjectID: doc.id, subjectName: doc.data().subjectName }));
      setSubjects(subjectList);

      // Fetch allotments
      const allotmentRef = collection(db, 'ALLOTMENTS');
      const allotmentQ = query(allotmentRef, where('institute_id', '==', adminInstituteId)); // Filter allotments by institute ID
      const allotmentSnapshot = await getDocs(allotmentQ);
      const allotmentList = allotmentSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })); // Include document ID
      setAllotments(allotmentList); // Set allotments state
    };

    if (adminInstituteId) {
      fetchData(); // Fetch data only if the institute ID is set
    }
  }, [adminInstituteId]);

  const handleAddAllotment = async () => {
    const newAllotment = { classID, facultyID, subjectID, institute_id: adminInstituteId }; // Include institute ID
    if (editMode) {
      // Update logic here if needed
    } else {
      await addDoc(collection(db, 'ALLOTMENTS'), newAllotment); // Store in ALLOTMENT table
      setAllotments([...allotments, newAllotment]);
    }
    setClassID('');
    setFacultyID('');
    setSubjectID('');
  };

  const handleDeleteAllotment = (index) => {
    setAllotments(allotments.filter((_, i) => i !== index));
  };

  const handleEditAllotment = (index) => {
    const allotment = allotments[index];
    setClassID(allotment.classID);
    setFacultyID(allotment.facultyID);
    setSubjectID(allotment.subjectID);
    setEditMode(true);
    setEditIndex(index);
  };

  const filteredAllotments = allotments.filter(allot =>
    classes.find(cls => cls.classID === allot.classID)?.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculties.find(fac => fac.facultyID === allot.facultyID)?.facultyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subjects.find(sub => sub.subjectID === allot.subjectID)?.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <Navad/>
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Allotments</h1>
      <div className="bg-white p-8 rounded shadow-md w-80 mb-4">
        <select
          value={classID}
          onChange={(e) => setClassID(e.target.value)}
          className="mb-4 w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Select Class</option>
          {classes.map(cls => (
            <option key={cls.classID} value={cls.classID}>
              {cls.className}
            </option>
          ))}
        </select>
        <select
          value={facultyID}
          onChange={(e) => setFacultyID(e.target.value)}
          className="mb-4 w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Select Faculty</option>
          {faculties.map(fac => (
            <option key={fac.facultyID} value={fac.facultyID}>
              {fac.facultyName}
            </option>
          ))}
        </select>
        <select
          value={subjectID}
          onChange={(e) => setSubjectID(e.target.value)}
          className="mb-4 w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Select Subject</option>
          {subjects.map(sub => (
            <option key={sub.subjectID} value={sub.subjectID}>
              {sub.subjectName}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddAllotment}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          {editMode ? 'Update' : 'Add'}
        </button>
      </div>
      <input
        type="text"
        placeholder="Search Allotments"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-80 p-2 border border-gray-300 rounded"
      />
      <table className="min-w-full bg-white rounded shadow-md">
        <thead>
          <tr>
            <th className="p-2 border-b">Class Name</th>
            <th className="p-2 border-b">Faculty Name</th>
            <th className="p-2 border-b">Subject Name</th>
            <th className="p-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAllotments.map((allot, index) => {
            const className = classes.find(cls => cls.classID === allot.classID)?.className || 'N/A';
            const facultyName = faculties.find(fac => fac.facultyID === allot.facultyID)?.facultyName || 'N/A';
            const subjectName = subjects.find(sub => sub.subjectID === allot.subjectID)?.subjectName || 'N/A';

            return (
              <tr key={index}>
                <td className="p-2 border-b">{className}</td>
                <td className="p-2 border-b">{facultyName}</td>
                <td className="p-2 border-b">{subjectName}</td>
                <td className="p-2 border-b">
                  <button
                    onClick={() => handleEditAllotment(index)}
                    className="bg-yellow-500 text-white p-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAllotment(index)}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default Allotments;