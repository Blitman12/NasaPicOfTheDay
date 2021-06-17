import React, {useState} from 'react';
import { BarLoader } from 'react-spinners';
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';

const MarsInfo = () => {
    const [marsInfo, setMarsInfo] = useState(null);
    const [marsLoading, setMarsLoading] = useState(false);


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
    <div>
        <section className="title-2">
          <h1>Whats the environment like by the curiosity rover on Mars?</h1>
          <button onClick={() => solTemp()} style={{ marginTop: '1em' }}>
            Get Info
          </button>
        </section>
        <div className="loader2">
          <BarLoader size={100} color="red" loading={marsLoading} />
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
)
}

export default MarsInfo;