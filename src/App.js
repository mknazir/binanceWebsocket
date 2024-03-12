// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BinanceWebSocket from './BinanceWebSocket';
import CoinSelectionPage from './CoinSelectionPage';
// import TradingViewWidget from './TradingView';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<TradingViewWidget/>} /> */}
        <Route path="/" element={<CoinSelectionPage />} />
        <Route path="/binance" element={<BinanceWebSocket />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
