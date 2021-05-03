import React, { useState, useEffect } from "react";
import {Card} from 'react-bootstrap';
import './App.css';

const App = () => {
  const [picture, setPicture] = useState(null);
  const [picInfo, setPicInfo] = useState(null);
  

  useEffect(() => {
    async function fetchData() {
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.REACT_APP_API_KEY}`
    );
    const data = await response.json();
    setPicture(data.url);
    setPicInfo(data);
  }
  fetchData();
  }, []);


  return (
    <div className="body">
      <div className="title">
        <h1>Nasa`s Picture of the day</h1>
      </div>
          <Card style={{ width: '35rem' }}>
            <Card.Img variant="top" src={picture} />
            <Card.Body>
              {picInfo && <Card.Title>{picInfo.title}</Card.Title>}
              {picInfo && <Card.Text>{picInfo.explanation}</Card.Text>}
            </Card.Body>
            <Card.Body>
              {picInfo && <Card.Link href={picture}>Link to original photo</Card.Link>}
            </Card.Body>
            {picInfo && <Card.Footer className="text-muted">Date: {picInfo.date}</Card.Footer>}
          </Card>
     </div>
  );
}


export default App;