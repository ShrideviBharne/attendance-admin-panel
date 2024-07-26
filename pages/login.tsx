import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { auth } from '../firebaseConfig'; // Import Firebase auth
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import signIn function

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // State to hold error message
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, username, password); // Authenticate user
      router.push('/admin'); // Redirect on success
      setError(null); // Clear error message on success
    } catch (error) {
      setError('Invalid email or password'); // Set error message on failure
      console.error('Error logging in:', error); // Handle errors
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <div className="bg-white p-8 rounded shadow-md w-80 mb-4">
          <input
            type="text"
            placeholder="Username/Institute Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          />
          {error && <p className="text-red-500 mb-4">{error}</p>} 
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Login
          </button>
        </div>
        <p>
          Not registered yet?{' '}
          <Link href="/register" className="text-blue-500">Register</Link>
        </p>
      </div>
    </>
  );
};

export default Login;