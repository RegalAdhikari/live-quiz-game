import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import LobbyScreen from "./LobbyScreen";
import WaitingRoom from "./WaitingRoom";

const socket = io("http://localhost:3000",);

export default function App() {
  const [screen, setScreen] = useState("lobby"); // "lobby" | "waiting"
  const [lobbyId, setLobbyId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    socket.on("updateLobby", (lobby) => {
      setPlayers(lobby.players);
    });

    socket.on("error", (msg) => {
      setError(msg);
    });

    return () => {
      socket.off("updateLobby");
      socket.off("error");
    };
  }, []);

  const handleHost = (generatedId) => {
    setError("");
    setLobbyId(generatedId);
    setIsHost(true);
    socket.emit("createLobby", generatedId);
    setScreen("waiting");
  };

  const handleJoin = (id, name) => {
    setError("");
    setLobbyId(id);
    setPlayerName(name);
    setIsHost(false);
    socket.emit("joinLobby", id);
    setScreen("waiting");
  };

  const handleLeave = () => {
    socket.emit("leaveLobby", lobbyId);
    setPlayers([]);
    setLobbyId("");
    setPlayerName("");
    setIsHost(false);
    setScreen("lobby");
  };

  return (
    <div className="min-h-screen bg-[#0f0a2e] flex items-center justify-center p-4">
      {screen === "lobby" ? (
        <LobbyScreen onHost={handleHost} onJoin={handleJoin} error={error} setError={setError} />
      ) : (
        <WaitingRoom
          lobbyId={lobbyId}
          isHost={isHost}
          players={players}
          onLeave={handleLeave}
          socket={socket}
        />
      )}
    </div>
  );
}