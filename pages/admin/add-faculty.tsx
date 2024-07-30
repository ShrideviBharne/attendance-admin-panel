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
import { onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth'; // Add this import

const AddFaculty = () => {
  const router= useRouter();
  const [facultyID, setFacultyID] = useState('');
  const [facultyName, setFacultyName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [faculties, setFaculties] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/login'); // Use the router instance to replace the current route
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchFaculties = async () => {
      const querySnapshot = await getDocs(collection(db, 'faculties'));
      const facultiesData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setFaculties(facultiesData);
    };
    fetchFaculties();
  }, []);

  const handleAddFaculty = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newFaculty = { facultyID, facultyName, email, phoneNumber, password };
      const docRef = await addDoc(collection(db, 'faculties'), newFaculty);
      setFaculties([...faculties, { id: docRef.id, ...newFaculty }]);
      setFacultyID('');
      setFacultyName('');
      setEmail('');
      setPhoneNumber('');
      setPassword('');
    } catch (error) {
      console.error("Error adding faculty: ", error);
    }
  };

  const handleDeleteFaculty = async (id) => {
    await deleteDoc(doc(db, 'faculties', id));
    setFaculties(faculties.filter(fac => fac.id !== id));
  };

  const handleUpdateFaculty = async (id) => {
    const updatedFaculty = { facultyID, facultyName, email, phoneNumber, password };
    const facultyRef = doc(db, 'faculties', id);
    await updateDoc(facultyRef, updatedFaculty);
    setFaculties(faculties.map(fac => fac.id === id ? { id, ...updatedFaculty } : fac));
    setFacultyID('');
    setFacultyName('');
    setEmail('');
    setPhoneNumber('');
    setPassword('');
  };

  const handleEditFaculty = (fac) => {
    setFacultyID(fac.facultyID);
    setFacultyName(fac.facultyName);
    setEmail(fac.email);
    setPhoneNumber(fac.phoneNumber);
    setPassword(fac.password);
  };

  const filteredFaculties = faculties.filter(fac =>
    fac.facultyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navad />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Add/Update Faculty</h1>
        <div className="bg-white p-8 rounded shadow-md w-80 mb-4">
          <input
            type="text"
            placeholder="Search Faculty"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Faculty ID"
            value={facultyID}
            onChange={(e) => setFacultyID(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Faculty Name"
            value={facultyName}
            onChange={(e) => setFacultyName(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleAddFaculty}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Add
          </button>
        </div>
        <table className="min-w-full bg-white rounded shadow-md">
          <thead>
            <tr>
              <th className="p-2 border-b">Faculty ID</th>
              <th className="p-2 border-b">Faculty Name</th>
              <th className="p-2 border-b">Email</th>
              <th className="p-2 border-b">Phone Number</th>
              <th className="p-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFaculties.map((fac) => (
              <tr key={fac.id}>
                <td className="p-2 border-b">{fac.facultyID}</td>
                <td className="p-2 border-b">{fac.facultyName}</td>
                <td className="p-2 border-b">{fac.email}</td>
                <td className="p-2 border-b">{fac.phoneNumber}</td>
                <td className="p-2 border-b">
                  <button
                    onClick={() => handleEditFaculty(fac)}
                    className="bg-yellow-500 text-white p-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteFaculty(fac.id)}
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

export default AddFaculty;