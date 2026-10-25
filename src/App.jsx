
import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [testStarted, setTestStarted] = useState(false);

  async function getCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
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

    document.addEventListener("fullscreenchange", handleFullScreenChange);

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

  async function startTest() {
    if (!cameraOn || !fullScreen) {
      alert("Enable your camera and fullscreen first.");
      return;
    }

    try {
      if (window.electronAPI) {
        await window.electronAPI.startTest();
      }

      setTestStarted(true);
    } catch (error) {
      console.log(error);
      alert("Unable to start the test.");
    }
  }

  if (testStarted) {
    return (
      <div className="app test-screen">
        <h1>Newton Athena</h1>
        <h2>Your test has started!</h2>
        <p>Your camera is active. Questions will appear here next.</p>
      </div>
    );
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
              <p>Complete the setup before starting your test.</p>
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
            <p>Camera access is required for your test.</p>

            {!cameraOn && (
              <button onClick={getCamera}>
                Get Camera Access →
              </button>
            )}
          </div>

          <div className="fullscreen-section">
            <h3>Fullscreen Setup</h3>
            <p>
              {fullScreen
                ? "Fullscreen is enabled."
                : "Enter fullscreen before starting your test."}
            </p>

            <button
              onClick={enableFullScreen}
              disabled={fullScreen}
            >
              {fullScreen ? "Fullscreen Enabled ✓" : "Enable Fullscreen →"}
            </button>
          </div>

          <div className="start-section">
            <button
              className="start-button"
              onClick={startTest}
              disabled={!cameraOn || !fullScreen}
            >
              Start Test →
            </button>

            {(!cameraOn || !fullScreen) && (
              <p>Enable camera and fullscreen to continue.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
