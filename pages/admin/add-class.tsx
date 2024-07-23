import { useState, useEffect } from 'react';
import Navad from '../../components/navad';

const AddClass = () => {
  const [className, setClassName] = useState('');
  const [classID, setClassID] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [classes, setClasses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editClassID, setEditClassID] = useState('');

  useEffect(() => {
    // Initially populate the classes state (could be from a database or hardcoded for now)
    setClasses([
      { classID: '101', className: 'Mathematics' },
      { classID: '102', className: 'Science' },
    ]);
  }, []);

  const handleAddClass = () => {
    if (isEditing) {
      setClasses(classes.map(cls => 
        cls.classID === editClassID ? { classID, className } : cls
      ));
      setIsEditing(false);
      setEditClassID('');
    } else {
      setClasses([...classes, { classID, className }]);
    }
    setClassID('');
    setClassName('');
  };

  const handleDeleteClass = (id) => {
    setClasses(classes.filter(cls => cls.classID !== id));
  };

  const handleEditClass = (cls) => {
    setClassID(cls.classID);
    setClassName(cls.className);
    setIsEditing(true);
    setEditClassID(cls.classID);
  };

  const filteredClasses = classes.filter(cls =>
    cls.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.classID.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navad />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Add/Update Class</h1>
        <div className="bg-white p-8 rounded shadow-md w-80 mb-4">
          <input
            type="text"
            placeholder="Class ID"
            value={classID}
            onChange={(e) => setClassID(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Class Name"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleAddClass}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            {isEditing ? 'Update' : 'Add'}
          </button>
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-80 p-2 border border-gray-300 rounded"
        />
        <table className="min-w-full bg-white rounded shadow-md">
          <thead>
            <tr>
              <th className="p-1 border-b">Class ID</th>
              <th className="p-1 border-b">Class Name</th>
              <th className="p-1 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClasses.map((cls) => (
              <tr key={cls.classID}>
                <td className="p-5 border-b">{cls.classID}</td>
                <td className="p-2 border-b">{cls.className}</td>
                <td className="p-2 border-b">
                  <button
                    onClick={() => handleEditClass(cls)}
                    className="bg-yellow-500 text-white p-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClass(cls.classID)}
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

export default AddClass;
