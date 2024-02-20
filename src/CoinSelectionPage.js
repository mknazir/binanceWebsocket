// // CoinSelectionPage.jsx

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './CoinSelectionPage.css'; // Import your CSS file

// const CoinSelectionPage = () => {
//   const navigate = useNavigate();
//   const availableCoins = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ATOMUSDT', 'DOGEUSDT'];
//   const [selectedCoin, setSelectedCoin] = useState('');
//   const [userName, setUserName] = useState('');
//   const [filteredCoins, setFilteredCoins] = useState([]);

//   const handleCoinSelect = (coin) => {
//     setSelectedCoin(coin);
//     setFilteredCoins([]); // Clear the dropdown after selection
//   };

//   const handleInputChange = (value) => {
//     const filtered = availableCoins.filter((coin) =>
//       coin.toLowerCase().includes(value.toLowerCase())
//     );
//     setFilteredCoins(filtered);
//   };

//   const handleConfirm = () => {
//     if (selectedCoin && userName) {
//       navigate(`/binance?coin=${selectedCoin}&user=${userName}`);
//     }
//   };

//   return (
//     <div className="coin-selection-container">
//       <h2>Select a Coin</h2>

//       <label>
//         User Name:
//         <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
//       </label>

//       <br />

//       <label>
//         Coin:
//         <div className="dropdown-container">
//           <input
//             type="text"
//             value={selectedCoin}
//             onChange={(e) => {
//               setSelectedCoin(e.target.value);
//               handleInputChange(e.target.value);
//             }}
//             list="coinList"
//           />
//           <datalist id="coinList">
//             {filteredCoins.map((coin) => (
//               <option key={coin} value={coin} onClick={() => handleCoinSelect(coin)} />
//             ))}
//           </datalist>
//         </div>
//       </label>

//       <button onClick={handleConfirm}>OK</button>
//     </div>
//   );
// };

// export default CoinSelectionPage;

// CoinSelectionPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CoinSelectionPage.css'; // Import your CSS file
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

const CoinSelectionPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  const handleConfirm = () => {
      navigate(`/binance`);
  };

  return (
    <div className="coin-selection-container">
      <h2>Select a Coin</h2>

      <label>
        User Name:
        <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
      </label>
      <button onClick={handleConfirm}>Go to Dashboard</button>
    </div>
  );
};

export default CoinSelectionPage;