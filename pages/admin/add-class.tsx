import { useState, useEffect } from 'react';
import Navad from '../../components/navad';
import { db } from '../../firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  query,
  where
} from 'firebase/firestore';
import { useRouter } from 'next/router'; // Import useRouter hook
import { auth } from '../../firebaseConfig'; 
import { onAuthStateChanged } from 'firebase/auth';

const AddClass = () => {
  const router = useRouter();
  const [className, setClassName] = useState('');
  const [deptName, setDeptName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]); // New state for departments
  const [isEditing, setIsEditing] = useState(false);
  const [editClassID, setEditClassID] = useState('');
  const [adminInstituteId, setAdminInstituteId] = useState('');

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
          setAdminInstituteId(user.uid);
          // Fetch departments corresponding to the institute
          const deptRef = collection(db, 'DEPARTMENTS');
          const deptQ = query(deptRef, where('institute_id', '==', user.uid));
          const deptSnapshot = await getDocs(deptQ);
          const deptData = deptSnapshot.docs.map(doc => doc.data().deptName);
          setDepartments(deptData); // Set the departments state
        } else {
          console.error("No institute found for this admin."); // Log if no institute is found
          router.replace('/unauthorized');
        }
      }
    });
    return () => unsubscribe();
  }, [router]);
  
  useEffect(() => {
    const fetchClasses = async () => {
      const classesRef = collection(db, 'CLASSES');
      const q = query(classesRef, where('institute_id', '==', adminInstituteId));
      const querySnapshot = await getDocs(q);
      const classesData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setClasses(classesData);
    };
    if (adminInstituteId) {
      fetchClasses();
    }
  }, [adminInstituteId]);

  const handleAddClass = async () => {
    if (!adminInstituteId) {
      console.error("Institute ID is not set. Cannot add class.");
      return; // Exit the function if adminInstituteId is not set
    }

    const highestClassID = classes.length > 0 ? Math.max(...classes.map(cls => parseInt(cls.classID) || 0)) : 0; // Ensure NaN is handled
    const newClassID = (highestClassID + 1).toString(); // Generate new Class ID

    if (isEditing) {
      const classRef = doc(db, 'CLASSES', editClassID);
      await updateDoc(classRef, { classID: newClassID, className, deptName });
      setClasses(classes.map(cls => 
        cls.id === editClassID ? { id: editClassID, classID: newClassID, className, deptName } : cls
      ));
      setIsEditing(false);
      setEditClassID('');
    } else {
      const newClassData = { classID: newClassID, className, deptName, institute_id: adminInstituteId };
      await setDoc(doc(db, 'CLASSES', newClassID), newClassData);
      setClasses([...classes, { id: newClassID, classID: newClassID, className, deptName }]);
    }
    setClassName('');
    setDeptName('');
  };

  const handleDeleteClass = async (id) => {
    await deleteDoc(doc(db, 'CLASSES', id));
    setClasses(classes.filter(cls => cls.id !== id));
  };

  const handleEditClass = (cls) => {
    setClassName(cls.className);
    setDeptName(cls.deptName);
    setIsEditing(true);
    setEditClassID(cls.id);
  };

  const filteredClasses = classes.filter(cls =>
    cls.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.classID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.deptName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navad />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Add/Update Class</h1>
        <div className="bg-white p-8 rounded shadow-md w-80 mb-4">
          <input
            type="text"
            placeholder="Class Name"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          />
          <select
            value={deptName}
            onChange={(e) => setDeptName(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          >
            <option value="" >Select Department</option>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>{dept}</option>
            ))}
          </select>
          <button
            onClick={handleAddClass}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            {isEditing ? 'Update' : 'Add'}
          </button>
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-80 p-2 border border-gray-300 rounded"
        />
        <table className="min-w-full bg-white rounded shadow-md">
          <thead>
            <tr>
              <th className="p-1 border-b">Class ID</th>
              <th className="p-1 border-b">Class Name</th>
              <th className="p-1 border-b">Department Name</th>
              <th className="p-1 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClasses.map((cls) => (
              <tr key={cls.id}>
                <td className="p-5 border-b">{cls.classID}</td>
                <td className="p-2 border-b">{cls.className}</td>
                <td className="p-2 border-b">{cls.deptName}</td>
                <td className="p-2 border-b">
                  <button
                    onClick={() => handleEditClass(cls)}
                    className="bg-yellow-500 text-white p-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClass(cls.id)}
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

export default AddClass;