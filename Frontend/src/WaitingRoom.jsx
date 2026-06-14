import { useState, useEffect, useRef } from "react";

const AVATAR_COLORS = [
  "bg-violet-500", "bg-pink-500", "bg-yellow-400",
  "bg-teal-500", "bg-orange-500", "bg-sky-500",
  "bg-rose-500", "bg-emerald-500",
];

function getInitials(name) {
  if (!name || name.length === 0) return "?";
  return name.slice(0, 2).toUpperCase();
}

export default function WaitingRoom({ lobbyId, isHost, players, onLeave, socket }) {
  const [copied, setCopied] = useState(false);
  const prevCountRef = useRef(players.length);
  const [newJoiner, setNewJoiner] = useState(false);

  useEffect(() => {
    if (players.length > prevCountRef.current) {
      setNewJoiner(true);
      setTimeout(() => setNewJoiner(false), 600);
    }
    prevCountRef.current = players.length;
  }, [players.length]);

  const handleCopy = () => {
    navigator.clipboard.writeText(lobbyId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleStartGame = () => {
    socket.emit("startGame", lobbyId);
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col gap-4">
      {/* Header */}
      <div className="text-center pt-2">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="bg-yellow-400 text-[#0f0a2e] text-xs font-black px-2 py-0.5 rounded-full tracking-widest uppercase animate-pulse">
            LIVE
          </span>
          <span className="text-purple-400 text-xs">
            {isHost ? "You're the host" : "Waiting for host..."}
          </span>
        </div>
        <h1
          className="text-4xl font-black text-white tracking-tight"
          style={{ fontFamily: "'Fredoka One', cursive" }}
        >
          Waiting Room
        </h1>
      </div>

      {/* Game Code Card */}
      <div className="bg-[#1a1145] rounded-2xl p-4 border border-purple-900/60">
        <p className="text-purple-400 text-xs font-semibold uppercase tracking-wider text-center mb-2">
          Game Code
        </p>
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 bg-[#0f0a2e] border border-purple-800 rounded-xl py-3 px-4">
            <span className="text-white font-mono font-black text-2xl tracking-[0.3em]">
              {lobbyId}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className={`px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-violet-700 hover:bg-violet-600 text-white"
            }`}
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
        <p className="text-purple-600 text-xs text-center mt-2">
          Share this code with friends to join
        </p>
      </div>

      {/* Players List */}
      <div className="bg-[#1a1145] rounded-2xl p-4 border border-purple-900/60 flex-1">
        <div className="flex items-center justify-between mb-3">
          <p className="text-purple-300 text-sm font-semibold">
            Players
          </p>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full transition-colors duration-300 ${
              newJoiner
                ? "bg-yellow-400 text-[#0f0a2e]"
                : "bg-purple-900 text-purple-300"
            }`}
          >
            {players.length} joined
          </span>
        </div>

        {players.length === 0 ? (
          <div className="text-center py-8 text-purple-700">
            <div className="text-4xl mb-2">👾</div>
            <p className="text-sm">No players yet...</p>
          </div>
        ) : (
          <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {players.map((id, i) => (
              <li
                key={id}
                className="flex items-center gap-3 bg-[#0f0a2e]/60 rounded-xl px-3 py-2.5 animate-fade-in"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-[#0f0a2e] flex-shrink-0 ${
                    AVATAR_COLORS[i % AVATAR_COLORS.length]
                  }`}
                >
                  P{i + 1}
                </div>
                <span className="text-white text-sm font-mono truncate">
                  {i === 0 && isHost ? "You (Host)" : `Player ${i + 1}`}
                </span>
                {i === 0 && (
                  <span className="ml-auto text-yellow-400 text-xs font-bold">
                    👑
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-2 pb-4">
        {isHost && (
          <button
            onClick={handleStartGame}
            disabled={players.length < 1}
            className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 text-[#0f0a2e] font-black py-3.5 rounded-xl text-base transition-all duration-150 tracking-wide"
          >
            {players.length < 2 ? "Waiting for players..." : "Start Game →"}
          </button>
        )}
        <button
          onClick={onLeave}
          className="w-full bg-transparent border border-purple-800 hover:border-red-700 hover:text-red-400 text-purple-500 font-semibold py-3 rounded-xl text-sm transition-all duration-150 active:scale-95"
        >
          Leave Lobby
        </button>
      </div>
    </div>
  );
}
