import React, { useState, useEffect, Fragment } from "react";
import DatePicker from "react-datepicker";
import {Card, ListGroup} from 'react-bootstrap';
import './App.css';

const App = () => {
  const [picture, setPicture] = useState(null);
  const [picInfo, setPicInfo] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [neo, setNeo] = useState(null);
  

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

  const handleClick = () => {
    // changes user submitted date to yyyy-mm-dd
    let newStartDate = new Date(startDate);
    let finalSDate = JSON.stringify(newStartDate);
    finalSDate = finalSDate.slice(1, 11);
    // changes user submitted date to yyyy-mm-dd
    let newEndDate = new Date(endDate);
    let finalEDate = JSON.stringify(newEndDate);
    finalEDate = finalEDate.slice(1, 11);

    fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${finalSDate}&end_date=${finalEDate}&api_key=${process.env.REACT_APP_API_KEY}`)
    .then(response => response.json())
    .then(data => {
      const neoData = data.near_earth_objects;
      setNeo(neoData);
      console.log(neoData)
    })
  }


  return (
  <div className="entire">
      <div className="title">
        <h1>Nasa`s Picture of the day</h1>
      </div>
      <div  className="feed-container">
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

        <div>
          <section className="title-2">
            <h1>How many Near Earth Objects (NEO) are there?</h1>
          </section>
          <section className="date-ranges">
            <p>*please select no more than 4 days*</p>
            <DatePicker dateFormat="yyyy/MM/dd" selected={startDate} onChange={date => setStartDate(date)}/>
            <DatePicker dateFormat="yyyy/MM/dd" selected={endDate} onChange={date => setEndDate(date)}/>
            <button onClick={() => handleClick()} >Submit Search</button>
          </section>
          <section className="displayNEO">

          {neo && Object.entries(neo).map(([key, val]) => (
            <Fragment key={key} className="neo-cards">
            <Card style={{ width: '18rem' }}>
            <Card.Header>{key} had {val.length} NEO`s</Card.Header>
            <Card.Title>Name</Card.Title>
            <ListGroup variant="flush">
            {
              val.map((neodata) => {
                
                console.log(neodata.nasa_jpl_url)

                return (
                <ListGroup.Item key={neodata.name}><a href={neodata.nasa_jpl_url} target="_blank" rel="noopener noreferrer">{neodata.name}</a></ListGroup.Item>
                )}
              )
            }
            </ListGroup>
            </Card>
            </Fragment>
            ))}
          </section>
        </div>
  </div>
  );
}


export default App;