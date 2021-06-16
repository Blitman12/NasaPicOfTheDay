import React from 'react';
import PictureOfTheDay from './components/PictureOfTheDay';
import NearEarthObjects from './components/NearEarthObjects';
import MarsInfo from './components/MarsInfo';
import './App.css';

const App = () => {
  return (
    <div className="entire">
      <PictureOfTheDay />
      <NearEarthObjects />
      <MarsInfo />
    </div>
  );
};

export default App;
