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

function App() {
  const [players, setPlayers] = useState([]);

  // ローカルストレージからプレイヤーデータを読み込む
  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem('players')) || [];
    setPlayers(storedPlayers);
  }, []);

  // プレイヤーデータが変更されたらローカルストレージに保存
  useEffect(() => {
    if (players.length > 0) {
      localStorage.setItem('players', JSON.stringify(players));
    }
  }, [players]);

  // プレイヤーを追加する関数
  const addPlayer = (player) => {
    setPlayers((prevPlayers) => [...prevPlayers, player]);
  };

  // プレイヤーを削除する関数
  const deletePlayer = (playerName) => {
    setPlayers((prevPlayers) => prevPlayers.filter(player => player.playerName !== playerName));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<PlayerRegistration addPlayer={addPlayer} />} />
        <Route path="/players" element={<PlayerList players={players} setPlayers={setPlayers} />} />
        <Route path="/team-assignment" element={<TeamAssignment players={players} setPlayers={setPlayers} />} />
        <Route path="/match-result" element={<MatchResult players={players} />} />
        <Route path="/match-history" element={<MatchHistory players={players} />} />
      </Routes>
    </Router>
  );
}

export default App;