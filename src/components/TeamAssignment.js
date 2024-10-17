import React, { useState } from 'react';
import Header from './Header';

const TeamAssignment = ({ players = [], setPlayers, updatePlayer }) => {
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);
  const [averageRateA, setAverageRateA] = useState(0);
  const [averageRateB, setAverageRateB] = useState(0);

  // 勝敗を登録する関数
  const handleMatchResult = async (winningTeam) => {
    const updatedPlayers = [...players];

    const updateRate = (player, isWin) => {
      const playerIndex = updatedPlayers.findIndex(p => p.playerName === player.playerName);
      if (playerIndex !== -1) {
        if (player.assignedRole === player.preferredRoles[0]) {
          updatedPlayers[playerIndex].mainRate += isWin ? 30 : -30;
        } else {
          updatedPlayers[playerIndex].subRate += isWin ? 30 : -30;
        }
        // 勝敗数の更新
        updatedPlayers[playerIndex].wins = (updatedPlayers[playerIndex].wins || 0) + (isWin ? 1 : 0);
        updatedPlayers[playerIndex].losses = (updatedPlayers[playerIndex].losses || 0) + (!isWin ? 1 : 0);
        updatedPlayers[playerIndex].winRate = ((updatedPlayers[playerIndex].wins / (updatedPlayers[playerIndex].wins + updatedPlayers[playerIndex].losses)) * 100).toFixed(2);
      }
    };

    if (winningTeam === 'A') {
      teamA.forEach(player => updateRate(player, true));
      teamB.forEach(player => updateRate(player, false));
    } else if (winningTeam === 'B') {
      teamA.forEach(player => updateRate(player, false));
      teamB.forEach(player => updateRate(player, true));
    }

    // ローカルの状態を更新
    setPlayers(updatedPlayers);

    // Firestoreを更新
    for (const player of updatedPlayers) {
      await updatePlayer(player); // Firestoreに更新を反映
    }
  };

  // チームの平均レートを計算する関数はそのまま
  // handleManualSwapやその他の機能もそのまま維持

  return (
    <>
      <Header />
      {/* UI部分はそのまま */}
      <div className="match-result mt-4">
        <h3 className="text-2xl font-bold mb-2">勝敗を選択してください</h3>
        <div className="flex space-x-4">
          <button onClick={() => handleMatchResult('A')} className="btn bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">チームAの勝利</button>
          <button onClick={() => handleMatchResult('B')} className="btn bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded">チームBの勝利</button>
        </div>
      </div>
    </>
  );
};

export default TeamAssignment;
