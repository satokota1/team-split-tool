import React from 'react';

import { Link } from 'react-router-dom';

const MatchHistory = ({ matches }) => {
  return (
    <div className="match-history">
      <h2 className="text-3xl font-bold mb-4">試合履歴</h2>
      <ul>
        {matches.map((match, index) => (
          <li key={index} className="p-4 mb-2 bg-gray-100 rounded">
            {match.date} - 勝者: {match.winner}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchHistory;