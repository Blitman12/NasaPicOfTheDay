import { useState, Fragment } from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import Expire from './Expire';
import { BarLoader } from 'react-spinners';

const NearEarthObjects = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [dateDifferenceErr, setDateDifErr] = useState(null);
  const [neo, setNeo] = useState(null);
  const [loading, setLoading] = useState(false);

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

  return (
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
              <Expire delay="5000">
                <div style={{ color: 'red' }}>**{dateDifferenceErr[key]}**</div>
              </Expire>
            );
          })}
      </section>
      <div className="loader">
        <BarLoader size={100} color="red" loading={loading} />
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
  );
};

export default NearEarthObjects;
