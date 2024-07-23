import { useState } from 'react';
import Navad from '../../components/navad';

const AddSubject = () => {
  const [subjectID, setSubjectID] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [classID, setClassID] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editSubjectID, setEditSubjectID] = useState(null);
  
  const [subjects, setSubjects] = useState([
    { subjectID: '1', subjectName: 'Math', classID: '1' },
    { subjectID: '2', subjectName: 'Science', classID: '2' },
  ]);
  const [classes] = useState([
    { classID: '1', className: 'Class 1' },
    { classID: '2', className: 'Class 2' },
  ]);

  const handleAddSubject = () => {
    if (editMode) {
      setSubjects(subjects.map(sub => 
        sub.subjectID === editSubjectID ? { subjectID, subjectName, classID } : sub
      ));
      setEditMode(false);
      setEditSubjectID(null);
    } else {
      setSubjects([...subjects, { subjectID, subjectName, classID }]);
    }

    setSubjectID('');
    setSubjectName('');
    setClassID('');
  };

  const handleDeleteSubject = (id) => {
    setSubjects(subjects.filter(sub => sub.subjectID !== id));
  };

  const handleEditSubject = (subject) => {
    setEditMode(true);
    setEditSubjectID(subject.subjectID);
    setSubjectID(subject.subjectID);
    setSubjectName(subject.subjectName);
    setClassID(subject.classID);
  };

  const filteredSubjects = subjects.filter(sub =>
    sub.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navad />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Add/Update Subjects</h1>
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
          <input
            type="text"
            placeholder="Subject ID"
            value={subjectID}
            onChange={(e) => setSubjectID(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Subject Name"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleAddSubject}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            {editMode ? 'Update' : 'Add'}
          </button>
        </div>
        <input
          type="text"
          placeholder="Search Subjects"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-80 p-2 border border-gray-300 rounded"
        />
        <table className="min-w-full bg-white rounded shadow-md">
          <thead>
            <tr>
              <th className="p-2 border-b">Subject ID</th>
              <th className="p-2 border-b">Subject Name</th>
              <th className="p-2 border-b">Class ID</th>
              <th className="p-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubjects.map(sub => (
              <tr key={sub.subjectID}>
                <td className="p-2 border-b">{sub.subjectID}</td>
                <td className="p-2 border-b">{sub.subjectName}</td>
                <td className="p-2 border-b">{sub.classID}</td>
                <td className="p-2 border-b">
                  <button
                    onClick={() => handleEditSubject(sub)}
                    className="bg-yellow-500 text-white p-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSubject(sub.subjectID)}
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

export default AddSubject;
