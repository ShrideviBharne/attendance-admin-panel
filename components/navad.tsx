import Link from 'next/link';
import { useRouter } from 'next/router';
import { auth } from '../firebaseConfig'; // Import auth utility
import { signOut } from 'firebase/auth'; // Import signOut function

const Navad = () => {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await signOut(auth); // Use Firebase auth to sign out
      localStorage.removeItem('authToken'); // Clear local storage token

      // Redirect to the login page without allowing back navigation
      router.replace('/login'); // Use replace instead of push
    } catch (error) {
      console.error('Error signing out:', error);
    }
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