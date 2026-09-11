import {
  Route,
  Routes,
} from "react-router-dom";

import {
  Navbar,
} from "./components/Navbar";

import {
  HomePage,
} from "./pages/HomePage";

import {
  ProblemPage,
} from "./pages/ProblemPage";

import {
  WorkspacePage,
} from "./pages/WorkspacePage";

import {
  ReviewPage,
} from "./pages/ReviewPage";

import {
  EvaluationPage,
} from "./pages/EvaluationPage";

import {
  ResultsPage,
} from "./pages/ResultsPage";

import {
  HistoryPage,
} from "./pages/HistoryPage";

function App() {
  return (
    <div className="app">
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <HomePage />
          }
        />

        <Route
          path="/problems/:slug"
          element={
            <ProblemPage />
          }
        />

        <Route
          path="/workspace/:slug/:attemptId"
          element={
            <WorkspacePage />
          }
        />

        <Route
          path="/workspace/:slug/:attemptId/review"
          element={
            <ReviewPage />
          }
        />

        <Route
          path="/workspace/:slug/:attemptId/evaluating"
          element={
            <EvaluationPage />
          }
        />

        <Route
          path="/workspace/:slug/:attemptId/results"
          element={
            <ResultsPage />
          }
        />

        <Route
          path="/history"
          element={
            <HistoryPage />
          }
        />
      </Routes>
    </div>
  );
}

export default App;