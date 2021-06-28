import { useEffect, useState } from 'react';
import { BarLoader } from 'react-spinners';
import { Card } from 'react-bootstrap';

const PictureOfTheDay = () => {
  const [picture, setPicture] = useState(null);
  const [picInfo, setPicInfo] = useState(null);
  const [apodLoad, apodSetLoad] = useState(false);

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

  const dateArr = (key) => {
    const dateArr = key.split('-').reverse();
    [dateArr[0], dateArr[1]] = [dateArr[1], dateArr[0]];
    return dateArr.join('/');
  };

  return (
    <div>
      <div className="title">
        <h1>Nasa`s Picture of the day</h1>
      </div>

      {apodLoad ? (
        <div className="loader">
          <BarLoader size={100} color="red" loading={apodLoad} />
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
                Date: {dateArr(picInfo.date)}
              </Card.Footer>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default PictureOfTheDay;
