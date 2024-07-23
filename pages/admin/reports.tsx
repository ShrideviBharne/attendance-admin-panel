import { useState } from 'react';

const Reports = () => {
  const [reports] = useState([
    { reportID: '1', reportName: 'Report 1' },
    { reportID: '2', reportName: 'Report 2' },
  ]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className="bg-white p-8 rounded shadow-md w-80 mb-4">
        <h2 className="text-xl font-semibold mb-4">Available Reports</h2>
        <table className="min-w-full bg-white rounded shadow-md">
          <thead>
            <tr>
              <th className="p-2 border-b">Report ID</th>
              <th className="p-2 border-b">Report Name</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.reportID}>
                <td className="p-2 border-b">{report.reportID}</td>
                <td className="p-2 border-b">{report.reportName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
