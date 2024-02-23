import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CoinSelectionPage.css';

const CoinSelectionPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  const handleConfirm = () => {
    if (userName) {
      localStorage.setItem('userName', userName);
      navigate(`/binance`);
    }
  };

  return (
    <div className="coin-selection-container">
      <h2>Write your name to store the data in you Local</h2>

      <label>
        User Name:
        <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
      </label>
      <button onClick={handleConfirm}>Go to Dashboard</button>
    </div>
  );
};

export default CoinSelectionPage;