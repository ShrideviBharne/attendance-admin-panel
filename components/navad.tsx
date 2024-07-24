import Link from 'next/link';
import { useRouter } from 'next/router';

const Navad = () => {
  const router = useRouter();
  const handleLogout = () => {
    // Perform logout logic, e.g., clear tokens or session data
    localStorage.removeItem('authToken'); // Example for local storage

    // Redirect to the login page
    router.push('/login');
  };
    return (
      <nav className="bg-blue-600 p-4 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold hover:text-gray-200 transition duration-300">
            Attendance System
          </Link>
          <div>
          <a
            href="#"
            className="text-white ml-4"
            onClick={handleLogout}
          >
            Logout
          </a>
        </div>
          
        </div>
      </nav>
    );
  };
  
  export default Navad;
  