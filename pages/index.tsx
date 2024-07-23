import styles from '../styles/Home.module.css';
import Link from 'next/link';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
     
      <h1 className="text-5xl font-bold mb-4 flex justify-center items-center">Welcome to Attendance System Admin Panel</h1>
      {/* <Link href="/login"
        className="bg-blue-500 text-white p-2 rounded">Login
      </Link> */}
    </div>
    </>
  );
};

export default Home;




