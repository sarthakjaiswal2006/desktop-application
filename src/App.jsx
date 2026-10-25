
import { useEffect, useRef, useState } from "react";
import "./App.css";

const questions = [
  {
    question: "Which keyword declares a variable that can be reassigned?",
    options: ["const", "let", "fixed", "static"],
    answer: 1,
  },
  {
    question: "Which method adds an item to the end of an array?",
    options: ["pop()", "shift()", "push()", "unshift()"],
    answer: 2,
  },
  {
    question: "What is the output of typeof 'Hello'?",
    options: ["text", "string", "char", "object"],
    answer: 1,
  },
  {
    question: "Which operator checks both value and type?",
    options: ["==", "=", "===", "!="],
    answer: 2,
  },
  {
    question: "Which method converts JSON text into a JavaScript value?",
    options: [
      "JSON.stringify()",
      "JSON.parse()",
      "JSON.convert()",
      "JSON.read()",
    ],
    answer: 1,
  },
  {
    question: "Which array method creates a new array by transforming each item?",
    options: ["forEach()", "map()", "find()", "some()"],
    answer: 1,
  },
  {
    question: "What does NaN stand for?",
    options: [
      "No assigned Number",
      "Not a Number",
      "New and Null",
      "Negative as Number",
    ],
    answer: 1,
  },
  {
    question: "Which symbol is used for an arrow function?",
    options: ["->", "=>", "::", "<-"],
    answer: 1,
  },
  {
    question: "Which method selects an HTML element by its ID?",
    options: [
      "document.querySelectorAll()",
      "document.getElementById()",
      "document.getElementsByClassName()",
      "document.createElement()",
    ],
    answer: 1,
  },
  {
    question: "Which value represents an intentional absence of a value?",
    options: ["undefined", "false", "null", "0"],
    answer: 2,
  },
];

function App() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [testFinished, setTestFinished] = useState(false);

  // Turn on the camera.
  async function getCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraOn(true);
    } catch (error) {
      console.error("Camera error:", error);
      alert("Unable to access the camera. Please allow camera permission.");
    }
  }

  // Enable fullscreen.
  async function enableFullScreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
      alert("Unable to enable fullscreen. Please try again.");
    }
  }

  // Track fullscreen status and clean up the camera.
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

  // Start the exam.

async function startTest() {
  if (!cameraOn || !fullScreen) {
    alert("Please enable the camera and fullscreen before starting.");
    return;
  }

  try {
    // Remove browser fullscreen before switching to Electron kiosk mode.
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }

    if (window.electronAPI?.startTest) {
      await window.electronAPI.startTest();
    }

    setTestStarted(true);
  } catch (error) {
    console.error("Could not start the test:", error);
    alert("Unable to start the test. Please try again.");
  }
}


  // Save the selected answer.
  function selectAnswer(optionIndex) {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: optionIndex,
    });
  }

  // Move to the next question.
  function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishTest();
    }
  }

  // Calculate the final score.
  function calculateScore() {
    let score = 0;

    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.answer) {
        score++;
      }
    });

    return score;
  }

  // Show the result screen.
  function finishTest() {
    setTestFinished(true);
  }

  // Close the app when End Test is pressed.
  async function endTest() {
    const confirmed = window.confirm(
      "Are you sure you want to end the test and close Newton Athena?"
    );

    if (!confirmed) return;

    try {
      if (window.electronAPI?.endTest) {
        await window.electronAPI.endTest();
      } else {
        window.close();
      }
    } catch (error) {
      console.error("Unable to close the application:", error);
      alert("Unable to close the application.");
    }
  }

  // Calculate result values.
  const score = calculateScore();
  const answeredCount = Object.keys(selectedAnswers).length;
  const incorrectOrSkipped = questions.length - score;

  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand">
          <div className="brand-logo">N</div>
          <span>Newton Athena</span>
        </div>

        {testStarted && !testFinished && (
          <span className="nav-label">Assessment in progress</span>
        )}
      </nav>

      <main className="main-content">
        {!testStarted ? (
          <section className="camera-card">
            <h2 className="card-heading">Assessment Setup</h2>

            <p className="setup-description">
              Please enable your camera and fullscreen before starting.
            </p>

            <div className="video-container">
              <video
                ref={videoRef}
                className={`video ${cameraOn ? "active-video" : ""}`}
                autoPlay
                muted
                playsInline
              />

              {!cameraOn && (
                <div className="video-placeholder">
                  <div className="camera-icon">📷</div>
                  <p>Camera preview will appear here</p>
                </div>
              )}
            </div>

            <div className="card-footer">
              <div className="status">
                <span className={`dot ${cameraOn ? "green" : ""}`}></span>
                Camera: {cameraOn ? "Enabled" : "Not enabled"}
              </div>

              <button
                className="start-button"
                onClick={getCamera}
                disabled={cameraOn}
              >
                {cameraOn ? "Camera Enabled" : "Enable Camera"}
              </button>
            </div>

            <div className="fullscreen-section">
              <div>
                <h3>Fullscreen Mode</h3>
                <p>
                  {fullScreen
                    ? "Fullscreen is enabled."
                    : "Enable fullscreen for your assessment."}
                </p>
              </div>

              <button
                className="start-button"
                onClick={enableFullScreen}
                disabled={fullScreen}
              >
                {fullScreen ? "Fullscreen Enabled" : "Enable Fullscreen"}
              </button>
            </div>

            <div className="start-section">
              <button
                className="start-button"
                onClick={startTest}
                disabled={!cameraOn || !fullScreen}
              >
                Start Test
              </button>
            </div>
          </section>
        ) : testFinished ? (
          <section className="result-card">
            <h2>Assessment Completed!</h2>

            <p className="result-description">
              Here is your final result.
            </p>

            <div className="score">
              {score} <span>/ {questions.length}</span>
            </div>

            <h3>{score * 10}% Score</h3>

            <div className="result-details">
              <p>
                <strong>Correct answers:</strong> {score}
              </p>
              <p>
                <strong>Incorrect or skipped:</strong> {incorrectOrSkipped}
              </p>
              <p>
                <strong>Questions answered:</strong> {answeredCount}
              </p>
            </div>

            <button className="end-test-button" onClick={endTest}>
              Close Newton Athena
            </button>
          </section>
        ) : (
          <section className="camera-card question-card">
            <div className="question-progress">
              <span>
                Question {currentQuestion + 1} of {questions.length}
              </span>

              <span>
                {Math.round(
                  ((currentQuestion + 1) / questions.length) * 100
                )}
                %
              </span>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${
                    ((currentQuestion + 1) / questions.length) * 100
                  }%`,
                }}
              ></div>
            </div>

            <h2 className="question-title">
              {questions[currentQuestion].question}
            </h2>

            <div className="options-list">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className={`option ${
                    selectedAnswers[currentQuestion] === index
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => selectAnswer(index)}
                >
                  <span className="option-letter">
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span>{option}</span>
                </button>
              ))}
            </div>

            <div className="question-footer">
              <button className="end-test-button" onClick={endTest}>
                End Test
              </button>

              <button className="next-button" onClick={nextQuestion}>
                {currentQuestion === questions.length - 1
                  ? "Submit Test"
                  : "Next Question"}
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
