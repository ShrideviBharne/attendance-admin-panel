import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter hook
import { auth } from '../../firebaseConfig'; 
import { onAuthStateChanged } from 'firebase/auth';
import Navad from '../../components/navad';

const AddFaculty = () => {
  const router = useRouter(); // Initialize useRouter hook
  const [facultyID, setFacultyID] = useState('');
  const [facultyName, setFacultyName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [faculties, setFaculties] = useState([
    { facultyID: '1', facultyName: 'Faculty 1', email: 'faculty1@example.com', phoneNumber: '1234567890' },
    { facultyID: '2', facultyName: 'Faculty 2', email: 'faculty2@example.com', phoneNumber: '0987654321' },
  ]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/login'); // Use the router instance to replace the current route
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleAddFaculty = () => {
    setFaculties([...faculties, { facultyID, facultyName, email, phoneNumber }]);
    setFacultyID('');
    setFacultyName('');
    setEmail('');
    setPhoneNumber('');
    setPassword('');
  };

  const handleDeleteFaculty = (id) => {
    setFaculties(faculties.filter(fac => fac.facultyID !== id));
  };

  const handleUpdateFaculty = (id) => {
    const updatedFaculties = faculties.map(fac => 
      fac.facultyID === id ? { ...fac, facultyName, email, phoneNumber } : fac
    );
    setFaculties(updatedFaculties);
    setFacultyID('');
    setFacultyName('');
    setEmail('');
    setPhoneNumber('');
    setPassword('');
  };

  const filteredFaculties = faculties.filter(fac =>
    fac.facultyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <Navad/>
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
            <tr key={fac.facultyID}>
              <td className="p-2 border-b">{fac.facultyID}</td>
              <td className="p-2 border-b">{fac.facultyName}</td>
              <td className="p-2 border-b">{fac.email}</td>
              <td className="p-2 border-b">{fac.phoneNumber}</td>
              <td className="p-2 border-b">
                <button
                  onClick={() => handleUpdateFaculty(fac.facultyID)}
                  className="bg-yellow-500 text-white p-2 rounded mr-2"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteFaculty(fac.facultyID)}
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
