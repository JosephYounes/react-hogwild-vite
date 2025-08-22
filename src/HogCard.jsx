import { useState } from "react";

function HogCard({ hog }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  if (isHidden) return null;

  return (
    <div
      aria-label="hog card"
      className="ui card"
      onClick={() => setShowDetails(!showDetails)}
      style={{ cursor: "pointer" }}
    >
      <div className="image">
        <img src={hog.image} alt={`Photo of ${hog.name}`} />
      </div>
      <div className="content">
        <h3 className="header">{hog.name}</h3>
        {showDetails && (
          <div>
            <p>Specialty: {hog.specialty}</p>
            <p>{hog.weight}</p>
            <p>{hog.greased ? "Greased" : "Nongreased"}</p>
            <p>{hog.highestMedalAchieved}</p>
          </div>
        )}
      </div>
      <div className="extra content">
        <button
          className="ui button"
          onClick={(e) => {
            e.stopPropagation();
            setIsHidden(true);
          }}
        >
          Hide Me
        </button>
      </div>
    </div>
  );
}

export default HogCard;