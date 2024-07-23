import Link from 'next/link';

// const Navbar = () => {
//   return (
//     <nav className="bg-blue-600 p-4 text-white shadow-md">
//       <div className="container mx-auto flex justify-between items-center">
//         <Link href="/" className="text-2xl font-bold hover:text-gray-200 transition duration-300">
//           Attendance System
//         </Link>
//         <div className="flex space-x-4 justify-center items-center">
//           <Link href="/login" className="hover:text-gray-200 transition duration-300">
//             Login
//           </Link>
//           <Link href="/register" className="hover:text-gray-200 transition duration-300">
//             Register
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-gray-200 transition duration-300">
          Attendance System
        </Link>
        <div className="flex space-x-4 justify-center items-center">
          <Link href="/login" className="hover:text-gray-200 transition duration-300">
            Login
          </Link>
          <Link href="/register" className="hover:text-gray-200 transition duration-300">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
