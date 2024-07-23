import Link from 'next/link';

const Navad = () => {
    return (
      <nav className="bg-blue-600 p-4 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold hover:text-gray-200 transition duration-300">
            Attendance System
          </Link>
          
        </div>
      </nav>
    );
  };
  
  export default Navad;
  