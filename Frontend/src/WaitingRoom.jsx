import { useState, useEffect, useRef } from "react";

const COLORS = ["bg-violet-500","bg-pink-500","bg-yellow-400","bg-teal-500","bg-orange-500","bg-sky-500","bg-rose-500","bg-emerald-500"];

export default function WaitingRoom({ lobbyId, isHost, players, onLeave, onStart, myId }) {
  const [copied, setCopied] = useState(false);
  const [rounds, setRounds] = useState(5);
  const prevLen = useRef(players.length);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (players.length > prevLen.current) { setPulse(true); setTimeout(() => setPulse(false), 600); }
    prevLen.current = players.length;
  }, [players.length]);

  const handleCopy = () => {
    navigator.clipboard.writeText(lobbyId).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col gap-4">
      <div className="text-center pt-2">
        <span className="bg-yellow-400 text-[#0f0a2e] text-xs font-black px-2 py-0.5 rounded-full tracking-widest uppercase animate-pulse">LIVE</span>
        <h1 className="text-4xl font-black text-white tracking-tight mt-1" style={{ fontFamily: "'Fredoka One', cursive" }}>
          Waiting Room
        </h1>
        <p className="text-purple-400 text-sm mt-0.5">{isHost ? "You're the host 👑" : "Waiting for host to start..."}</p>
      </div>

      {/* Code */}
      <div className="bg-[#1a1145] rounded-2xl p-4 border border-purple-900/60">
        <p className="text-purple-400 text-xs font-semibold uppercase tracking-wider text-center mb-2">Game Code</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-[#0f0a2e] border border-purple-800 rounded-xl py-3 px-4">
            <span className="text-white font-mono font-black text-2xl tracking-[0.3em]">{lobbyId}</span>
          </div>
          <button onClick={handleCopy}
            className={`px-4 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${copied ? "bg-emerald-600 text-white" : "bg-violet-700 hover:bg-violet-600 text-white"}`}>
            {copied ? "✓" : "Copy"}
          </button>
        </div>
      </div>

      {/* Players */}
      <div className="bg-[#1a1145] rounded-2xl p-4 border border-purple-900/60">
        <div className="flex items-center justify-between mb-3">
          <p className="text-purple-300 text-sm font-semibold">Players</p>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full transition-colors duration-300 ${pulse ? "bg-yellow-400 text-[#0f0a2e]" : "bg-purple-900 text-purple-300"}`}>
            {players.length} joined
          </span>
        </div>
        {players.length === 0 ? (
          <div className="text-center py-8 text-purple-700"><div className="text-4xl mb-2">👾</div><p className="text-sm">Share the code — waiting for players!</p></div>
        ) : (
          <ul className="space-y-2 max-h-56 overflow-y-auto">
            {players.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3 bg-[#0f0a2e]/60 rounded-xl px-3 py-2.5 animate-fade-in">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-[#0f0a2e] flex-shrink-0 ${COLORS[i % COLORS.length]}`}>
                  {p.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-white text-sm font-semibold truncate flex-1">{p.name}</span>
                {p.id === myId && <span className="text-purple-400 text-xs">You</span>}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Start controls (host only) */}
      {isHost && (
        <div className="bg-[#1a1145] rounded-2xl p-4 border border-purple-900/60 space-y-3">
          <p className="text-purple-300 text-xs font-semibold uppercase tracking-wider">Rounds</p>
          <div className="flex gap-2">
            {[3, 5, 7, 10].map(n => (
              <button key={n} onClick={() => setRounds(n)}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${rounds === n ? "bg-yellow-400 text-[#0f0a2e]" : "bg-[#0f0a2e] border border-purple-800 text-purple-300"}`}>
                {n}
              </button>
            ))}
          </div>
          <button onClick={() => onStart(rounds)} disabled={players.length < 1}
            className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 active:scale-95 text-[#0f0a2e] font-black py-3.5 rounded-xl text-base transition-all">
            {players.length < 2 ? "Waiting for players..." : `Start Game (${rounds} rounds) →`}
          </button>
        </div>
      )}

      <button onClick={onLeave}
        className="w-full bg-transparent border border-purple-800 hover:border-red-700 hover:text-red-400 text-purple-500 font-semibold py-3 rounded-xl text-sm transition-all active:scale-95 mb-2">
        Leave Lobby
      </button>
    </div>
  );
}