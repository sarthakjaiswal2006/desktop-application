
import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);

  async function getCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      setCameraOn(true);
    } catch (error) {
      console.log(error);
      alert("Unable to access camera. Please allow camera permission.");
    }
  }

  async function enableFullScreen() {
    try {
      await document.documentElement.requestFullscreen();
    } catch (error) {
      console.log(error);
      alert("Unable to enter fullscreen.");
    }
  }

  useEffect(() => {
    function handleFullScreenChange() {
      setFullScreen(Boolean(document.fullscreenElement));
    }

    document.addEventListener(
      "fullscreenchange",
      handleFullScreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullScreenChange
      );

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

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

          <div className="fullscreen-section">
            <h3>Fullscreen Setup</h3>
            <p>
              Enter fullscreen before starting your examination.
            </p>

            <button
              onClick={enableFullScreen}
              disabled={fullScreen}
            >
              {fullScreen
                ? "Fullscreen Enabled ✓"
                : "Enable Fullscreen →"}
            </button>
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
