import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import socket from "./services/socket";

import Landing from "./pages/Landing/Landing";
import CreateRoom from "./pages/CreateRoom/CreateRoom";
import Room from "./pages/Room/Room";
import JoinRoom from "./pages/JoinRoom/JoinRoom";

function App() {
  useEffect(() => {
    // 🔑 CONNECT SOCKET ONCE
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/create" element={<CreateRoom />} />
        <Route path="/join" element={<JoinRoom />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
