import React, { useState } from 'react';
import Header from './Header';

const PlayerList = ({ players, setPlayers, updatePlayer }) => {
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedRole, setEditedRole] = useState('');
  const [preferredRoles, setPreferredRoles] = useState(['', '', '']);

  // 編集モードに入る
  const handleEditClick = (player) => {
    setEditingPlayer(player);
    setEditedName(player.playerName);
    setEditedRole(player.mainRole);
    setPreferredRoles(player.preferredRoles || ['', '', '']); // 優先ロールの初期値を設定
  };

  const handleSaveClick = async () => {
    console.log('更新するプレイヤー:', editingPlayer); // デバッグ用
    const updatedPlayer = {
      ...editingPlayer,
      playerName: editedName,
      mainRole: editedRole,
      preferredRoles: preferredRoles,
    };
  
    try {
      await updatePlayer(updatedPlayer);  // ここで問題が起きている
      console.log("プレイヤー情報を更新しました");
      
      setPlayers(players.map(player => player.id === editingPlayer.id ? updatedPlayer : player));
      setEditingPlayer(null);
    } catch (error) {
      console.error("プレイヤー情報の更新に失敗しました: ", error);
    }
  };
  

    setEditingPlayer(null); // 編集モード終了
  };

  // 優先ロールの変更を管理する関数
  const handlePreferredRoleChange = (index, value) => {
    const updatedRoles = [...preferredRoles];
    updatedRoles[index] = value;
    setPreferredRoles(updatedRoles);
  };

  return (
    <>
      <Header />
      <div className="player-list">
        <h2 className="text-3xl font-bold mb-4">プレイヤー一覧</h2>
        <ul>
          {players.map((player, index) => (
            <li key={index} className="flex justify-between items-center p-4 mb-2 bg-gray-100 rounded">
              {editingPlayer?.id === player.id ? (
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
                  {preferredRoles.map((role, index) => (
                    <select
                      key={index}
                      value={role}
                      onChange={(e) => handlePreferredRoleChange(index, e.target.value)}
                      className="border rounded py-1 px-2 ml-2"
                    >
                      <option value="">選択してください</option>
                      <option value="TOP">TOP</option>
                      <option value="JUNGLE">JUNGLE</option>
                      <option value="MID">MID</option>
                      <option value="ADC">ADC</option>
                      <option value="SUP">SUP</option>
                      <option value="FILL">FILL</option>
                    </select>
                  ))}
                  <button onClick={handleSaveClick} className="btn bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded">保存</button>
                </>
              ) : (
                <>
                  <span>{player.playerName} ({player.mainRole}) - メインレート: {player.mainRate}, サブレート: {player.subRate}, 優先ロール: {player.preferredRoles.join(', ')}</span>
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
