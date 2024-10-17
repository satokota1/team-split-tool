import React, { useState } from 'react';
import Header from './Header';

const TeamAssignment = ({ players = [], setPlayers, updatePlayer }) => {
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);
  const [averageRateA, setAverageRateA] = useState(0);
  const [averageRateB, setAverageRateB] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // 検索用の状態を追加

  // プレイヤーを選択する関数
  const handlePlayerSelection = (player) => {
    if (selectedPlayers.includes(player)) {
      setSelectedPlayers(selectedPlayers.filter(p => p !== player));
    } else if (selectedPlayers.length < 10) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  // 検索機能の実装
  const filteredPlayers = players.filter(player =>
    player.playerName.toLowerCase().includes(searchTerm.toLowerCase()) // 検索条件に一致するプレイヤーをフィルタリング
  );

  // チーム分けアルゴリズム
  const assignRoles = (teamPlayers) => {
    const assignedRoles = [];
    const availableRoles = ["TOP", "JUNGLE", "MID", "ADC", "SUP"];
    
    teamPlayers.forEach(player => {
      const role = player.preferredRoles.find(r => availableRoles.includes(r) && !assignedRoles.includes(r));
      if (role) {
        assignedRoles.push(role);
      } else {
        assignedRoles.push("FILL"); // ロールが足りない場合はFILLに割り当て
      }
    });

    return teamPlayers.map((player, index) => ({
      ...player,
      assignedRole: assignedRoles[index],
      assignedRate: player.mainRate
    }));
  };

  const assignTeams = () => {
    if (selectedPlayers.length !== 10) {
      alert("10人のプレイヤーを選択してください。");
      return;
    }

    const shuffledPlayers = [...selectedPlayers].sort(() => 0.5 - Math.random());
    const teamAPlayers = assignRoles(shuffledPlayers.slice(0, 5));
    const teamBPlayers = assignRoles(shuffledPlayers.slice(5));

    setTeamA(teamAPlayers); 
    setTeamB(teamBPlayers);

    // 各チームの平均レートを計算
    setAverageRateA(calculateAverageRate(teamAPlayers));
    setAverageRateB(calculateAverageRate(teamBPlayers));
  };

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

    // Firestoreを更新
    try {
      await Promise.all(
        updatedPlayers.map(async (player) => {
          await updatePlayer(player); // Firestoreに保存
        })
      );
      console.log('全てのプレイヤー情報をFirestoreに保存しました');
      setPlayers(updatedPlayers); // UIの更新はFirestore保存後に行う
    } catch (error) {
      console.error('プレイヤー情報の保存に失敗しました: ', error);
    }
  };

  // チームの平均レートを計算する関数
  const calculateAverageRate = (team) => {
    const totalRate = team.reduce((sum, player) => sum + player.assignedRate, 0);
    return totalRate / team.length;
  };

  const handleManualSwap = (player, fromTeam, toTeam) => {
    if (fromTeam === 'A') {
      setTeamA(teamA.filter(p => p !== player));
      setTeamB([...teamB, player]);
    } else if (fromTeam === 'B') {
      setTeamB(teamB.filter(p => p !== player));
      setTeamA([...teamA, player]);
    }

    // チームの平均レートを再計算
    setAverageRateA(calculateAverageRate(teamA));
    setAverageRateB(calculateAverageRate(teamB));
  };

  return (
    <>
      <Header />
      <div className="team-assignment">
        <h2 className="text-3xl font-bold mb-4">チーム自動振り分け</h2>

        {/* 検索入力エリア */}
        <div className="player-search mb-4">
          <input
            type="text"
            placeholder="プレイヤー名を検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
        
        {/* プレイヤー選択フェーズ */}
        <div className="player-selection mb-4">
          <h3 className="text-2xl font-bold mb-2">プレイヤーを選択</h3>
          <div className="overflow-y-scroll max-h-64"> {/* スクロール可能エリア */}
            <ul className="flex flex-wrap">
              {filteredPlayers.map((player, index) => (
                <li key={index} className="p-2">
                  <button
                    onClick={() => handlePlayerSelection(player)}
                    className={`btn ${selectedPlayers.includes(player) ? 'bg-green-500' : 'bg-gray-300'} hover:bg-gray-700 text-white py-1 px-2 rounded`}
                  >
                    {player.playerName} ({player.mainRole}, メインレート: {player.mainRate}, サブレート: {player.subRate})
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* チーム割り振りボタン */}
        <div className="flex items-center mb-4">
          <button onClick={assignTeams} className="btn bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded">
            チームを割り振る
          </button>
          <span className="ml-4">選択中のプレイヤー: {selectedPlayers.length}人</span> {/* 選択中のプレイヤー数を表示 */}
        </div>

        {/* チーム表示と手動入れ替え機能 */}
        <div className="flex mt-4">
          <div className="team flex-1 p-4 bg-blue-100 mr-2 rounded">
            <h3 className="text-2xl font-bold mb-2">チームA (平均レート: {averageRateA})</h3>
            <ul>
              {teamA.map((player, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{player.playerName} ({player.assignedRole}, レート: {player.assignedRate})</span>
                  <button onClick={() => handleManualSwap(player, 'A', 'B')} className="btn bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-2 rounded ml-2">チームBに移動</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="team flex-1 p-4 bg-red-100 ml-2 rounded">
            <h3 className="text-2xl font-bold mb-2">チームB (平均レート: {averageRateB})</h3>
            <ul>
              {teamB.map((player, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{player.playerName} ({player.assignedRole}, レート: {player.assignedRate})</span>
                  <button onClick={() => handleManualSwap(player, 'B', 'A')} className="btn bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-2 rounded ml-2">チームAに移動</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 勝敗選択ボタン */}
        <div className="match-result mt-4">
          <h3 className="text-2xl font-bold mb-2">勝敗を選択してください</h3>
          <div className="flex space-x-4">
            <button onClick={() => handleMatchResult('A')} className="btn bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">チームAの勝利</button>
            <button onClick={() => handleMatchResult('B')} className="btn bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded">チームBの勝利</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamAssignment;
