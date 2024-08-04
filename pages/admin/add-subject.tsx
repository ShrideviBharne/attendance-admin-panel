import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../../firebaseConfig'; 
import { onAuthStateChanged } from 'firebase/auth';
import { db } from '../../firebaseConfig'; // Import Firestore database
import { collection, getDocs, setDoc, doc, deleteDoc, query, where } from 'firebase/firestore'; // Import Firestore functions
import Navad from '../../components/navad';

const AddSubject = () => {
  const router = useRouter();
  const [subjectID, setSubjectID] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [classID, setClassID] = useState('');
  const [department, setDepartment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editSubjectID, setEditSubjectID] = useState(null);
  const [subjects, setSubjects] = useState([]); // State to hold subjects
  const [classes, setClasses] = useState([]); // State to hold classes
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
    const fetchSubjects = async () => {
      const subjectsRef = collection(db, 'SUBJECTS');
      const q = query(subjectsRef, where('institute_id', '==', adminInstituteId)); // Filter subjects by institute ID
      const querySnapshot = await getDocs(q);
      const subjectsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setSubjects(subjectsData);
    };
    
    const fetchClasses = async () => {
      const classesRef = collection(db, 'CLASSES');
      const q = query(classesRef, where('institute_id', '==', adminInstituteId)); // Filter classes by institute ID
      const querySnapshot = await getDocs(q);
      const classesData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setClasses(classesData);
    };

    if (adminInstituteId) {
      fetchSubjects(); // Fetch subjects only if the institute ID is set
      fetchClasses(); // Fetch classes only if the institute ID is set
    }
  }, [adminInstituteId]);

  const handleAddSubject = async () => {
    try {
      const newSubject = { subjectID, subjectName, classID, department, institute_id: adminInstituteId }; // Include institute ID
      await setDoc(doc(db, 'SUBJECTS', subjectID), newSubject); // Add subject to Firestore
      setSubjects([...subjects, newSubject]); // Update local state
      setSubjectID('');
      setSubjectName('');
      setClassID('');
      setDepartment('');
    } catch (error) {
      console.error("Error adding subject: ", error);
    }
  };

  const handleDeleteSubject = async (id) => {
    try {
      await deleteDoc(doc(db, 'SUBJECTS', id)); // Delete subject from Firestore
      setSubjects(subjects.filter(sub => sub.id !== id)); // Update local state
    } catch (error) {
      console.error("Error deleting subject: ", error);
    }
  };

  const handleEditSubject = (subject) => {
    setEditMode(true);
    setEditSubjectID(subject.subjectID);
    setSubjectID(subject.subjectID);
    setSubjectName(subject.subjectName);
    setClassID(subject.classID);
    setDepartment(subject.department);
  };

  const filteredSubjects = subjects.filter(sub =>
    sub.subjectName && sub.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navad />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Add/Update Subjects</h1>
        <div className="bg-white p-8 rounded shadow-md w-80 mb-4">
          <select
            value={classID}
            onChange={(e) => setClassID(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Class</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.className} {/* Assuming className is a property in your CLASSES collection */}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Subject ID"
            value={subjectID}
            onChange={(e) => setSubjectID(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Subject Name"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleAddSubject}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            {editMode ? 'Update' : 'Add'}
          </button>
        </div>
        <input
          type="text"
          placeholder="Search Subjects"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-80 p-2 border border-gray-300 rounded"
        />
        <table className="min-w-full bg-white rounded shadow-md">
          <thead>
            <tr>
              <th className="p-2 border-b">Subject ID</th>
              <th className="p-2 border-b">Subject Name</th>
              <th className="p-2 border-b">Class ID</th>
              <th className="p-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubjects.map(sub => (
              <tr key={sub.id}>
                <td className="p-2 border-b">{sub.subjectID}</td>
                <td className="p-2 border-b">{sub.subjectName}</td>
                <td className="p-2 border-b">{sub.classID}</td>
                <td className="p-2 border-b">
                  <button
                    onClick={() => handleEditSubject(sub)}
                    className="bg-yellow-500 text-white p-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSubject(sub.subjectID)}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AddSubject;