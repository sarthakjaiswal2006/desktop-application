
import { useRef, useState } from "react";
import "./App.css";

function App() {
  const videoRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);

  async function getCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      videoRef.current.srcObject = stream;
      setCameraOn(true);
    } catch (error) {
      console.log(error);
      alert("Unable to access camera. Please allow camera permission.");
    }
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand">
          <div className="brand-logo">A</div>
          <span>
            Newton <b>Athena</b>
          </span>
        </div>

        <span className="nav-label">Assessment Portal</span>
      </nav>

      <main className="main-content">

        <section className="camera-card">
          <div className="card-heading">
            <div>
              <h2>Camera Setup</h2>
              <p>Make sure your camera is working correctly.</p>
            </div>

            <span className={cameraOn ? "status active" : "status"}>
              <span className="dot"></span>
              {cameraOn ? "Connected" : "Not connected"}
            </span>
          </div>

          <div className="video-container">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className={cameraOn ? "video active-video" : "video"}
            />

            {!cameraOn && (
              <div className="video-placeholder">
                <div className="camera-icon">◎</div>
                <h3>Your camera preview</h3>
                <p>Enable camera access to see yourself here.</p>
              </div>
            )}
          </div>

          <div className="card-footer">
            <p>🔒 Your camera preview stays on this screen.</p>

            {!cameraOn && (
              <button onClick={getCamera}>
                Get Camera Access <span>→</span>
              </button>
            )}
          </div>
        </section>

        <div className="info-card">
          <div className="info-icon">✓</div>

          <div>
            <h3>Before you begin</h3>
            <p>
              Sit in a well-lit room and ensure your face is clearly
              visible. Your camera will remain on during the exam.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
