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

  const [dotPos, setDotPos] = useState([0, 0]);
  const [step, setStep] = useState(1);
  const [selectedColors, setSelectedColors] = useState(["#fff", "#fff", "#fff", "#fff"]);
  const [hoverColor, setHoverColor] = useState("#fff");
  const [hoverTime, setHoverTime] = useState(0);

  function doElsCollide(el1, el2) {
    el1.offsetBottom = el1.offsetTop + el1.offsetHeight;
    el1.offsetRight = el1.offsetLeft + el1.offsetWidth;
    el2.offsetBottom = el2.offsetTop + el2.offsetHeight;
    el2.offsetRight = el2.offsetLeft + el2.offsetWidth;

    return !((el1.offsetBottom < el2.offsetTop) ||
      (el1.offsetTop > el2.offsetBottom) ||
      (el1.offsetRight < el2.offsetLeft) ||
      (el1.offsetLeft > el2.offsetRight))
  };
  useEffect(() => {

    socket.on('connect', () => {
      setTimer(Date.now());
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      socket.io.reconnect();
      setIsConnected(false);
    });

    socket.on('fingerposition', (message) => {
      setDotPos([message.x, message.y]);

      if (doElsCollide(document.querySelector('.position.pointer'), document.querySelector('.button-red'))) {
        setHoverColor("#FF5872");
        setHoverTime(hoverTime + 1);
      } else if (doElsCollide(document.querySelector('.position.pointer'), document.querySelector('.button-blue'))) {
        setHoverColor("#1252FF");
        setHoverTime(hoverTime + 1);
      } else if (doElsCollide(document.querySelector('.position.pointer'), document.querySelector('.button-yellow'))) {
        setHoverColor("#FFB858");
        setHoverTime(hoverTime + 1);
      } else {
        setHoverColor("#fff");
        setHoverTime(0);
      }
      if (hoverTime > 40) {
        setStep(step + 1);
        let colors = selectedColors;
        colors[step - 1] = hoverColor;
        setSelectedColors(colors);
        setHoverColor("#fff");
        setHoverTime(0);
      }
    });
  }, [timer, isConnected, hoverTime, hoverColor, step, selectedColors]);

  useEffect(() => {
    const FPS = 60;
    const i = 1000 / FPS;
    const interval = setInterval(() => {
      socket.emit('ping');
    }, i);
    return () => clearInterval(interval);
  }, [dotPos]);

  return (
    <div>
      <div className='position pointer' style={{left: `${50 + dotPos[0]}%`, top: `${40 + dotPos[1]}%`}}>{hoverTime > 0 ? Math.round(hoverTime / 10) + 1 : ""}</div>
      <div className='wrapper' style={{ height: '1000px' }}>

        <div className='svg-block'>

          <svg xmlns="http://www.w3.org/2000/svg" width="420.001" height="603.111" viewBox="0 0 420.001 603.111">
            <g id="Group_76" data-name="Group 76" transform="translate(-750 -339.944)">
              <g id="Group_75" data-name="Group 75" transform="translate(9699 -7824)">
                <path id="Path_1465" data-name="Path 1465" d="M4783.82,2391.476l-1.006-.288-9.2,11.931-7.332-7.475,11.933-9.2-.433-1.15-15.094,1.725v-10.35l15.239,1.869.431-.862-12.363-9.775,7.619-7.044,9.343,11.93.863-.286-1.726-15.237h11.213l-1.726,15.237.864.286,9.342-11.93,7.619,7.044-12.363,9.775.432.862,15.236-1.869v10.35l-15.092-1.725-.432,1.15,11.932,9.2-7.333,7.475-9.2-11.931-1.008.288,1.726,15.237h-11.213Z" transform="translate(-13526.7 5806.681)" fill="#ff5872"/>
                <rect className={`top-tower-section ${step === 2 ? "active" : ""}`} id="Rectangle_369" data-name="Rectangle 369" width="134" height="139" transform="translate(-8806 8292.056)" fill={step === 2 ? hoverColor : selectedColors[1]} />
                {/* <rect className="top-tower-section" id="Rectangle_369" data-name="Rectangle 369" width="134" height="139" transform="translate(-8806 8292.056)" fill="#ffb858"/> */}
                <rect className={`middle-tower-section ${step === 3 ? "active" : ""}`} id="Rectangle_370" data-name="Rectangle 370" width="134" height="140" transform="translate(-8806 8431.056)" fill={step === 3 ? hoverColor : selectedColors[2]} />
                {/* <rect className="middle-tower-section" id="Rectangle_370" data-name="Rectangle 370" width="134" height="140" transform="translate(-8806 8431.056)" fill="#1252ff"/> */}
                <rect className="base-section" id="Rectangle_372" data-name="Rectangle 372" width="420" height="134" transform="translate(-8949 8633.056)" fill="#0c1f87" />
                <rect id="Rectangle_374" data-name="Rectangle 374" width="143" height="134" transform="translate(-8949 8633.056)" fill="#ffb858"/>
                <path id="Path_1479" data-name="Path 1479" d="M0,38.946H77.892A38.946,38.946,0,1,0,0,38.946Z" transform="translate(-8749.893 8351.174)" fill="#fff" opacity="0.416" className='mix-blend isolation'/>
                <rect className={`bottom-tower-section ${step === 4 ? "active" : ""}`} id="Rectangle_375" data-name="Rectangle 375" width="134" height="196" transform="translate(-8806 8571.056)" fill={step === 4 ? hoverColor : selectedColors[3]} />
                {/* <rect className="bottom-tower-section" id="Rectangle_375" data-name="Rectangle 375" width="134" height="196" transform="translate(-8806 8571.056)" fill="#ff5872"/> */}
                <path id="Path_1480" data-name="Path 1480" d="M0,38.946H77.892A38.946,38.946,0,1,0,0,38.946Z" transform="translate(-8749.893 8392.109)" opacity="0.6" className='mix-blend isolation'/>
                <rect id="Rectangle_549" data-name="Rectangle 549" width="96.771" height="43.673" rx="21.836" transform="translate(-8695.249 8605.102) rotate(159)" fill="#fff" opacity="0.4" className='mix-blend isolation'/>
                <path id="Subtraction_146" data-name="Subtraction 146" d="M33.5,67a34.035,34.035,0,0,1-3.425-.173,33.45,33.45,0,0,1-29.9-29.9,34,34,0,0,1,0-6.85,33.45,33.45,0,0,1,29.9-29.9,34,34,0,0,1,6.85,0,33.45,33.45,0,0,1,29.9,29.9,34,34,0,0,1,0,6.85,33.45,33.45,0,0,1-29.9,29.9A34.034,34.034,0,0,1,33.5,67Zm.022-50.228a16.873,16.873,0,0,0-3.376.34,16.658,16.658,0,0,0-5.989,2.52A16.8,16.8,0,0,0,18.088,27a16.666,16.666,0,0,0-.976,3.144,16.913,16.913,0,0,0,0,6.751,16.658,16.658,0,0,0,2.52,5.989A16.8,16.8,0,0,0,27,48.956a16.665,16.665,0,0,0,3.144.976,16.913,16.913,0,0,0,6.751,0,16.658,16.658,0,0,0,5.989-2.52,16.8,16.8,0,0,0,6.069-7.37,16.665,16.665,0,0,0,.976-3.144,16.913,16.913,0,0,0,0-6.751,16.658,16.658,0,0,0-2.52-5.989,16.8,16.8,0,0,0-7.37-6.069,16.666,16.666,0,0,0-3.144-.976A16.873,16.873,0,0,0,33.522,16.772Z" transform="translate(-8806 8504.056)" fill="#fff" stroke="rgba(0,0,0,0)" strokeMiterlimit="10" strokeWidth="1" opacity="0.6" className='mix-blend isolation'/>
                <path id="Path_1466" data-name="Path 1466" d="M3472.461,7484.75v304.706" transform="translate(-12250.325 838.056)" fill="none" stroke="#0c1f87" strokeLinecap="round" strokeWidth="5" strokeDasharray="20"/>
                <path id="Path_1466-2" data-name="Path 1466" d="M3472.461,7484.75v304.706" transform="translate(-12234.325 838.056)" fill="none" stroke="#0c1f87" strokeLinecap="round" strokeWidth="5" strokeDasharray="20"/>
                <path id="Path_1466-3" data-name="Path 1466" d="M3472.461,7484.75v304.706" transform="translate(-12218.325 838.056)" fill="none" stroke="#0c1f87" strokeLinecap="round" strokeWidth="5" strokeDasharray="20"/>
                <path id="Path_1631" data-name="Path 1631" d="M0,66.979v.042H66.979V0A66.979,66.979,0,0,0,0,66.979Z" transform="translate(-8671.979 8431.056) rotate(90)" opacity="0.6" className='mix-blend isolation'/>
                <path id="Path_1466-4" data-name="Path 1466" d="M3472.461,7484.75v304.706" transform="translate(-12202.325 838.056)" fill="none" stroke="#0c1f87" strokeLinecap="round" strokeWidth="5" strokeDasharray="20"/>
                <path id="Path_1466-5" data-name="Path 1466" d="M3472.461,7484.75v304.706" transform="translate(-12186.325 838.056)" fill="none" stroke="#0c1f87" strokeLinecap="round" strokeWidth="5" strokeDasharray="20"/>
                <path id="Path_1466-6" data-name="Path 1466" d="M3472.461,7484.75v304.706" transform="translate(-12170.325 838.056)" fill="none" stroke="#0c1f87" strokeLinecap="round" strokeWidth="5" strokeDasharray="20"/>
                <path id="Path_1467" data-name="Path 1467" d="M39.364-38.221c21.74,0,39.364,17.907,39.364,40V79.993H0V1.775C0-20.314,17.624-38.221,39.364-38.221Z" transform="translate(-8778.364 8687.063)" fill="#0c1f87"/>
                <path id="Path_1473" data-name="Path 1473" d="M0,38H76A38,38,0,1,0,0,38Z" transform="translate(-8672 8689.059)" fill="#ffb858" />
                <path id="Path_1632" data-name="Path 1632" d="M0,63H126A63,63,0,1,0,0,63Z" transform="translate(-8940 8704)" fill="#fff" opacity="0.5" className='mix-blend isolation'/>
                <path id="Path_1474" data-name="Path 1474" d="M0,38H76A38,38,0,1,0,0,38Z" transform="translate(-8672 8729)" fill="#ffb858"/>
                <rect id="Rectangle_380" data-name="Rectangle 380" width="67" height="67" transform="translate(-8596 8700)" fill="#ff5872"/>
                <rect id="Rectangle_381" data-name="Rectangle 381" width="71" height="71" transform="translate(-8949 8633)" fill="#ff5872"/>
                <path id="Subtraction_143" data-name="Subtraction 143" d="M35.75,71.5a36.32,36.32,0,0,1-3.655-.185A35.7,35.7,0,0,1,.185,39.405a36.286,36.286,0,0,1,0-7.31A35.7,35.7,0,0,1,32.095.185a36.286,36.286,0,0,1,7.31,0,35.7,35.7,0,0,1,31.91,31.91,36.287,36.287,0,0,1,0,7.31,35.7,35.7,0,0,1-31.91,31.91A36.319,36.319,0,0,1,35.75,71.5Zm.023-53.6a18.006,18.006,0,0,0-3.6.363,17.777,17.777,0,0,0-6.392,2.69A17.927,17.927,0,0,0,19.3,28.816a17.785,17.785,0,0,0-1.042,3.355,18.049,18.049,0,0,0,0,7.2,17.777,17.777,0,0,0,2.69,6.392,17.927,17.927,0,0,0,7.864,6.476,17.784,17.784,0,0,0,3.355,1.042,18.049,18.049,0,0,0,7.2,0,17.777,17.777,0,0,0,6.392-2.69,17.927,17.927,0,0,0,6.476-7.865,17.784,17.784,0,0,0,1.042-3.355,18.049,18.049,0,0,0,0-7.2A17.776,17.776,0,0,0,50.6,25.78,17.927,17.927,0,0,0,42.731,19.3a17.786,17.786,0,0,0-3.355-1.042A18.007,18.007,0,0,0,35.774,17.9Z" transform="translate(-8877.5 8636.559)" fill="#0c1f87" stroke="rgba(0,0,0,0)" strokeMiterlimit="10" strokeWidth="1"/>
                <path id="Path_1475" data-name="Path 1475" d="M0,66.9v.042H66.9V0A66.9,66.9,0,0,0,0,66.9Z" transform="translate(-8595.902 8633.056)" fill="#1252ff"/>
                <path id="Path_1477" data-name="Path 1477" d="M62,0V62H0Z" transform="translate(-8868 8571.056)" fill="#1252ff"/>
                <path id="Path_1478" data-name="Path 1478" d="M0,0,62,62H0Z" transform="translate(-8672 8571.056)" fill="#ffb858"/>
                <rect className={`top-small-block ${step === 1 ? "active" : ""}`} id="Rectangle_382" data-name="Rectangle 382" width="62" height="65" transform="translate(-8770 8227)" fill={step === 1 ? hoverColor : selectedColors[0]} />
                {/* <rect class="top-small-block" id="Rectangle_382" data-name="Rectangle 382" width="62" height="65" transform="translate(-8770 8227)" fill="#1252ff"/> */}
                <line id="Line_9" data-name="Line 9" y2="26" transform="translate(-8729.5 8247.5)" fill="none" stroke="#0c1f87" strokeLinecap="round" strokeWidth="4"/>
                <line id="Line_10" data-name="Line 10" y2="26" transform="translate(-8748.5 8247.5)" fill="none" stroke="#0c1f87" strokeLinecap="round" strokeWidth="4"/>
                <path id="Path_1633" data-name="Path 1633" d="M0,0,62,62H0Z" transform="translate(-8610 8633.056) rotate(180)" fill="#ff5872"/>
                <path id="Path_1634" data-name="Path 1634" d="M62,0V62H0Z" transform="translate(-8806 8633.056) rotate(180)" fill="#0c1f87"/>
                <path className="doorway-arch mix-blend isolation" id="Path_1635" data-name="Path 1635" d="M0,0V56.642H27.621c0-22.7,17.841-40.905,39.578-40.905s39.18,18.2,39.18,40.905H134V0Z" transform="translate(-8806 8633.056)" fill="#fff" opacity="0.387" />
              </g>
            </g>
          </svg>

        </div>


        <div className='color-block'>
          <div className='color button-red'></div>
          <div className='color button-blue'></div>
          <div className='color button-yellow'></div>
        </div>

      </div>
    </div>
  );
}

export default App;


