import React, { useState, useEffect } from "react";
import { FixedSizeList } from "react-window";
import "../../index.css";

const loadJSON = key => key && JSON.parse(localStorage.getItem(key));
const saveJSON = (key, data) => localStorage.setItem(key, JSON.stringify(data));


export default function DogList() {
  const [data, setData] = useState(loadJSON("dogList"));
  const [loading, setLoading] = useState(!data);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomImageSrc, setZoomImageSrc] = useState("");


  useEffect(() => {
    if (!data) {
      fetch("https://api.thedogapi.com/v1/breeds")
        .then(response => response.json())
        .then(fetchedData => {
          const filteredData = fetchedData.map(breed => ({
            id: breed.id,
            name: breed.name,
            reference_image_id: breed.reference_image_id,
            weight: breed.weight.metric,
          }));
          setData(filteredData);
          saveJSON("dogList", filteredData);
          setLoading(false);
        })
        .catch(console.error);
    }
  }, [data]);

  const renderRow = ({ index, style }) => {
    const breed = data[index];
    return (
      <div className="dog-row" style={style} onClick={() => openZoom(`https://cdn2.thedogapi.com/images/${breed.reference_image_id}.jpg`)}>
        <div className="avatar-container">
          {breed.reference_image_id && (
            <img
              className="dog-avatar"
              src={`https://cdn2.thedogapi.com/images/${breed.reference_image_id}.jpg`}
              alt={breed.name}
            />
          )}
        </div>
        <div className="dog-info">
          <strong className="dog-name">{breed.name}</strong>
          <span className="dog-weight">Weight - {breed.weight} kg</span>
        </div>
      </div>
    );
  };

  const openZoom = (imageSrc) => {
    setZoomImageSrc(imageSrc);
    setIsZoomOpen(true);
  };

  const closeZoom = () => {
    setIsZoomOpen(false);
    setZoomImageSrc("");
  };

  return (
    <div className="dog-list-container">
      <div className="dog-list-header">Dog breeds</div>
      {loading ? (
        <p>Fetching data from API</p>
      ) : (
        <FixedSizeList
          height={window.innerHeight - 100}
          width={window.innerWidth - 20}
          itemCount={data.length}
          itemSize={70}
        >
          {renderRow}
        </FixedSizeList>
      )}
      {isZoomOpen && (
        <div className="zoom" onClick={closeZoom}>
          <div className="zoom-content">
            <img src={zoomImageSrc} alt="Zoomed dog photo" className="zoom-image" />
          </div>
        </div>
      )}
    </div>
  );
}
