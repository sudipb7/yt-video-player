import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Home";
import VideoPlayer from "./VideoPlayer";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/player/:videoId"
          element={<VideoPlayer />}
        />
      </Routes>
    </BrowserRouter>
  );
}
