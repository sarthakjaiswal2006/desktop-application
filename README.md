# Newton Athena

**A Desktop-Based Examination Application**

Newton Athena is a desktop examination application built using React, Vite, and Electron. It is designed to provide a simple, focused environment for conducting multiple-choice assessments.

## Features

- **Camera Access:** Allow users to enable their camera before starting an examination.
- **Fullscreen Mode:** Request fullscreen mode for a focused test-taking experience.
- **MCQ Assessment:** Present five multiple-choice questions, one at a time.
- **Answer Selection:** Allow users to select and review their answers.
- **Automatic Scoring:** Calculate the final score based on correct answers.
- **Results Screen:** Display the score out of five and the overall percentage.

*Note: These are the planned features for the initial version and will be implemented incrementally.*

## Tech Stack

| Technology | Purpose |
|---|---|
| React | User interface |
| Vite | Development server and build tool |
| Electron | Desktop application framework |
| JavaScript | Application logic |
| CSS | Styling and layout |
| Node.js and npm | Runtime and package management |

## Project Structure

```text
desktopapp/
├── electron/
│   ├── main.cjs
│   └── preload.cjs
│
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── App.css
│   └── index.css
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
└── README.md
```

### File Responsibilities

- `electron/main.cjs` — Creates and manages the desktop application window.
- `electron/preload.cjs` — Provides a secure bridge between Electron and the React interface when required.
- `src/App.jsx` — Contains the main UI and examination workflow.
- `src/main.jsx` — Mounts the React application.
- `src/App.css` — Styles the main application components.
- `src/index.css` — Defines global styles.
- `index.html` — HTML entry point for Vite.
- `vite.config.js` — Configures the Vite development and build process.
- `package.json` — Defines project dependencies and scripts.

## Prerequisites

Install the following before running the project:

- Node.js (LTS recommended)
- npm
- Visual Studio Code or another code editor

## Installation

Clone the repository or open the existing project directory.

Install the dependencies:

```bash
npm install
```

Ensure Electron and the required development tools are installed:

```bash
npm install --save-dev electron concurrently wait-on
```

## Running the Application

Start the React development server:

```bash
npm run dev
```

Once Electron has been configured, start the desktop application using:

```bash
npm start
```

The exact scripts required for Electron must be configured in `package.json` before the desktop application can launch through `npm start`.

## Production Build

Build the React frontend:

```bash
npm run build
```

This generates the production frontend files in the `dist/` directory.

Packaging the application into an installer, such as a macOS DMG or Windows executable, will require an additional packaging tool and configuration.

## Development Roadmap

- [ ] Set up the Electron desktop window.
- [ ] Create the Newton Athena welcome screen.
- [ ] Implement camera permission and live preview.
- [ ] Implement fullscreen mode.
- [ ] Build the five-question MCQ assessment.
- [ ] Add answer selection and navigation.
- [ ] Calculate the final score.
- [ ] Display the results screen.
- [ ] Test the application on supported desktop platforms.
- [ ] Package the application for distribution.

## Security and Privacy

Camera access must be explicitly requested from the user. Camera streams should be stopped when no longer needed.

Electron should use `contextIsolation: true` and `nodeIntegration: false`. Fullscreen mode and camera access alone do not guarantee secure or cheat-proof examinations.

## License

This project is currently under development. Add a license before distributing it publicly.

---

**Newton Athena — Assessment Portal**  
Built with React, Vite, and Electron.
