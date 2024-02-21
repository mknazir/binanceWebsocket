import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './App.css';

const BinanceWebSocket = () => {
  const [coinData, setCoinData] = useState({});
  const [selectedTab, setSelectedTab] = useState(localStorage.getItem('selectedTab') || 'BTCUSDT');
  const [displayedCoins, setDisplayedCoins] = useState(
    JSON.parse(localStorage.getItem('displayedCoins')) || ['BTCUSDT', 'ETHUSDT']
  );
  const [dropdownCoins, setDropdownCoins] = useState([]);
  const [newCoin, setNewCoin] = useState('');
  const [isWebSocketError, setIsWebSocketError] = useState(false);

  const [selectedInterval, setSelectedInterval] = useState('1m');

  const handleIntervalChange = (interval) => {
    setSelectedInterval(interval);
  };

  const fetchDropdownCoins = async () => {
    try {
      const response = await fetch('https://api3.binance.com/api/v3/ticker/price');
      const data = await response.json();
      const usdtSymbols = data
        .filter((entry) => entry.symbol.includes('USDT'))
        .map((entry) => entry.symbol);
      setDropdownCoins(usdtSymbols);
    } catch (error) {
      console.error('Error fetching dropdown coins:', error);
    }
  };


  useEffect(() => {
    fetchDropdownCoins();
  }, []);

  const fetchHistoricalData = async () => {
    const endTime = Date.now();
    const startTime = endTime - 30 * 60 * 1000;
    const interval = selectedInterval;
    const limit = 30;

    const historicalDataUrl = `https://api.binance.com/api/v3/klines?symbol=${selectedTab}&interval=${interval}&startTime=${startTime}&endTime=${endTime}&limit=${limit}`;

    try {
      const response = await fetch(historicalDataUrl);
      const result = await response.json();
      processHistoricalData(result);
    } catch (error) {
      console.error('Error fetching historical data:', error);
      setIsWebSocketError(true);
    }
  };

  const processHistoricalData = (data) => {
    const processedData = {
      [selectedTab]: {
        pricesCandlestickChart: data.map((candle) => [
          new Date(candle[0]).toLocaleTimeString(),
          parseFloat(candle[3]), // Low
          parseFloat(candle[1]), // Open
          parseFloat(candle[4]), // Close
          parseFloat(candle[2]), // High
        ]),
        pricesLineChart: data.map((candle) => [
          new Date(candle[0]).toLocaleTimeString(),
          parseFloat(candle[4]), // Close
        ]),
        volume: data.map((candle) => [
          new Date(candle[0]).toLocaleTimeString(),
          parseFloat(candle[5]), // Volume
        ]),
      },
    };

    setCoinData((prevData) => ({
      ...prevData,
      ...processedData,
    }));
  };

  useEffect(() => {
    localStorage.setItem('selectedTab', selectedTab);
    localStorage.setItem('displayedCoins', JSON.stringify(displayedCoins));
    fetchHistoricalData();
  }, [selectedTab, selectedInterval]);

  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws');

    ws.onopen = () => {
      console.log('WebSocket connection opened');
      setIsWebSocketError(false);

      const subscribe = {
        method: 'SUBSCRIBE',
        params: [`${selectedTab.toLowerCase()}@kline_1m`],
        id: 1,
      };
      ws.send(JSON.stringify(subscribe));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data && data.e === 'kline' && data.s === selectedTab) {
        setCoinData((prevData) => {
          const updatedData = { ...prevData };

          const kline = data.k;
          const currentTime = new Date(kline.t).getTime();

          if (!updatedData.lastUpdateTime || currentTime - updatedData.lastUpdateTime >= 60000) {
            const previousCandle = updatedData[selectedTab].pricesCandlestickChart.slice(-1)[0];
            const previousLow = previousCandle ? previousCandle[3] : parseFloat(kline.l);
            const previousHigh = previousCandle ? previousCandle[2] : parseFloat(kline.h);
            const newCandle = [
              new Date(kline.t).toLocaleTimeString(),
              Math.min(previousLow, parseFloat(kline.l)),
              parseFloat(kline.o),
              parseFloat(kline.c),
              Math.max(previousHigh, parseFloat(kline.h)),
            ];

            updatedData[selectedTab].pricesCandlestickChart = enqueue(updatedData[selectedTab].pricesCandlestickChart, newCandle, 30);

            updatedData.lastUpdateTime = currentTime;
          }

          updatedData[selectedTab].pricesLineChart = [
            ...updatedData[selectedTab].pricesLineChart,
            [new Date(kline.t).toLocaleTimeString(), parseFloat(kline.c)],
          ];

          return updatedData;
        });
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setIsWebSocketError(true);
    };

    ws.onclose = (event) => {
      console.log('WebSocket Closed:', event);
      setIsWebSocketError(true);
    };

    return () => {
      ws.close();
    };
  }, [selectedTab, selectedInterval]);

  const enqueue = (queue, data, limit) => {
    const newQueue = [...queue, data];
    return newQueue.length > limit ? newQueue.slice(1) : newQueue;
  };


  const handleRemoveCoin = (coinToRemove) => {
    const isConfirmed = window.confirm(`Are you sure you want to remove ${coinToRemove}?`);
    if (isConfirmed) {
      const updatedDisplayedCoins = displayedCoins.filter((coin) => coin !== coinToRemove);
      setDisplayedCoins(updatedDisplayedCoins);

      setDropdownCoins([...dropdownCoins, coinToRemove]);
    }
  };

  const addNewCoin = () => {
    const selectedCoin = newCoin.toUpperCase();
    if (selectedCoin && !displayedCoins.includes(selectedCoin)) {
      setDisplayedCoins([...displayedCoins, selectedCoin]);
      setDropdownCoins(dropdownCoins.filter((coin) => coin !== selectedCoin));
      setNewCoin('');
    }
  };

  return (
    <div className='coin-container'>
      {isWebSocketError && <div className="error-message">WebSocket Error. Please check your connection.</div>}
      <Tabs onSelect={(index, lastIndex, event) => setSelectedTab(displayedCoins[index])} className="tabContainer">
        <div style={{ margin: "20px 0px" }}>
          <input
            type="text"
            value={newCoin}
            onChange={(e) => setNewCoin(e.target.value)}
            placeholder="Search for a coin"
            list="coinSuggestions"
          />
          {newCoin && (
            <datalist id="coinSuggestions">
              {dropdownCoins.map((coin) => (
                <option key={coin} value={coin} />
              ))}
            </datalist>
          )}

          <button onClick={addNewCoin}>Add Coin</button>
        </div>
        <TabList>
          {displayedCoins.map((coin) => (
            <Tab key={coin}>
              {coin}
              <button onClick={() => handleRemoveCoin(coin)}>X</button>
            </Tab>
          ))}
        </TabList>
        {displayedCoins.map((coin) => (
          <TabPanel key={coin}>
            <div className='coin-info'>
              <h3>{coin}</h3>
              <p>
                Price:{' '}
                <span className='price'>
                  {coinData[coin]?.pricesLineChart[coinData[coin]?.pricesLineChart.length - 1]?.[1]} USDT
                </span>
                <br />
                Volume: <span className='volume'>{coinData[coin]?.volume[coinData[coin]?.volume.length - 1]?.[1]} BTC</span>
              </p>
            </div>
            <select value={selectedInterval} onChange={(e) => handleIntervalChange(e.target.value)}>
              <option value="1m">1 Minute</option>
              <option value="3m">3 Minutes</option>
              <option value="5m">5 Minutes</option>
            </select>

            <div className='chart'>
              <Chart
                width={'100%'}
                height={700}
                chartType='CandlestickChart'
                loader={<div>Loading Chart</div>}
                data={[
                  ['Time', 'Low', 'Open', 'Close', 'High'],
                  ...coinData[coin]?.pricesCandlestickChart || [],
                ]}
                options={{
                  title: 'Candlestick Chart',
                  legend: 'none',
                  candlestick: {
                    fallingColor: { strokeWidth: 1, fill: '#a52714' },
                    risingColor: { strokeWidth: 1, fill: '#0f9d58' },
                  },
                }}
                rootProps={{ 'data-testid': '2' }}
              />
              <Chart
                width={'100%'}
                height={700}
                chartType='LineChart'
                loader={<div>Loading Chart</div>}
                data={[['Time', 'Price'], ...coinData[coin]?.pricesLineChart || []]}
                options={{
                  title: 'Price Over Time',
                  legend: { position: 'bottom' },
                }}
              />
            </div>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
};

export default BinanceWebSocket;