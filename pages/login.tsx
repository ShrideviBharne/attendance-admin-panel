import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navad from '../components/navad'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    // const res = await fetch('/api/login', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ username, password }),
    // });
    // const data = await res.json();
    // if (data.success) {
    router.push('/admin');
    // }
  };

  return (
    <>
    <Navad/>
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
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Login
        </button>
      </div>
      <p>
        Not registered yet?{' '}
       
        <Link href="/register" 
         className="text-blue-500">Register
      </Link>
      </p>
    </div>
    </>
  );
};

export default Login;
