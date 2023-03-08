import './App.css'
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io("http://localhost:5001/", {
  transports: ["polling"],
  cors: {
    origin: "http://localhost:3000/",
  },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 1000,
  reconnectionAttempts: Infinity,
});

const App = () => {

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [timer, setTimer] = useState(Date.now());
  const [xPositions, setXPositions] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [yPositions, setYPositions] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [dotPos, setDotPos] = useState([0, 0]);

  useEffect(() => {
    const xWeights = [0, 0.5, 1, 1.5, 2.5, 3.5, 4.5];
    const yWeights = [0, 0.5, 1, 1.5, 2.5, 3.5, 4.5];

    const buildPositions = (coord, min, type = 'x') => xWeights.map((xWeight) => {
      const weight = type === 'x' ? xWeight : yWeights[xWeights.indexOf(xWeight)];
      let value = -Number(coord) * weight;
      if (min) {
        value = Math.max(min, value);
      }
      if (type === 'x') {
        if (xWeights.indexOf(xWeight) === 4) {
          value = -180 + value;
        }
        else {
          value = -550 + value;
        }
      }
      return value;
    });

    socket.on('connect', () => {
      setTimer(Date.now());
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      socket.io.reconnect();
      setIsConnected(false);
    });

    socket.on('message', (message) => {
      setDotPos([message.x / 4, message.y / 4]);
      const xPositions = buildPositions(message.x);
      const yPositions = buildPositions(message.y, -20, 'y');
      setXPositions(xPositions);
      setYPositions(yPositions);
    });
  }, [timer, isConnected]);

  useEffect(() => {
    const FPS = 30;
    const i = 1000 / FPS;
    const interval = setInterval(() => {
      socket.emit('ping');
    }, i);
    return () => clearInterval(interval);
  }, [dotPos]);


  return (
    <div
      blur={{ min: -15, max: 15 }}
      bgImage=""
      bgStyle={{ height: '1000px' }}
    >
      <div className='position' style={{ left: `50%`, top: `40%` }}></div>
      <div className='position red' style={{ left: `${50 + dotPos[0]}%`, top: `${40 + dotPos[1]}%` }}></div>
      <div style={{ height: '1000px' }}>


      </div>
    </div>
  );
}

export default App;
