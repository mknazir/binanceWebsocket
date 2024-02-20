// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BinanceWebSocket from './BinanceWebSocket';
import CoinSelectionPage from './CoinSelectionPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CoinSelectionPage />} />
        <Route path="/binance" element={<BinanceWebSocket />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
