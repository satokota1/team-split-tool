import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import PlayerRegistration from './components/PlayerRegistration';
import PlayerList from './components/PlayerList';
import TeamAssignment from './components/TeamAssignment';
import MatchResult from './components/MatchResult';
import MatchHistory from './components/MatchHistory';
import { rateData } from './components/rateData';
import Header from './components/Header';
import { db } from './firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { updateDoc, doc } from 'firebase/firestore';

function App() {
  const [players, setPlayers] = useState([]);

  // Firestoreからプレイヤーデータを取得
useEffect(() => {
  const fetchPlayers = async () => {
    const querySnapshot = await getDocs(collection(db, "players"));
    const playersData = querySnapshot.docs.map(doc => ({
      id: doc.id,  // ドキュメントIDを取得
      ...doc.data(),
    }));
    setPlayers(playersData);
  };
  fetchPlayers();
}, []);

  // プレイヤーをFirestoreに追加
  const addPlayer = async (player) => {
    await addDoc(collection(db, "players"), player);
    setPlayers([...players, player]);
  };

  // プレイヤーを削除する関数もFirestoreに合わせて修正できます
  const deletePlayer = (playerName) => {
    setPlayers((prevPlayers) => prevPlayers.filter(player => player.playerName !== playerName));
  };

  const updatePlayer = async (updatedPlayer) => {
    try {
      const playerRef = doc(db, "players", updatedPlayer.id); // ドキュメント参照
      await updateDoc(playerRef, {
        playerName: updatedPlayer.playerName,
        mainRole: updatedPlayer.mainRole,
        mainRate: updatedPlayer.mainRate,
        subRate: updatedPlayer.subRate,
        preferredRoles: updatedPlayer.preferredRoles,  // 優先ロールをFirestoreに保存
      });
      console.log("プレイヤー情報を更新しました");
    } catch (error) {
      console.error("プレイヤー情報の更新に失敗しました: ", error);
    }
  };
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<PlayerRegistration addPlayer={addPlayer} />} />
        <Route path="/team-assignment" element={<TeamAssignment players={players} setPlayers={setPlayers} updatePlayer={updatePlayer} />} />
        <Route path="/match-result" element={<MatchResult players={players} />} />
        <Route path="/match-history" element={<MatchHistory players={players} />} />
        <Route path="/players" element={<PlayerList players={players} setPlayers={setPlayers} updatePlayer={updatePlayer} />} />      
      </Routes>
    </Router>
  );
}

export default App;
