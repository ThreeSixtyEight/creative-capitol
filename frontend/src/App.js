import './App.css'
import './print.css'
import { io } from "socket.io-client";
import {useEffect, useState, useCallback} from "react";


const socket = io("http://localhost:5001/", {
  transports: ["websocket"],
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

  const updateScreen = useCallback(() => {
    const prevHover = hoverColor;
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
    if (prevHover !== hoverColor) {
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
  }, [hoverTime, step, selectedColors, hoverColor, setHoverColor, setHoverTime, setStep, setSelectedColors]);
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
      updateScreen();
    });
  }, [timer, isConnected, updateScreen]);


  useEffect(() => {
    const FPS = 60;
    const i = 1000 / FPS;
    const interval = setInterval(() => {
      socket.emit('ping');
    }, i);
    return () => clearInterval(interval);
  }, [dotPos]);


  return (
    <div
      className='main-container'
    >
      <div className={`position pointer pie ${hoverTime > 0 ? 'hovering' : ''}`} style={{
        left: `${50 + dotPos[0]}%`, top: `${40 + dotPos[1]}%`,
      }}>
        {hoverTime > 0 ? Math.round(hoverTime / 30) + 1 : ""}
        <h1>{hoverTime}</h1>
      </div>

      <div className='wrapper'>

        <div className='svg-block'>

          <svg className='svg-building' xmlns="http://www.w3.org/2000/svg" width="420.001" height="603.111" viewBox="0 0 420.001 603.111">
            <g id="Group_76" data-name="Group 76" transform="translate(-750 -339.944)">
              <g id="Group_75" data-name="Group 75" transform="translate(9699 -7824)">
                <path id="Path_1465" data-name="Path 1465" d="M4783.82,2391.476l-1.006-.288-9.2,11.931-7.332-7.475,11.933-9.2-.433-1.15-15.094,1.725v-10.35l15.239,1.869.431-.862-12.363-9.775,7.619-7.044,9.343,11.93.863-.286-1.726-15.237h11.213l-1.726,15.237.864.286,9.342-11.93,7.619,7.044-12.363,9.775.432.862,15.236-1.869v10.35l-15.092-1.725-.432,1.15,11.932,9.2-7.333,7.475-9.2-11.931-1.008.288,1.726,15.237h-11.213Z" transform="translate(-13526.7 5806.681)" fill="#ff5872"/>
                <rect className={`top-tower-section ${step === 2 ? "active" : ""}`} id="Rectangle_369" data-name="Rectangle 369" width="134" height="139" transform="translate(-8806 8292.056)" fill={step === 2 ? "#fff" : selectedColors[1]} />

                {/* <rect className="top-tower-section" id="Rectangle_369" data-name="Rectangle 369" width="134" height="139" transform="translate(-8806 8292.056)" fill="#ffb858"/> */}

                <rect className={`middle-tower-section ${step === 3 ? "active" : ""}`} id="Rectangle_370" data-name="Rectangle 370" width="134" height="140" transform="translate(-8806 8431.056)" fill={step === 3 ? "#fff" : selectedColors[2]} />

                {/* <rect className="middle-tower-section" id="Rectangle_370" data-name="Rectangle 370" width="134" height="140" transform="translate(-8806 8431.056)" fill="#1252ff"/> */}
                <rect className="base-section" id="Rectangle_372" data-name="Rectangle 372" width="420" height="134" transform="translate(-8949 8633.056)" fill="#0c1f87" />
                <rect id="Rectangle_374" data-name="Rectangle 374" width="143" height="134" transform="translate(-8949 8633.056)" fill="#ffb858" />

                <path id="Path_1479" data-name="Path 1479" d="M0,38.946H77.892A38.946,38.946,0,1,0,0,38.946Z" transform="translate(-8749.893 8351.174)" fill="#fff" opacity="0.416" className='mix-blend isolation' />
                <rect className={`bottom-tower-section ${step === 4 ? "active" : ""}`} id="Rectangle_375" data-name="Rectangle 375" width="134" height="196" transform="translate(-8806 8571.056)" fill={step === 4 ? "#fff" : selectedColors[3]} />
                {/* <rect className="bottom-tower-section" id="Rectangle_375" data-name="Rectangle 375" width="134" height="196" transform="translate(-8806 8571.056)" fill="#ff5872"/> */}
                <rect className="top-tower-section" id="" data-name="Rectangle 382" width="134" height="139" transform={`translate(-8672 8431.056) rotate(180) scale(1 ${step === 2 ? hoverColor === "#fff" ? "0" : (hoverTime / 40 <= 1 ? hoverTime / 40 : 1) : 0})`} fill={hoverColor} />
                <rect className="middle-tower-section" id="" data-name="Rectangle 370" width="134" height="140" transform={`translate(-8672 8571.056) rotate(180) scale(1 ${step === 3 ? hoverColor === "#fff" ? "0" : (hoverTime / 40 <= 1 ? hoverTime / 40 : 1) : 0})`} fill={hoverColor} />

                <rect className="bottom-tower-section" id="" data-name="Rectangle 375" width="134" height="196" transform={`translate(-8672 8767.056) rotate(180) scale(1 ${step === 4 ? hoverColor === "#fff" ? "0" : (hoverTime / 40 <= 1 ? hoverTime / 40 : 1) : 0})`} fill={hoverColor} />

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
                <rect className={`top-small-block ${step === 1 ? "active" : ""}`} id="Rectangle_382" data-name="Rectangle 382" width="62" height="65" transform="translate(-8770 8292) rotate(-90)" fill={step === 1 ? "#fff" : selectedColors[0]} />

                <rect className="top-small-block" id="Rectangle_382" data-name="Rectangle 382" width="65" height="65" transform={`translate(-8705 8292) rotate(180) scale(1 ${step === 1 ? hoverColor === "#fff" ? "0" : (hoverTime / 40 <= 1 ? hoverTime / 40 : 1) : 0})`} fill={hoverColor} />
                <line id="Line_9" data-name="Line 9" y2="26" transform="translate(-8729.5 8247.5)" fill="none" stroke="#0c1f87" strokeLinecap="round" strokeWidth="4"/>
                <line id="Line_10" data-name="Line 10" y2="26" transform="translate(-8748.5 8247.5)" fill="none" stroke="#0c1f87" strokeLinecap="round" strokeWidth="4"/>
                <path id="Path_1633" data-name="Path 1633" d="M0,0,62,62H0Z" transform="translate(-8610 8633.056) rotate(180)" fill="#ff5872"/>
                <path id="Path_1634" data-name="Path 1634" d="M62,0V62H0Z" transform="translate(-8806 8633.056) rotate(180)" fill="#0c1f87"/>
                <path className="doorway-arch mix-blend isolation" id="Path_1635" data-name="Path 1635" d="M0,0V56.642H27.621c0-22.7,17.841-40.905,39.578-40.905s39.18,18.2,39.18,40.905H134V0Z" transform="translate(-8806 8633.056)" fill="#fff" opacity="0.387" />
              </g>
            </g>
          </svg>

        </div>
        <div className='content-wrapper'>
          <div className='title-wrapper'>
            <svg className="main-title" xmlns="http://www.w3.org/2000/svg" width="730.55" height="182.29" viewBox="0 0 730.55 182.29">
              <g id="Group_635" data-name="Group 635" transform="translate(-845.275 -42.319)">
                <g id="Group_634" data-name="Group 634" transform="translate(841 112.304)">
                  <path id="Path_1469" data-name="Path 1469" d="M38.38,1.33c15.01,0,27.265-8.645,31.635-23.275H57.76C54.53-14.155,46.835-9.69,38.38-9.69c-13.11,0-22.135-9.975-22.135-23.56,0-13.4,9.025-23.465,22.135-23.465,8.645,0,16.15,4.655,19.38,12.255H70.015C65.55-58.9,53.39-67.735,38.38-67.735c-19.855,0-34.105,15.01-34.105,34.485C4.275-13.585,18.43,1.33,38.38,1.33ZM76.19,0H87.4V-24.6c0-9.405,4.37-15.2,12.54-15.2h4.94v-11.21h-3.705a14.8,14.8,0,0,0-13.11,8.55h-.76V-49.78H76.19Zm54.435,1.235c10.355,0,19.475-5.13,22.705-15.485l-10.26-2.47c-1.805,5.51-7.03,8.36-12.54,8.36-8.17,0-13.585-5.32-13.68-13.68h37.715v-3.135c0-14.82-9.215-25.84-24.415-25.84-13.395,0-24.89,10.545-24.89,26.22C105.26-9.6,115.425,1.235,130.625,1.235ZM116.945-30.21c.665-5.985,6.08-11.02,13.2-11.02,6.84,0,12.445,4.275,13.015,11.02ZM180.88,1.235c8.645,0,13.015-4.465,14.915-7.5h.855A6.8,6.8,0,0,0,203.775,0h8.455V-9.5h-2.185a2.028,2.028,0,0,1-2.28-2.185V-49.78h-11.21v6.08H195.7c-2.185-3.04-6.745-7.315-15.105-7.315-13.3,0-23.18,11.02-23.18,26.125S167.485,1.235,180.88,1.235ZM182.875-9.6c-7.885,0-14.06-5.8-14.06-15.2,0-9.215,5.985-15.485,13.965-15.485,7.6,0,13.965,5.6,13.965,15.485C196.745-16.34,191.33-9.6,182.875-9.6ZM238.83,0h8.74V-9.975h-8.645c-3.42,0-4.845-1.52-4.845-5.035V-39.9h14.06v-9.88H234.08V-63.745H223.44V-49.78h-9.31v9.88h8.645v24.985C222.775-4.37,229.14,0,238.83,0Zm27.55-57.475a6.92,6.92,0,0,0,7.125-7.03,6.9,6.9,0,0,0-7.125-6.935,6.9,6.9,0,0,0-7.125,6.935A6.92,6.92,0,0,0,266.38-57.475ZM260.68,0h11.21V-49.78H251.94v9.88h8.74Zm33.25,0h15.2l17.005-49.78H314.07L301.815-10.64h-.855L288.61-49.78H276.83Zm56.05,1.235c10.355,0,19.475-5.13,22.7-15.485l-10.26-2.47c-1.8,5.51-7.03,8.36-12.54,8.36-8.17,0-13.585-5.32-13.68-13.68H373.92v-3.135c0-14.82-9.215-25.84-24.415-25.84-13.395,0-24.89,10.545-24.89,26.22C324.615-9.6,334.78,1.235,349.98,1.235ZM336.3-30.21c.665-5.985,6.08-11.02,13.205-11.02,6.84,0,12.445,4.275,13.015,11.02Zm95,31.54c15.01,0,27.265-8.645,31.635-23.275H450.68C447.45-14.155,439.755-9.69,431.3-9.69c-13.11,0-22.135-9.975-22.135-23.56,0-13.4,9.025-23.465,22.135-23.465,8.645,0,16.15,4.655,19.38,12.255h12.255C458.47-58.9,446.31-67.735,431.3-67.735c-19.855,0-34.105,15.01-34.105,34.485C397.2-13.585,411.35,1.33,431.3,1.33Zm57.95-.1c8.645,0,13.015-4.465,14.915-7.5h.855A6.8,6.8,0,0,0,512.145,0H520.6V-9.5h-2.185a2.028,2.028,0,0,1-2.28-2.185V-49.78h-11.21v6.08h-.855c-2.185-3.04-6.745-7.315-15.1-7.315-13.3,0-23.18,11.02-23.18,26.125S475.855,1.235,489.25,1.235ZM491.245-9.6c-7.885,0-14.06-5.8-14.06-15.2,0-9.215,5.985-15.485,13.965-15.485,7.6,0,13.965,5.6,13.965,15.485C505.115-16.34,499.7-9.6,491.245-9.6ZM526.3,21.85h11.21V-6.27h.855c2.09,3.04,6.555,7.5,15.39,7.5,13.3,0,22.99-11.21,22.99-26.125,0-15.01-10.355-26.125-23.75-26.125a17.524,17.524,0,0,0-14.725,7.22h-.855V-49.78H526.3ZM551.38-9.31c-7.7,0-14.06-5.7-14.06-15.58,0-8.455,5.415-15.58,13.87-15.58,7.885,0,14.06,6.175,14.06,15.58C565.25-15.675,559.265-9.31,551.38-9.31Zm43.13-48.165a6.92,6.92,0,0,0,7.125-7.03,6.9,6.9,0,0,0-7.125-6.935,6.9,6.9,0,0,0-7.125,6.935A6.92,6.92,0,0,0,594.51-57.475ZM588.81,0h11.21V-49.78H580.07v9.88h8.74Zm42.75,0h8.74V-9.975h-8.645c-3.42,0-4.845-1.52-4.845-5.035V-39.9h14.06v-9.88H626.81V-63.745H616.17V-49.78h-9.31v9.88H615.5v24.985C615.5-4.37,621.87,0,631.56,0Zm73.435,0h29.83V-9.88h-9.31V-71.25h-20.52v9.975h9.31V-9.88h-9.31Z" transform="translate(0 90.455)" fill="#fff7eb"/>
                  <path id="Path_1267" data-name="Path 1267" d="M34.627-63.581H48.462l-2.129-18.8,1.242-.355L58.928-68.015l9.046-9.224L53.252-88.591l.532-1.419,18.625,2.129v-12.771l-18.8,2.306-.532-1.064,15.255-12.062-9.4-8.692L47.4-105.443l-1.064-.355,2.129-18.8H34.627l2.129,18.8-1.064.355-11.53-14.723-9.4,8.692L30.015-99.412l-.532,1.064-18.8-2.306v12.771l18.625-2.129.532,1.419L15.115-77.239l9.046,9.224L35.513-82.738l1.242.355Z" transform="translate(631.49 155.59)" fill="#ff5872"/>
                </g>
                <path id="Path_1470" data-name="Path 1470" d="M6.175,0h30.97c10.83,0,20.9-7.22,20.9-19.76A16.5,16.5,0,0,0,48.83-34.865v-.57a15.136,15.136,0,0,0,7.03-13.11c0-10.26-7.41-17.955-20.71-17.955H6.175v9.69H12.16V-9.785H6.175Zm17.2-39.045v-17H34.96c5.32,0,9.215,3.42,9.215,8.36,0,5.035-3.7,8.645-9.31,8.645Zm0,28.6V-29.735H35.055c6.08,0,11.21,3.04,11.21,9.5S41.61-10.45,35.53-10.45ZM83.03,1.235c6.65,0,11.21-3.135,13.4-6.935h.855V0h11.21V-49.78H97.28v29.07A10.693,10.693,0,0,1,86.45-9.69c-5.7,0-10.07-4.275-10.07-10.45V-49.78H65.17v32.585C65.17-6.935,72.1,1.235,83.03,1.235Zm46.55-58.71a6.92,6.92,0,0,0,7.125-7.03,6.9,6.9,0,0,0-7.125-6.935,6.9,6.9,0,0,0-7.125,6.935A6.92,6.92,0,0,0,129.58-57.475ZM123.88,0h11.21V-49.78H115.14v9.88h8.74Zm19.475,0h29.83V-9.88h-9.31V-71.25h-20.52v9.975h9.31V-9.88h-9.31ZM199.69,1.235A17.715,17.715,0,0,0,214.51-5.89h.855V0h11.02V-71.25h-11.21v27.835h-.855a18.014,18.014,0,0,0-15.3-7.6c-13.395,0-22.99,11.3-22.99,26.125C176.035-9.785,186.295,1.235,199.69,1.235Zm1.8-10.45c-7.79,0-14.155-6.175-14.155-15.58,0-9.215,6.08-15.675,14.06-15.675,7.7,0,14.06,5.8,14.06,15.675C215.46-16.34,209.95-9.215,201.495-9.215ZM272.27,0h11.4V-29.07L306.85-66.5H293.17L278.255-40.85H277.4L262.485-66.5h-13.3L272.27-29.07Zm53.675,1.235c15.3,0,26.315-11.3,26.315-26.125s-10.925-26.125-26.22-26.125-26.315,11.3-26.315,26.125C299.725-9.975,310.65,1.235,325.945,1.235Zm0-10.64c-8.645,0-14.82-6.46-14.82-15.485,0-8.835,6.08-15.485,14.82-15.485s14.915,6.65,14.915,15.485C340.86-15.96,334.685-9.4,325.945-9.4Zm50.35,10.64c6.65,0,11.21-3.135,13.4-6.935h.855V0h11.21V-49.78h-11.21v29.07a10.693,10.693,0,0,1-10.83,11.02c-5.7,0-10.07-4.275-10.07-10.45V-49.78h-11.21v32.585C358.435-6.935,365.37,1.235,376.295,1.235ZM411.255,0h11.21V-24.6c0-9.405,4.37-15.2,12.54-15.2h4.94v-11.21H436.24a14.8,14.8,0,0,0-13.11,8.55h-.76V-49.78H411.255ZM497.04,1.235c19.57,0,34.39-15.01,34.39-34.485,0-19.38-14.725-34.485-34.295-34.485s-34.39,14.915-34.39,34.485C462.745-13.585,477.47,1.235,497.04,1.235Zm.1-11.02c-12.92,0-22.42-9.88-22.42-23.465,0-13.4,9.5-23.465,22.42-23.465,12.73,0,22.325,10.07,22.325,23.465C519.46-19.665,509.865-9.785,497.135-9.785ZM547.39,0h15.865l9.025-39.045h.57L581.875,0h15.77L610.85-49.78H598.975L589.95-10.64h-.855L580.07-49.78H565.155l-9.12,39.14h-.855l-8.93-39.14H534.28Zm67.26,0h11.21V-29.355a10.693,10.693,0,0,1,10.83-11.02c5.7,0,10.07,4.275,10.07,10.45V0h11.21V-32.585c0-10.26-6.935-18.43-17.86-18.43-6.65,0-11.21,3.135-13.4,6.935h-.855v-5.7H614.65Z" transform="translate(841 113.759)" fill="#fff7eb"/>
              </g>
            </svg>
            <svg className="instructions" xmlns="http://www.w3.org/2000/svg" width="209.034" height="94.118" viewBox="0 0 209.034 94.118">
              <path id="Path_1468" data-name="Path 1468" d="M4.165,0h5.929V-12.691h5.88c6.37,0,11.123-4.41,11.123-10.878C27.1-30.086,22.54-34.3,15.974-34.3H4.165Zm5.929-18.179V-28.812H15.68a5.042,5.042,0,0,1,5.341,5.243,5.132,5.132,0,0,1-5.341,5.39ZM40.572.637A13.161,13.161,0,0,0,54.145-12.838,13.121,13.121,0,0,0,40.621-26.313,13.161,13.161,0,0,0,27.048-12.838,13.092,13.092,0,0,0,40.572.637Zm0-5.488c-4.459,0-7.644-3.332-7.644-7.987,0-4.557,3.136-7.987,7.644-7.987s7.693,3.43,7.693,7.987C48.265-8.232,45.08-4.851,40.572-4.851ZM63.308-29.645a3.569,3.569,0,0,0,3.675-3.626,3.558,3.558,0,0,0-3.675-3.577,3.558,3.558,0,0,0-3.675,3.577A3.569,3.569,0,0,0,63.308-29.645ZM60.368,0H66.15V-25.676H55.86v5.1h4.508Zm11.27,0H77.42V-15.141a5.515,5.515,0,0,1,5.586-5.684,5.126,5.126,0,0,1,5.194,5.39V0h5.782V-16.807c0-5.292-3.577-9.506-9.212-9.506a7.657,7.657,0,0,0-6.909,3.577H77.42v-2.94H71.638Zm37.534,0h4.508V-5.145h-4.459c-1.764,0-2.5-.784-2.5-2.6V-20.58h7.252v-5.1h-7.252v-7.2h-5.488v7.2h-4.8v5.1h4.459V-7.693C100.891-2.254,104.174,0,109.172,0Zm29.3,0h4.508V-5.145h-4.459c-1.764,0-2.5-.784-2.5-2.6V-20.58h7.252v-5.1h-7.252v-7.2h-5.488v7.2h-4.8v5.1h4.459V-7.693C130.193-2.254,133.476,0,138.474,0Zm20.041.637a13.161,13.161,0,0,0,13.573-13.475,13.121,13.121,0,0,0-13.524-13.475,13.161,13.161,0,0,0-13.573,13.475A13.092,13.092,0,0,0,158.515.637Zm0-5.488c-4.459,0-7.644-3.332-7.644-7.987,0-4.557,3.136-7.987,7.644-7.987s7.693,3.43,7.693,7.987C166.208-8.232,163.023-4.851,158.515-4.851ZM14.063,46.637c4.459,0,6.713-2.3,7.693-3.871H22.2A3.507,3.507,0,0,0,25.872,46h4.361V41.1H29.106a1.046,1.046,0,0,1-1.176-1.127V20.324H22.148V23.46h-.441a9.165,9.165,0,0,0-7.791-3.773c-6.86,0-11.956,5.684-11.956,13.475S7.154,46.637,14.063,46.637Zm1.029-5.586c-4.067,0-7.252-2.989-7.252-7.84,0-4.753,3.087-7.987,7.2-7.987,3.92,0,7.2,2.891,7.2,7.987C22.246,37.572,19.453,41.051,15.092,41.051ZM33.173,46h5.782V30.859a5.515,5.515,0,0,1,5.586-5.684,5.126,5.126,0,0,1,5.194,5.39V46h5.782V29.193c0-5.292-3.577-9.506-9.212-9.506A7.657,7.657,0,0,0,39.4,23.264h-.441v-2.94H33.173ZM58.261,57.27h3.675c3.773,0,6.762-1.519,8.134-5.047l12.054-31.9H75.852L69.188,40.463h-.441L62.72,20.324H56.5L65.317,46h1.421l-1.421,3.577a3.278,3.278,0,0,1-3.381,2.4H58.261Zm47.726-10.633c6.027,0,11.074-3.332,12.544-9.555l-5.488-1.323a6.7,6.7,0,0,1-6.909,5.39c-4.41,0-7.546-3.381-7.546-7.987,0-4.508,3.038-7.987,7.5-7.987a6.745,6.745,0,0,1,6.909,5.439l5.488-1.323c-1.47-6.223-6.517-9.6-12.544-9.6-7.84,0-13.279,5.978-13.279,13.475S98,46.637,105.987,46.637Zm27.538,0A13.161,13.161,0,0,0,147.1,33.162a13.549,13.549,0,0,0-27.1,0A13.092,13.092,0,0,0,133.525,46.637Zm0-5.488c-4.459,0-7.644-3.332-7.644-7.987,0-4.557,3.136-7.987,7.644-7.987s7.693,3.43,7.693,7.987C141.218,37.768,138.033,41.149,133.525,41.149ZM149.058,46h15.386V40.9h-4.8V9.25H149.058V14.4h4.8V40.9h-4.8Zm30.38.637a13.161,13.161,0,0,0,13.573-13.475,13.549,13.549,0,0,0-27.1,0A13.092,13.092,0,0,0,179.438,46.637Zm0-5.488c-4.459,0-7.644-3.332-7.644-7.987,0-4.557,3.136-7.987,7.644-7.987s7.693,3.43,7.693,7.987C187.131,37.768,183.946,41.149,179.438,41.149ZM196.2,46h5.782V33.309c0-4.851,2.254-7.84,6.468-7.84h2.548V19.687h-1.911a7.635,7.635,0,0,0-6.762,4.41h-.392V20.324H196.2Z" transform="translate(-1.96 36.848)" fill="#ffb858"/>
            </svg>

          </div>

          <div className='color-block'>
            <div className='color button-red'></div>
            <div className='color button-blue'></div>
            <div className='color button-yellow'></div>
          </div>
          <div className="gradient"></div>
        </div>

      </div>
    </div>
  );
}

export default App;


