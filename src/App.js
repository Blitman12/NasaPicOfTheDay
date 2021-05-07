import React, { useState, useEffect, Fragment } from 'react';
import { MoonLoader } from 'react-spinners';
import DatePicker from 'react-datepicker';
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import './App.css';

const App = () => {
  const [picture, setPicture] = useState(null);
  const [picInfo, setPicInfo] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [marsInfo, setMarsInfo] = useState(null);
  const [neo, setNeo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apodLoad, apodSetLoad] = useState(false);
  const [marsLoading, setMarsLoading] = useState(false);
  const [dateDifferenceErr, setDateDifErr] = useState(null);

  // On Site load Nasa Picture Of The Day
  useEffect(() => {
    try {
      apodSetLoad(true);
      async function fetchData() {
        const response = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${process.env.REACT_APP_API_KEY}`
        );
        const data = await response.json();
        setPicture(data.url);
        setPicInfo(data);
        apodSetLoad(false);
      }
      fetchData();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleClick = async () => {
    // changes user submitted date to yyyy-mm-dd
    let newStartDate = new Date(startDate);
    let finalSDate = JSON.stringify(newStartDate);
    finalSDate = finalSDate.slice(1, 11);
    // changes user submitted date to yyyy-mm-dd
    let newEndDate = new Date(endDate);
    let finalEDate = JSON.stringify(newEndDate);
    finalEDate = finalEDate.slice(1, 11);

    // Sets loading Spinner
    setLoading(true);
    // Fetch call for data return

    // Valdiation Function Call
    const isValid = formValidation();
    if (isValid) {
      try {
        await fetch(
          `https://api.nasa.gov/neo/rest/v1/feed?start_date=${finalSDate}&end_date=${finalEDate}&api_key=${process.env.REACT_APP_API_KEY}`
        )
          .then((response) => response.json())
          .then((data) => {
            const neoData = data.near_earth_objects;
            setNeo(neoData);
            // Turns loading off
            setLoading(false);
            // Reset Validation for Dates
            setDateDifErr(null);
          });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const formValidation = () => {
    const dateDifferenceErr = {};
    let isValid = true;

    let newStartDate = new Date(startDate);
    let finalSDate = JSON.stringify(newStartDate);
    finalSDate = finalSDate.slice(1, 11);
    let newEndDate = new Date(endDate);
    let finalEDate = JSON.stringify(newEndDate);
    finalEDate = finalEDate.slice(1, 11);

    let dayDif = Math.floor(
      (Date.parse(finalEDate) - Date.parse(finalSDate)) / 86400000
    );

    if (dayDif > 4) {
      dateDifferenceErr.datesToFarApart = 'The dates are too far apart';
      isValid = false;
      setLoading(false);
    }
    setDateDifErr(dateDifferenceErr);
    return isValid;
  };

  const solTemp = async () => {
    setMarsLoading(true);
    try {
      await fetch(`https://api.maas2.apollorion.com/`)
        .then((response) => response.json())
        .then((data) => {
          const marsData = data;
          setMarsInfo(marsData);
          setMarsLoading(false);
        });
    } catch (e) {
      console.error(e);
    }
  };

  const cToF = (num) => {
    return Math.round(num * (9 / 5) + 32);
  };

  return (
    <div className="entire">
      <div className="title">
        <h1>Nasa`s Picture of the day</h1>
      </div>
      {apodLoad ? (
        <div className="loader">
          <MoonLoader size={100} color="red" loading={apodLoad} />
        </div>
      ) : (
        <div className="feed-container">
          <Card style={{ width: '35rem' }}>
            <Card.Img variant="top" src={picture} />
            <Card.Body>
              {picInfo && <Card.Title>{picInfo.title}</Card.Title>}
              {picInfo && <Card.Text>{picInfo.explanation}</Card.Text>}
            </Card.Body>
            <Card.Body>
              {picInfo && (
                <Card.Link href={picture}>Link to original photo</Card.Link>
              )}
            </Card.Body>
            {picInfo && (
              <Card.Footer className="text-muted">
                Date: {picInfo.date}
              </Card.Footer>
            )}
          </Card>
        </div>
      )}

      <div>
        <section className="title-2">
          <h1>How many Near Earth Objects (NEO) are there?</h1>
        </section>
        <section className="date-ranges">
          <p>*please select no more than 5 days*</p>
          <DatePicker
            dateFormat="yyyy/MM/dd"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
          <DatePicker
            dateFormat="yyyy/MM/dd"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
          />
          <button onClick={() => handleClick()}>Submit Search</button>
          {dateDifferenceErr &&
            Object.keys(dateDifferenceErr).map((key) => {
              return (
                <div style={{ color: 'red' }}>{dateDifferenceErr[key]}</div>
              );
            })}
        </section>
        <div className="loader">
          <MoonLoader size={100} color="red" loading={loading} />
        </div>
        <section className="displayNEO">
          {neo &&
            Object.entries(neo).map(([key, val]) => (
              <Fragment key={key} className="neo-cards">
                <Card style={{ width: '18rem' }}>
                  <Card.Header>
                    {key} had {val.length} NEO`s
                  </Card.Header>
                  <Card.Title>Name</Card.Title>
                  <ListGroup variant="flush">
                    {val.map((neodata) => {
                      console.log(neodata.nasa_jpl_url);

                      return (
                        <ListGroup.Item key={neodata.name}>
                          <a
                            href={neodata.nasa_jpl_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {neodata.name}
                          </a>
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                </Card>
              </Fragment>
            ))}
        </section>
      </div>
      <div>
        <section className="title-2">
          <h1>Guess what the temps are by the Curiosity Rover on Mars</h1>
          <button onClick={() => solTemp()} style={{ marginTop: '1em' }}>
            Get Info
          </button>
        </section>
        <div className="loader2">
          <MoonLoader size={100} color="red" loading={marsLoading} />
        </div>
        <section className="displayMars">
          {marsInfo && (
            <Card style={{ width: '18rem' }}>
              <Card.Header>Todays Mars Information</Card.Header>
              <ListGroup variant="flush">
                <ListGroupItem>
                  Min Temp: {marsInfo.min_temp}°C or {cToF(marsInfo.min_temp)}°F
                </ListGroupItem>
                <ListGroupItem>
                  Max Temp: {marsInfo.max_temp}°C or {cToF(marsInfo.max_temp)}°F
                </ListGroupItem>
                <ListGroupItem>Sunrise: {marsInfo.sunrise}</ListGroupItem>
                <ListGroupItem>Sunrise: {marsInfo.sunset}</ListGroupItem>
                <ListGroupItem>
                  General Weather: {marsInfo.atmo_opacity}
                </ListGroupItem>
                <ListGroupItem>
                  Mars Month Number: {marsInfo.season.substring(6)}
                </ListGroupItem>
              </ListGroup>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
};

export default App;
