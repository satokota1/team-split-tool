import React, { useState } from 'react';
import { rateData } from './rateData';
import Header from './Header';

const PlayerRegistration = ({ addPlayer }) => {
  const [playerName, setPlayerName] = useState('');
  const [mainRole, setMainRole] = useState('');
  const [preferredRoles, setPreferredRoles] = useState(['', '', '']);
  const [rate, setRate] = useState('');

  const handleAddPlayer = () => {
    if (!playerName || !rate) {
      alert('プレイヤー名とレートを入力してください。');
      return;
    }
  
    const newPlayer = {
      playerName,
      mainRole,
      preferredRoles,
      mainRate: rateData[rate].main,
      subRate: rateData[rate].sub,
    };
  
    addPlayer(newPlayer); // Firestoreにデータを保存
    setPlayerName('');
    setMainRole('');
    setPreferredRoles(['', '', '']);
    setRate('');
  };

  const handlePreferredRoleChange = (index, value) => {
    const updatedRoles = [...preferredRoles];
    updatedRoles[index] = value;
    setPreferredRoles(updatedRoles);
  };

  return (
    <>
      <Header />
      <div className="player-registration p-4">
        <h2 className="text-3xl font-bold mb-4">プレイヤー登録</h2>
        <div className="mb-4">
          <label className="block text-xl font-bold mb-2">プレイヤー名:</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="border rounded py-2 px-3 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-xl font-bold mb-2">メインロール:</label>
          <select
            value={mainRole}
            onChange={(e) => setMainRole(e.target.value)}
            className="border rounded py-2 px-3 w-full"
          >
            <option value="">選択してください</option>
            <option value="TOP">TOP</option>
            <option value="JUNGLE">JUNGLE</option>
            <option value="MID">MID</option>
            <option value="ADC">ADC</option>
            <option value="SUP">SUP</option>
            
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-xl font-bold mb-2">レート:</label>
          <select
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="border rounded py-2 px-3 w-full"
          >
            <option value="">選択してください</option>
            <option value="IRON">IRON</option>
            <option value="BRONZE">BRONZE</option>
            <option value="SILVER">SILVER</option>
            <option value="GOLD">GOLD</option>
            <option value="PLAT">PLAT</option>
            <option value="EME">EME</option>
            <option value="DIA">DIA</option>
            <option value="MASTER">MASTER</option>
            <option value="GM">GM</option>
            <option value="CHALLENGER">CHALLENGER</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-xl font-bold mb-2">優先ロール (最大3つ):</label>
          {[0, 1, 2].map((index) => (
            <select
              key={index}
              value={preferredRoles[index]}
              onChange={(e) => handlePreferredRoleChange(index, e.target.value)}
              className="border rounded py-2 px-3 w-full mb-2"
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
        </div>
        <button
          onClick={handleAddPlayer}
          className="btn bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          プレイヤーを登録
        </button>
      </div>  
    </>
  );
};

export default PlayerRegistration;