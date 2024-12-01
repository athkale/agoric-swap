import React from 'react'

const Dashboard: React.FC = () => {
  return (
    <div>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="px-4 py-2">Assets</th>
            <th className="px-4 py-2">MaxSupply APY</th>
            <th className="px-4 py-2">MinBurrow APY</th>
            <th className="px-4 py-2">Total Supplied</th>
            <th className="px-4 py-2">Total Borrowed</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2">CCLPT</td>
            <td className="px-4 py-2">8%</td>
            <td className="px-4 py-2">50%</td>
            <td className="px-4 py-2">$231880000050</td>
            <td className="px-4 py-2">$404900034</td>
            <td className="px-4 py-2">
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                Supply
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard