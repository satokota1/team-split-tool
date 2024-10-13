import React from 'react';
import Header from './Header';

const PlayerList = ({ players, setPlayers }) => {
  const handleRemovePlayer = (playerName) => {
    const confirmDelete = window.confirm(`${playerName}を削除しますか？`);
    if (confirmDelete) {
      setPlayers(players.filter(player => player.playerName !== playerName));
    }
  };

  return (
    <>
      <Header />
      <div className="player-list">
        <h2 className="text-3xl font-bold mb-4">プレイヤー一覧</h2>
        <ul>
          {players.map((player, index) => (
            <li key={index} className="flex justify-between items-center p-4 mb-2 bg-gray-100 rounded">
              <span>{player.playerName} ({player.mainRole}) - メインレート: {player.mainRate}, サブレート: {player.subRate}</span>
              <button onClick={() => handleRemovePlayer(player.playerName)} className="btn bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded">削除</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default PlayerList;