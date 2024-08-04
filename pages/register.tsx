import { useState } from 'react';
import Navbar from '../components/Navbar';
import { db } from '../firebaseConfig'; // Import Firestore
import { collection, doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import { useRouter } from 'next/router'; // Import useRouter for redirecting
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'; // Import Firebase Auth functions

const Register = () => {
  const [instituteName, setInstituteName] = useState('');
  const [address, setAddress] = useState('');
  const [departments, setDepartments] = useState('');
  const [password, setPassword] = useState('');
  const [logo, setLogo] = useState('');
  const [email, setEmail] = useState(''); // Add email state
  const router = useRouter(); // Initialize useRouter
  const auth = getAuth(); // Initialize Firebase Auth

  const handleRegister = async () => {
    try {
      // Register user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add a new document with instituteName as the document ID
      const instituteRef = doc(db, 'INSTITUTES', instituteName); // Create a reference with instituteName as ID
      await setDoc(instituteRef, {
        address,
        departments,
        logo,
        uid: user.uid, // Store user ID
        admin_id: user.uid, // Store the admin's user ID directly
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Clear the form fields
      setInstituteName('');
      setAddress('');
      setDepartments('');
      setPassword('');
      setLogo('');
      setEmail(''); // Clear email field
      alert('Registration successful!'); // Optional: Notify the user
      // Redirect to login page
      router.push('/login'); // Redirect to login page
    } catch (error) {
      console.error('Error adding document: ', error); // Handle errors
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Register/Institute Header</h1>
        <div className="bg-white p-8 rounded shadow-md w-80 mb-4">
          <input
            type="text"
            placeholder="Institute Name"
            value={instituteName}
            onChange={(e) => setInstituteName(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Departments (comma separated)"
            value={departments}
            onChange={(e) => setDepartments(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="email" // Change type to email
            placeholder="Email"
            value={email} // Bind email state
            onChange={(e) => setEmail(e.target.value)} // Update email state
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          />
          {/* <input
            type="file"
            onChange={(e) => setLogo(e.target.files[0].name)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          /> */}
          <button
            onClick={handleRegister}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Register
          </button>
        </div>
      </div>
    </>
  );
};

export default Register;