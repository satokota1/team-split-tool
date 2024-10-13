import React, { useState } from 'react';
import Header from './Header';

const PlayerList = ({ players, setPlayers, updatePlayer }) => {
  const [editingPlayer, setEditingPlayer] = useState(null); // 編集モード用の状態
  const [editedName, setEditedName] = useState('');
  const [editedRole, setEditedRole] = useState('');
  const [editedMainRate, setEditedMainRate] = useState(0);
  const [editedSubRate, setEditedSubRate] = useState(0);

  // 編集モードに入る関数
  const handleEditClick = (player) => {
    setEditingPlayer(player);
    setEditedName(player.playerName);
    setEditedRole(player.mainRole);
    setEditedMainRate(player.mainRate);
    setEditedSubRate(player.subRate);
  };

  // 編集内容を保存する関数
  const handleSaveClick = () => {
    const updatedPlayer = {
      ...editingPlayer,
      playerName: editedName,
      mainRole: editedRole,
      mainRate: editedMainRate,
      subRate: editedSubRate,
    };

    // Firestoreを更新
    updatePlayer(updatedPlayer);

    // ローカルの状態を更新
    setPlayers(players.map(player => player.playerName === editingPlayer.playerName ? updatedPlayer : player));

    setEditingPlayer(null); // 編集モード終了
  };

  return (
    <>
      <Header />
      <div className="player-list">
        <h2 className="text-3xl font-bold mb-4">プレイヤー一覧</h2>
        <ul>
          {players.map((player, index) => (
            <li key={index} className="flex justify-between items-center p-4 mb-2 bg-gray-100 rounded">
              {editingPlayer?.playerName === player.playerName ? (
                <>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="border rounded py-1 px-2"
                  />
                  <input
                    type="text"
                    value={editedRole}
                    onChange={(e) => setEditedRole(e.target.value)}
                    className="border rounded py-1 px-2"
                  />
                  <input
                    type="number"
                    value={editedMainRate}
                    onChange={(e) => setEditedMainRate(e.target.value)}
                    className="border rounded py-1 px-2"
                  />
                  <input
                    type="number"
                    value={editedSubRate}
                    onChange={(e) => setEditedSubRate(e.target.value)}
                    className="border rounded py-1 px-2"
                  />
                  <button onClick={handleSaveClick} className="btn bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded">保存</button>
                </>
              ) : (
                <>
                  <span>{player.playerName} ({player.mainRole}) - メインレート: {player.mainRate}, サブレート: {player.subRate}</span>
                  <button onClick={() => handleEditClick(player)} className="btn bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-2 rounded">編集</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default PlayerList;
