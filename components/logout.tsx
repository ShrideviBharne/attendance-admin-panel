import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = () => {
      // Clear user session or token from local storage or cookie
      localStorage.removeItem('authToken'); // Example for local storage
      // You may also want to clear cookies or other storage mechanisms

      // Redirect to login page
      router.push('/login');
    };

    handleLogout();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold">Logging out</h1>
    </div>
  );
};

export default Logout;
