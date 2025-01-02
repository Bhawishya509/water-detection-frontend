import React, { useState } from 'react';
import './landingpage.css';
import { useNavigate } from 'react-router';

function LandingPage() {
  const Navigate=useNavigate();
  const [result, setResult] = useState('');

  const analyzeWater = () => {
    
    Navigate("/search")
  };

  return (
    <div className="fullscreen-container">
      {/* Fullscreen Video */}
      {/* <video id="waterVideo" src="/src/components/landingpage/video/landingvideo.mp4" autoPlay muted loop>
        Your browser does not support the video tag.
      </video> */}

<video id="waterVideo" src="video/landingvideo.mp4" autoPlay muted loop>
        Your browser does not support the video tag.
      </video>


      {/* Centered Button */}
      <button className="fullscreen-button" onClick={analyzeWater}>
        Analyze Water
      </button>

      {/* Result Text */}
      <p id="result">{result}</p>
    </div>
  );
}

export default LandingPage;
//jrfhd