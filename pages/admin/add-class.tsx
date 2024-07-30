import { useState, useEffect } from 'react';
import Navad from '../../components/navad';
import { db } from '../../firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { useRouter } from 'next/router'; // Import useRouter hook
import { auth } from '../../firebaseConfig'; 
import { onAuthStateChanged } from 'firebase/auth';


const AddClass = () => {
  const router =useRouter();
  const [className, setClassName] = useState('');
  const [classID, setClassID] = useState('');
  const [deptName, setDeptName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [classes, setClasses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editClassID, setEditClassID] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/login'); // Use the router instance to replace the current route
      }
    });
    return () => unsubscribe();
  }, [router]);
  
  useEffect(() => {
    
    const fetchClasses = async () => {
      const querySnapshot = await getDocs(collection(db, 'classes'));
      const classesData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setClasses(classesData);
    };
    fetchClasses();
  }, []);

  const handleAddClass = async () => {
    if (isEditing) {
      const classRef = doc(db, 'classes', editClassID);
      await updateDoc(classRef, { classID, className, deptName });
      setClasses(classes.map(cls => 
        cls.id === editClassID ? { id: editClassID, classID, className, deptName } : cls
      ));
      setIsEditing(false);
      setEditClassID('');
    } else {
      const docRef = await addDoc(collection(db, 'classes'), { classID, className, deptName });
      setClasses([...classes, { id: docRef.id, classID, className, deptName }]);
    }
    setClassID('');
    setClassName('');
    setDeptName('');
  };

  const handleDeleteClass = async (id) => {
    await deleteDoc(doc(db, 'classes', id));
    setClasses(classes.filter(cls => cls.id !== id));
  };

  const handleEditClass = (cls) => {
    setClassID(cls.classID);
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
            placeholder="Class ID"
            value={classID}
            onChange={(e) => setClassID(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Class Name"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Department Name"
            value={deptName}
            onChange={(e) => setDeptName(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          />
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