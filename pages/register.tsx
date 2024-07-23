import { useState } from 'react';
import Navad from '../components/navad'

const Register = () => {
  const [instituteName, setInstituteName] = useState('');
  const [address, setAddress] = useState('');
  const [departments, setDepartments] = useState('');
  const [password, setPassword] = useState('');
  const [logo, setLogo] = useState('');

  const handleRegister = async () => {
    // const res = await fetch('/api/register', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ instituteName, address, departments, password, logo }),
    // });
    // const data = await res.json();
    setInstituteName('');
    setAddress('');
    setDepartments('');
    setPassword('');
    setLogo('');
  };

  return (
    <>
    <Navad/>
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
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="file"
          onChange={(e) => setLogo(e.target.files[0].name)}
          className="mb-4 w-full p-2 border border-gray-300 rounded"
        />
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
