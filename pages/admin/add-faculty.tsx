import { useState, useEffect } from 'react';
import Navad from '../../components/navad';
import { db } from '../../firebaseConfig';
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
import { auth } from '../../firebaseConfig'; 
import { onAuthStateChanged } from 'firebase/auth';

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
        
        console.log("User UID:", user.uid); // Log the user ID
        console.log("Query Snapshot:", querySnapshot.docs); // Log the query results

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
    const fetchFaculties = async () => {
      const facultiesRef = collection(db, 'FACULTY');
      const q = query(facultiesRef, where('institute_id', '==', adminInstituteId)); // Filter by institute ID
      const querySnapshot = await getDocs(q);
      const facultiesData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, facultyID: doc.data().facultyID })); // Include facultyID
      setFaculties(facultiesData);
      
      // Fetch the highest faculty ID from FACULTY
      const facultyIDs = facultiesData.map(fac => fac.facultyID).filter(id => !isNaN(id));
      const highestID = facultyIDs.length > 0 ? Math.max(...facultyIDs) : 0;
      setFacultyID((highestID + 1).toString()); // Set auto-incremented faculty ID
    };
    if (adminInstituteId) {
      fetchFaculties(); // Fetch faculties only if the institute ID is set
    }
  }, [adminInstituteId]);

  const handleAddFaculty = async () => {
    if (!facultyName || !email || !phoneNumber || !password || !dept) {
      console.error("All fields are required.");
      return; // Exit if any field is empty
    }

    try {
      // Ensure user is authenticated
      const user = auth.currentUser; // Check if user is already authenticated
      if (!user) {
        console.error("User is not authenticated.");
        return; // Exit if user is not authenticated
      }

      // Fetch the current faculty IDs
      const querySnapshot = await getDocs(collection(db, 'FACULTY'));
      const existingFacultyIDs = querySnapshot.docs.map(doc => doc.data().facultyID);

      // Generate a new unique faculty ID
      let newFacultyID = parseInt(facultyID);
      while (existingFacultyIDs.includes(newFacultyID)) {
        newFacultyID++; // Increment until a unique ID is found
      }

      const newFaculty = { 
        facultyID: newFacultyID, 
        facultyName, 
        email, 
        phoneNumber, 
        password, 
        dept,
        institute_id: adminInstituteId // Include institute ID
      };

      // Debugging: Log the newFaculty data
      console.log("New Faculty Data:", newFaculty);

      // Using setDoc instead of addDoc to use custom facultyID
      await setDoc(doc(db, 'FACULTY', newFacultyID.toString()), newFaculty);
      console.log("Document written with ID: ", newFacultyID); // Log the new document ID
      setFaculties([...faculties, newFaculty]); // Add the new faculty to the state
      
      // Reset fields after successful addition
      setFacultyID((newFacultyID + 1).toString()); // Prepare the next ID
      setFacultyName('');
      setEmail('');
      setPhoneNumber('');
      setPassword('');
      setDept('');
      setIsEditing(false); // Reset edit mode
    } catch (error) {
      console.error("Error adding faculty: ", error); // Log the entire error object for more details
    }
  };

  const handleDeleteFaculty = async (id) => {
    await deleteDoc(doc(db, 'FACULTY', id));
    setFaculties(faculties.filter(fac => fac.id !== id));
  };

  const handleUpdateFaculty = async () => {
    const facultyRef = doc(db, 'FACULTY', facultyID); // Use facultyID from state
    const docSnap = await getDoc(facultyRef); // Check if the document exists

    if (docSnap.exists()) {
      const updatedFaculty = { 
        facultyName, 
        email, 
        phoneNumber, 
        password, 
        dept,
        institute_id: adminInstituteId // Include institute ID
      };
      await updateDoc(facultyRef, updatedFaculty);
      setFaculties(faculties.map(fac => fac.id === facultyID ? { id: facultyID, ...updatedFaculty } : fac));
      // Reset fields after successful update
      setFacultyID('');
      setFacultyName('');
      setEmail('');
      setPhoneNumber('');
      setPassword('');
      setDept('');
      setIsEditing(false); // Reset edit mode
    } else {
      console.error("No document found with ID:", facultyID); // Log an error if the document does not exist
    }
  };

  const handleEditFaculty = (fac) => {
    setFacultyID(fac.id);
    setFacultyName(fac.facultyName);
    setEmail(fac.email);
    setPhoneNumber(fac.phoneNumber);
    setPassword(fac.password);
    setDept(fac.deptid);
    setIsEditing(true); // Set edit mode
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
            placeholder="Department"
            value={dept}
            onChange={(e) => setDept(e.target.value)}
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
            onClick={isEditing ? handleUpdateFaculty : handleAddFaculty}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            {isEditing ? 'Update' : 'Add'}
          </button>
        </div>
        <table className="min-w-full bg-white rounded shadow-md">
          <thead>
            <tr>
              <th className="p-2 border-b">Department ID</th>
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