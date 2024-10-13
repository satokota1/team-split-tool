import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">チーム分けツール</h1>
        <Link to="/" className="btn bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded">ホームに戻る</Link>
      </nav>
    </header>
  );
};

export default Header;