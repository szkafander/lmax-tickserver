import React from 'react';
import Record from './Record.js';
// import WSLogger from './WSLogger.js';


const listening = ["EURUSD", ];

function App() {
  return (
    <div id="main">
      {/*<WSLogger></WSLogger>*/}
      <Record listening={listening}></Record>
    </div>
  );
}

export default App;
