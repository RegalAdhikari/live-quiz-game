import { useState } from "react";

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function LobbyScreen({ onHost, onJoin, error, setError }) {
  const [tab, setTab] = useState("host"); // "host" | "join"
  const [joinId, setJoinId] = useState("");
  const [joinName, setJoinName] = useState("");

  const handleHost = () => {
    const code = generateCode();
    onHost(code);
  };

  const handleJoin = () => {
    if (!joinId.trim()) return setError("Enter a game code.");
    if (!joinName.trim()) return setError("Enter your name.");
    onJoin(joinId.trim().toUpperCase(), joinName.trim());
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col gap-6">
      {/* Logo / Header */}
      <div className="text-center space-y-1 pt-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="bg-yellow-400 text-[#0f0a2e] text-xs font-black px-2 py-0.5 rounded-full tracking-widest uppercase animate-pulse">
            LIVE
          </span>
        </div>
        <h1
          className="text-5xl font-black text-white tracking-tight leading-none"
          style={{ fontFamily: "'Fredoka One', cursive" }}
        >
          QuizBlitz
        </h1>
        <p className="text-purple-300 text-sm">Real-time multiplayer trivia</p>
      </div>

      {/* Tab switcher */}
      <div className="bg-[#1a1145] rounded-2xl p-1 flex gap-1">
        <button
          onClick={() => { setTab("host"); setError(""); }}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            tab === "host"
              ? "bg-violet-600 text-white shadow-lg"
              : "text-purple-400 hover:text-white"
          }`}
        >
          🎮 Host a Game
        </button>
        <button
          onClick={() => { setTab("join"); setError(""); }}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            tab === "join"
              ? "bg-violet-600 text-white shadow-lg"
              : "text-purple-400 hover:text-white"
          }`}
        >
          🚀 Join a Game
        </button>
      </div>

      {/* Panel */}
      <div className="bg-[#1a1145] rounded-2xl p-5 space-y-4 border border-purple-900/60">
        {tab === "host" ? (
          <>
            <div className="text-center space-y-2 py-3">
              <div className="text-6xl">🎯</div>
              <h2 className="text-white font-bold text-lg">Start a new game</h2>
              <p className="text-purple-300 text-sm leading-relaxed">
                A unique game code will be generated.<br />Share it with your friends to join.
              </p>
            </div>
            <button
              onClick={handleHost}
              className="w-full bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-[#0f0a2e] font-black py-3.5 rounded-xl text-base transition-all duration-150 tracking-wide"
            >
              Create Lobby →
            </button>
          </>
        ) : (
          <>
            <div className="space-y-3">
              <div>
                <label className="text-purple-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. QuizWizard99"
                  value={joinName}
                  onChange={(e) => setJoinName(e.target.value)}
                  maxLength={20}
                  className="w-full bg-[#0f0a2e] border border-purple-800 focus:border-violet-500 text-white placeholder-purple-700 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-purple-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                  Game Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. AB12CD"
                  value={joinId}
                  onChange={(e) => setJoinId(e.target.value.toUpperCase())}
                  maxLength={8}
                  className="w-full bg-[#0f0a2e] border border-purple-800 focus:border-violet-500 text-white placeholder-purple-700 rounded-xl px-4 py-3 text-sm font-mono tracking-widest uppercase outline-none transition-colors"
                />
              </div>
            </div>
            <button
              onClick={handleJoin}
              className="w-full bg-violet-600 hover:bg-violet-500 active:scale-95 text-white font-black py-3.5 rounded-xl text-base transition-all duration-150 tracking-wide"
            >
              Join Game →
            </button>
          </>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-900/40 border border-red-700/50 text-red-300 text-sm px-4 py-3 rounded-xl">
            ⚠️ {error}
          </div>
        )}
      </div>

      <p className="text-center text-purple-800 text-xs pb-2">
        Up to 20 players per game
      </p>
    </div>
  );
}
