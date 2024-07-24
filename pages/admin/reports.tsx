import { useState } from 'react';
import Navad from '../../components/navad';

const Reports = () => {
  const [selectedReportType, setSelectedReportType] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [reportData, setReportData] = useState([]);

  // Example data for students, classes, and subjects
  const students = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    // Add more students as needed
  ];

  const classes = ['Class 10A', 'Class 10B', 'Class 11A', 'Class 11B'];
  const subjects = ['Math', 'Science', 'History', 'English'];

  const fetchReportData = async (type, filter) => {
    // Replace with actual data fetching logic based on `type` and `filter`
    const mockData = [
      { name: 'John Doe', rollNum: '123', class: '10A', subject: 'Math', daysPresent: 20, percentage: '80%' },
      { name: 'Jane Smith', rollNum: '124', class: '10A', subject: 'Math', daysPresent: 18, percentage: '72%' },
      // Add more mock data as needed
    ];
    setReportData(mockData);
  };

  const handleReportTypeChange = (event) => {
    setSelectedReportType(event.target.value);
    setSelectedStudent('');
    setSelectedClass('');
    setSelectedSubject('');
    setReportData([]);
  };

  const handleGenerateReport = () => {
    const filter = {
      student: selectedStudent,
      class: selectedClass,
      subject: selectedSubject,
    };
    fetchReportData(selectedReportType, filter);
  };

  return (
    <>
    <Navad/>
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md mb-4">
        <h2 className="text-xl font-semibold mb-4">Select Report Type</h2>
        <select
          value={selectedReportType}
          onChange={handleReportTypeChange}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="" disabled>Select Report Type</option>
          <option value="studentwise">Studentwise</option>
          <option value="datewise">Datewise</option>
          <option value="classwise">Classwise</option>
          <option value="subjectwise">Subjectwise</option>
        </select>

        {selectedReportType === 'studentwise' && (
          <div className="mb-4">
            <label className="block mb-2">Select Student:</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="" disabled>Select Student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>{student.name}</option>
              ))}
            </select>
          </div>
        )}

        {selectedReportType === 'classwise' && (
          <div className="mb-4">
            <label className="block mb-2">Select Class:</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="" disabled>Select Class</option>
              {classes.map((className, index) => (
                <option key={index} value={className}>{className}</option>
              ))}
            </select>
          </div>
        )}

        {selectedReportType === 'subjectwise' && (
          <div className="mb-4">
            <label className="block mb-2">Select Subject:</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="" disabled>Select Subject</option>
              {subjects.map((subject, index) => (
                <option key={index} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        )}

        {selectedReportType === 'datewise' && (
          <div className="mb-4">
            <label className="block mb-2">From:</label>
            <input type="date" className="w-full p-2 mb-4 border rounded" />
            <label className="block mb-2">To:</label>
            <input type="date" className="w-full p-2 mb-4 border rounded" />
          </div>
        )}

        <button
          onClick={handleGenerateReport}
          className="bg-blue-500 text-white p-2 rounded w-full"
          disabled={!selectedReportType || (selectedReportType === 'studentwise' && !selectedStudent) || (selectedReportType === 'classwise' && !selectedClass) || (selectedReportType === 'subjectwise' && !selectedSubject)}
        >
          Generate Report
        </button>
      </div>

      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Report Data</h2>
        {reportData.length > 0 ? (
          <table className="min-w-full bg-white rounded shadow-md">
            <thead>
              <tr>
                <th className="p-2 border-b">Name</th>
                <th className="p-2 border-b">Roll Number</th>
                {/* <th className="p-2 border-b">Class</th>
                <th className="p-2 border-b">Subject</th> */}
                <th className="p-2 border-b">Days Present</th>
                <th className="p-2 border-b">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((data, index) => (
                <tr key={index}>
                  <td className="p-2 border-b">{data.name}</td>
                  <td className="p-2 border-b">{data.rollNum}</td>
                  {/* <td className="p-2 border-b">{data.class}</td>
                  <td className="p-2 border-b">{data.subject}</td> */}
                  <td className="p-2 border-b">{data.daysPresent}</td>
                  <td className="p-2 border-b">{data.percentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data available. Please select a report type and generate a report.</p>
        )}
      </div>
    </div>
    </>
  );
};

export default Reports;
