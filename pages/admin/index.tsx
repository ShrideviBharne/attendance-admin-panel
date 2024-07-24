// import { useRouter } from 'next/router';
// import Navad from '../../components/navad'

// const AdminDashboard = () => {
//   const router = useRouter();

//   return (
//     <>
//     <Navad/>
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
//       <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
//       <div className="grid grid-cols-2 gap-4">
//         <button
//           onClick={() => router.push('/admin/add-class')}
//           className="bg-blue-500 text-white p-4 rounded"
//         >
//           Add/Update Class
//         </button>
//         <button
//           onClick={() => router.push('/admin/add-faculty')}
//           className="bg-blue-500 text-white p-4 rounded"
//         >
//           Add/Update Faculty
//         </button>
//         <button
//           onClick={() => router.push('/admin/add-subject')}
//           className="bg-blue-500 text-white p-4 rounded"
//         >
//           Add/Update Subjects
//         </button>
//         <button
//           onClick={() => router.push('/admin/add-student')}
//           className="bg-blue-500 text-white p-4 rounded"
//         >
//           Add/Update Students
//         </button>
//         <button
//           onClick={() => router.push('/admin/allotments')}
//           className="bg-blue-500 text-white p-4 rounded"
//         >
//           Allotments
//         </button>
//         <button
//           onClick={() => router.push('/admin/reports')}
//           className="bg-blue-500 text-white p-4 rounded"
//         >
//           Reports
//         </button>
//       </div>
//     </div>
//     </>
//   );
  
// };


// export default AdminDashboard;

import { useRouter } from 'next/router';
import Navad from '../../components/navad';

const AdminDashboard = () => {
  const router = useRouter();

  return (
    <>
      <Navad />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
          <button
            onClick={() => router.push('/admin/add-class')}
            className="bg-blue-500 text-white py-4 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600"
          >
            Add/Update Class
          </button>
          <button
            onClick={() => router.push('/admin/add-faculty')}
            className="bg-blue-500 text-white py-4 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600"
          >
            Add/Update Faculty
          </button>
          <button
            onClick={() => router.push('/admin/add-subject')}
            className="bg-blue-500 text-white py-4 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600"
          >
            Add/Update Subjects
          </button>
          <button
            onClick={() => router.push('/admin/add-student')}
            className="bg-blue-500 text-white py-4 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600"
          >
            Add/Update Students
          </button>
          <button
            onClick={() => router.push('/admin/allotments')}
            className="bg-blue-500 text-white py-4 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600"
          >
            Allotments
          </button>
          <button
            onClick={() => router.push('/admin/reports')}
            className="bg-blue-500 text-white py-4 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600"
          >
            Reports
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
