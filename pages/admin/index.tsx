import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../../firebaseConfig'; 
import { onAuthStateChanged } from 'firebase/auth';
import { db } from '../../firebaseConfig'; // Import Firestore database
import { collection, getDocs, query, where } from 'firebase/firestore'; // Import Firestore functions
import Navad from '../../components/navad';

const AdminDashboard = () => {
  const [instituteData, setInstituteData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace('/login');
      } else {
        const institutesRef = collection(db, 'INSTITUTES');
        const q = query(institutesRef, where('admin_id', '==', user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const institute = querySnapshot.docs[0].data();
          setInstituteData(institute);
        } else {
          router.replace('/unauthorized');
        }
      }
    });

    return () => unsubscribe(); 
  }, [router]);

  return (
    <>
      <Navad />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>
        {instituteData ? (
          <div>
            <h1>{instituteData.name}</h1>
            
            <p>{instituteData.phone_number}</p>
            <p>{instituteData.email}</p>
            {/* Other institute details */}
          </div>
        ) : (
          <p>Loading...</p>
        )}
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