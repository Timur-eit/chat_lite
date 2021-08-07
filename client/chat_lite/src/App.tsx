import React from 'react';
import './App.css';
import JoinBlock from './components/JoinBlock'

function App() {
  
  // const connectSocket = () => {
  //   io('http://localhost:9999')
  // }
  
  return (
    <div className="App">
      {/* <button onClick={() => connectSocket()}>CONNECT</button> */}
      <JoinBlock />
      

    </div>
  );
}

export default App;
