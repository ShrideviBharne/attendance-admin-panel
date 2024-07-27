import { useState, useEffect } from 'react';
import Navad from '../../components/navad';
import { db } from './../../config/firebaseconfig';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const AddStudent = () => {
  const [studentName, setStudentName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [classID, setClassID] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editRollNumber, setEditRollNumber] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classCollection = collection(db, 'classes');
        const classSnapshot = await getDocs(classCollection);
        const classList = classSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClasses(classList);
      } catch (error) {
        console.error("Error fetching classes: ", error);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentCollection = collection(db, 'students');
        const studentSnapshot = await getDocs(studentCollection);
        const studentList = studentSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStudents(studentList);
      } catch (error) {
        console.error("Error fetching students: ", error);
      }
    };

    fetchStudents();
  }, []);

  const handleAddStudent = async () => {
    try {
      if (isEditing) {
        const studentRef = doc(db, 'students', editRollNumber);
        await updateDoc(studentRef, { studentName, rollNumber, classID });
        setStudents(students.map(stu =>
          stu.rollNumber === editRollNumber
            ? { studentName, rollNumber, classID }
            : stu
        ));
        setIsEditing(false);
        setEditRollNumber('');
      } else {
        const newStudent = { studentName, rollNumber, classID };
        const studentRef = doc(db, 'students', rollNumber);
        await setDoc(studentRef, newStudent);
        setStudents([...students, newStudent]);
      }
      setStudentName('');
      setRollNumber('');
      setClassID('');
    } catch (error) {
      console.error("Error adding/updating student: ", error);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      const studentRef = doc(db, 'students', id);
      await deleteDoc(studentRef);
      setStudents(students.filter(stu => stu.rollNumber !== id));
    } catch (error) {
      console.error("Error deleting student: ", error);
    }
  };

  const handleEditStudent = (id: string) => {
    const student = students.find(stu => stu.rollNumber === id);
    if (student) {
      setStudentName(student.studentName);
      setRollNumber(student.rollNumber);
      setClassID(student.classID);
      setIsEditing(true);
      setEditRollNumber(id);
    }
  };

  const filteredStudents = students.filter(stu =>
    stu.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stu.rollNumber.includes(searchTerm) ||
    stu.classID.includes(searchTerm)
  );

  return (
    <>
      <Navad />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Add/Update Students</h1>
        <div className="bg-white p-8 rounded shadow-md w-80 mb-4">
          <select
            value={classID}
            onChange={(e) => setClassID(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Class</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.className}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Roll Number"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Student Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleAddStudent}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            {isEditing ? 'Update' : 'Add'}
          </button>
        </div>
        <input
          type="text"
          placeholder="Search Students"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-80 p-2 border border-gray-300 rounded"
        />
        <table className="min-w-full bg-white rounded shadow-md">
          <thead>
            <tr>
              <th className="p-2 border-b">Roll Number</th>
              <th className="p-2 border-b">Student Name</th>
              <th className="p-2 border-b">Class ID</th>
              <th className="p-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(stu => (
              <tr key={stu.rollNumber}>
                <td className="p-2 border-b">{stu.rollNumber}</td>
                <td className="p-2 border-b">{stu.studentName}</td>
                <td className="p-2 border-b">{stu.classID}</td>
                <td className="p-2 border-b">
                  <button
                    onClick={() => handleEditStudent(stu.rollNumber)}
                    className="bg-yellow-500 text-white p-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteStudent(stu.rollNumber)}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AddStudent;
