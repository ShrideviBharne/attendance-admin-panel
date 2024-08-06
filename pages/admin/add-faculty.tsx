import { useState, useEffect } from 'react';
import Navad from '../../components/navad';
import { db, auth } from '../../firebaseConfig';
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  query,
  where
} from 'firebase/firestore';
import { useRouter } from 'next/router';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

const AddFaculty = () => {
  const router = useRouter();
  const [dept, setDept] = useState('');
  const [facultyName, setFacultyName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [faculties, setFaculties] = useState([]);
  const [facultyID, setFacultyID] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [adminInstituteId, setAdminInstituteId] = useState('');
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace('/login');
      } else {
        const instituteRef = collection(db, 'INSTITUTES');
        const q = query(instituteRef, where('admin_id', '==', user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const institute = querySnapshot.docs[0].data();
          setAdminInstituteId(user.uid);
          fetchDepartments(user.uid);
        } else {
          console.error("No institute found for this admin.");
          //router.replace('/unauthorized');
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchDepartments = async (userId) => {
    const departmentsRef = collection(db, 'DEPARTMENTS');
    const q = query(departmentsRef, where('institute_id', '==', userId));
    const querySnapshot = await getDocs(q);
    const departmentsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setDepartments(departmentsData);
  };

  useEffect(() => {
    const fetchFaculties = async () => {
      const facultiesRef = collection(db, 'FACULTY');
      const q = query(facultiesRef, where('institute_id', '==', adminInstituteId));
      const querySnapshot = await getDocs(q);
      const facultiesData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, facultyID: doc.data().facultyID }));
      setFaculties(facultiesData);

      const facultyIDs = facultiesData.map(fac => fac.facultyID).filter(id => !isNaN(id));
      const highestID = facultyIDs.length > 0 ? Math.max(...facultyIDs) : 0;
      setFacultyID((highestID + 1).toString());
    };
    if (adminInstituteId) {
      fetchFaculties();
    }
  }, [adminInstituteId]);

  const handleAddFaculty = async () => {
    if (!facultyName || !email || !phoneNumber || !password || !dept) {
      console.error("All fields are required.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) {
        const newFacultyID = facultyID;
        const newFaculty = {
          facultyID: newFacultyID,
          facultyName,
          email,
          phoneNumber,
          dept,
          institute_id: adminInstituteId
        };

        await setDoc(doc(db, 'FACULTY', newFacultyID.toString()), newFaculty);
        setFaculties([...faculties, newFaculty]);

        setFacultyID((parseInt(newFacultyID) + 1).toString());
        setFacultyName('');
        setEmail('');
        setPhoneNumber('');
        setPassword('');
        setDept('');
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error adding faculty: ", error);
    }
  };

  const handleDeleteFaculty = async (id) => {
    await deleteDoc(doc(db, 'FACULTY', id));
    setFaculties(faculties.filter(fac => fac.id !== id));
  };

  const handleUpdateFaculty = async () => {
    const facultyRef = doc(db, 'FACULTY', facultyID);
    const docSnap = await getDoc(facultyRef);

    if (docSnap.exists()) {
      const updatedFaculty = {
        facultyName,
        email,
        phoneNumber,
        dept,
        institute_id: adminInstituteId
      };
      await updateDoc(facultyRef, updatedFaculty);
      setFaculties(faculties.map(fac => fac.id === facultyID ? { id: facultyID, ...updatedFaculty } : fac));
      setFacultyID('');
      setFacultyName('');
      setEmail('');
      setPhoneNumber('');
      setPassword('');
      setDept('');
      setIsEditing(false);
    } else {
      console.error("No document found with ID:", facultyID);
    }
  };

  const handleEditFaculty = (fac) => {
    setFacultyID(fac.id);
    setFacultyName(fac.facultyName);
    setEmail(fac.email);
    setPhoneNumber(fac.phoneNumber);
    setPassword(fac.password);
    setDept(fac.deptid);
    setIsEditing(true);
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
          <select
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Department</option>
            {departments.map(department => (
              <option key={department.id} value={department.deptName}>{department.deptName}</option>
            ))}
          </select>
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
            onClick={isEditing ? handleUpdateFaculty : handleAddFaculty}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            {isEditing ? 'Update' : 'Add'}
          </button>
        </div>
        <table className="min-w-full bg-white rounded shadow-md">
          <thead>
            <tr>
              <th className="p-2 border-b">Department</th>
              <th className="p-2 border-b">Faculty Name</th>
              <th className="p-2 border-b">Email</th>
              <th className="p-2 border-b">Phone Number</th>
              <th className="p-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFaculties.map((fac) => (
              <tr key={fac.id}>
                <td className="p-2 border-b">{fac.dept}</td>
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
