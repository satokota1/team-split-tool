import React, { useState } from 'react';
import Header from './Header';

const MatchResult = ({ teams, addMatch }) => {
  const [winner, setWinner] = useState('');

  const handleSubmit = () => {
    addMatch({ date: new Date().toLocaleString(), winner });
  };

  return (
    <>
      <Header />
      <div className="match-result">
        <h2 className="text-3xl font-bold mb-4">勝敗登録</h2>
        <select value={winner} onChange={(e) => setWinner(e.target.value)} className="input-field">
          <option value="">勝者を選択</option>
          <option value="Team A">Team A</option>
          <option value="Team B">Team B</option>
        </select>
        <button onClick={handleSubmit} className="btn bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-4 rounded mt-2">勝利を登録</button>
      </div>
    </>
  );
};

export default MatchResult;