import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../firebaseConfig'; // Import Firebase auth
import { signOut } from 'firebase/auth'; // Import signOut function

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut(auth); // Sign out the user
        // Clear local storage if it exists
        if (localStorage.getItem('authToken')) {
          localStorage.removeItem('authToken'); // Example for local storage
        }
        // Redirect to login page
        router.replace('/login');
        window.location.replace('/login'); // Replace the current URL with login page URL
        window.history.pushState(null, '', '/login'); // Clear the history stack
      } catch (error) {
        console.error('Error logging out:', error); // Handle errors
      }
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