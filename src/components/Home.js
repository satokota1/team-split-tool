import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

const Home = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-4xl font-bold mb-8">チーム分けツール</h1>
        <Link to="/register" className="btn bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">プレイヤー新規登録</Link>
        <Link to="/players" className="btn bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded">プレイヤー一覧</Link>
        <Link to="/team-assignment" className="btn bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded">チーム自動振り分け</Link>
      </div>
    </>
  );
};

export default Home;