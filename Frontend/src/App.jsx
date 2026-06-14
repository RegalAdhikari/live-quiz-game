import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import LobbyScreen from "./LobbyScreen";
import WaitingRoom from "./WaitingRoom";
import QuestionScreen from "./QuestionScreen";
import RevealScreen from "./RevealScreen";
import LeaderboardScreen from "./LeaderboardScreen";

const socket = io("http://192.168.1.92:3000");

export default function App() {
  const [screen, setScreen] = useState("lobby");
  const [lobbyId, setLobbyId] = useState("");
  const [myName, setMyName] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState("");
  const [round, setRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(5);
  const [revealData, setRevealData] = useState(null);
  const [finalPlayers, setFinalPlayers] = useState([]);
  const [lockedCount, setLockedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const myId = useRef(socket.id);

  useEffect(() => {
    myId.current = socket.id;

    socket.on("connect", () => { myId.current = socket.id; });

    socket.on("updateLobby", (data) => {
      setPlayers(data.players);
      setIsHost(data.hostId === socket.id);
      if (data.phase === "lobby") setScreen("waiting");
    });

    socket.on("error", (msg) => setError(msg));

    socket.on("gameStarted", ({ round, totalRounds }) => {
      setRound(round);
      setTotalRounds(totalRounds);
      setLockedCount(0);
      setScreen("question");
    });

    socket.on("answerLocked", ({ lockedCount, totalCount }) => {
      setLockedCount(lockedCount);
      setTotalCount(totalCount);
    });

    socket.on("answerRevealed", (data) => {
      setRevealData(data);
      setPlayers(data.players);
      setScreen("reveal");
    });

    socket.on("newRound", ({ round, totalRounds }) => {
      setRound(round);
      setTotalRounds(totalRounds);
      setLockedCount(0);
      setScreen("question");
    });

    socket.on("gameOver", ({ players }) => {
      setFinalPlayers(players);
      setScreen("leaderboard");
    });

    return () => socket.removeAllListeners();
  }, []);

  const handleHost = (lobbyId, name, rounds) => {
    setError("");
    setLobbyId(lobbyId);
    setMyName(name);
    setIsHost(true);
    setTotalRounds(rounds);
    socket.emit("createLobby", { lobbyId, name });
    setScreen("waiting");
  };

  const handleJoin = (id, name) => {
    setError("");
    setLobbyId(id);
    setMyName(name);
    setIsHost(false);
    socket.emit("joinLobby", { lobbyId: id, name });
    setScreen("waiting");
  };

  const handleLeave = () => {
    socket.emit("leaveLobby", lobbyId);
    setPlayers([]); setLobbyId(""); setMyName("");
    setIsHost(false); setScreen("lobby");
  };

  const handleStartGame = (rounds) => {
    socket.emit("startGame", { lobbyId, totalRounds: rounds });
  };

  const handleLockAnswer = (answer) => {
    socket.emit("lockAnswer", { lobbyId, answer });
  };

  const handleReveal = (correctAnswer) => {
    socket.emit("revealAnswer", { lobbyId, correctAnswer });
  };

  const handleNextRound = () => {
    socket.emit("nextRound", lobbyId);
  };

  const handlePlayAgain = () => {
    setScreen("lobby");
    setPlayers([]); setLobbyId(""); setMyName("");
  };

  return (
    <div className="min-h-screen bg-[#0f0a2e] flex items-center justify-center p-4">
      {screen === "lobby" && (
        <LobbyScreen onHost={handleHost} onJoin={handleJoin} error={error} setError={setError} />
      )}
      {screen === "waiting" && (
        <WaitingRoom lobbyId={lobbyId} isHost={isHost} players={players}
          onLeave={handleLeave} onStart={handleStartGame} myId={socket.id} />
      )}
      {screen === "question" && (
        <QuestionScreen round={round} totalRounds={totalRounds} isHost={isHost}
          onLockAnswer={handleLockAnswer} onReveal={handleReveal}
          lockedCount={lockedCount} totalCount={players.length} players={players} />
      )}
      {screen === "reveal" && revealData && (
        <RevealScreen revealData={revealData} isHost={isHost} myId={socket.id}
          onNext={handleNextRound} />
      )}
      {screen === "leaderboard" && (
        <LeaderboardScreen players={finalPlayers} myId={socket.id} onPlayAgain={handlePlayAgain} />
      )}
    </div>
  );
}