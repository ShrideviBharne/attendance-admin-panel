import { useState } from 'react';
import Navad from '../../components/navad'

const Allotments = () => {
  const [classID, setClassID] = useState('');
  const [facultyID, setFacultyID] = useState('');
  const [subjectID, setSubjectID] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [allotments, setAllotments] = useState([
    { classID: '1', facultyID: '1', subjectID: '1' },
  ]);
  const [classes] = useState([
    { classID: '1', className: 'Class 1' },
    { classID: '2', className: 'Class 2' },
  ]);
  const [faculties] = useState([
    { facultyID: '1', facultyName: 'Faculty 1' },
    { facultyID: '2', facultyName: 'Faculty 2' },
  ]);
  const [subjects] = useState([
    { subjectID: '1', subjectName: 'Math' },
    { subjectID: '2', subjectName: 'Science' },
  ]);

  const handleAddAllotment = () => {
    if (editMode) {
      setAllotments(allotments.map((allot, index) => 
        index === editIndex ? { classID, facultyID, subjectID } : allot
      ));
      setEditMode(false);
      setEditIndex(null);
    } else {
      setAllotments([...allotments, { classID, facultyID, subjectID }]);
    }
    setClassID('');
    setFacultyID('');
    setSubjectID('');
  };

  const handleDeleteAllotment = (index) => {
    setAllotments(allotments.filter((_, i) => i !== index));
  };

  const handleEditAllotment = (index) => {
    const allotment = allotments[index];
    setClassID(allotment.classID);
    setFacultyID(allotment.facultyID);
    setSubjectID(allotment.subjectID);
    setEditMode(true);
    setEditIndex(index);
  };

  const filteredAllotments = allotments.filter(allot =>
    classes.find(cls => cls.classID === allot.classID)?.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculties.find(fac => fac.facultyID === allot.facultyID)?.facultyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subjects.find(sub => sub.subjectID === allot.subjectID)?.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <Navad/>
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Allotments</h1>
      <div className="bg-white p-8 rounded shadow-md w-80 mb-4">
        <select
          value={classID}
          onChange={(e) => setClassID(e.target.value)}
          className="mb-4 w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Select Class</option>
          {classes.map(cls => (
            <option key={cls.classID} value={cls.classID}>
              {cls.className}
            </option>
          ))}
        </select>
        <select
          value={facultyID}
          onChange={(e) => setFacultyID(e.target.value)}
          className="mb-4 w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Select Faculty</option>
          {faculties.map(fac => (
            <option key={fac.facultyID} value={fac.facultyID}>
              {fac.facultyName}
            </option>
          ))}
        </select>
        <select
          value={subjectID}
          onChange={(e) => setSubjectID(e.target.value)}
          className="mb-4 w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Select Subject</option>
          {subjects.map(sub => (
            <option key={sub.subjectID} value={sub.subjectID}>
              {sub.subjectName}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddAllotment}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          {editMode ? 'Update' : 'Add'}
        </button>
      </div>
      <input
        type="text"
        placeholder="Search Allotments"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-80 p-2 border border-gray-300 rounded"
      />
      <table className="min-w-full bg-white rounded shadow-md">
        <thead>
          <tr>
            <th className="p-2 border-b">Class ID</th>
            <th className="p-2 border-b">Faculty ID</th>
            <th className="p-2 border-b">Subject ID</th>
            <th className="p-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAllotments.map((allot, index) => (
            <tr key={index}>
              <td className="p-2 border-b">{allot.classID}</td>
              <td className="p-2 border-b">{allot.facultyID}</td>
              <td className="p-2 border-b">{allot.subjectID}</td>
              <td className="p-2 border-b">
                <button
                  onClick={() => handleEditAllotment(index)}
                  className="bg-yellow-500 text-white p-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAllotment(index)}
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

export default Allotments;