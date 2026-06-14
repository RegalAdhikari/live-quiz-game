import { useState } from "react";

export default function QuestionScreen({ round, totalRounds, isHost, onLockAnswer, onReveal, lockedCount, totalCount, players }) {
  const [selected, setSelected] = useState(null); // true | false | null
  const [locked, setLocked] = useState(false);
  const [hostAnswer, setHostAnswer] = useState(null); // what host will reveal

  const handleSelect = (val) => {
    if (locked) return;
    setSelected(val);
  };

  const handleLock = () => {
    if (selected === null || locked) return;
    setLocked(true);
    onLockAnswer(selected);
  };

  const handleReveal = () => {
    if (hostAnswer === null) return;
    onReveal(hostAnswer);
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col gap-5">
      {/* Round badge */}
      <div className="text-center pt-2">
        <div className="inline-flex items-center gap-2 bg-[#1a1145] border border-purple-800 rounded-full px-4 py-1.5 mb-3">
          <span className="text-purple-300 text-sm font-semibold">Round</span>
          <span className="text-yellow-400 font-black text-lg">{round}</span>
          <span className="text-purple-600 text-sm">/ {totalRounds}</span>
        </div>
        {/* Round progress bar */}
        <div className="w-full bg-purple-900/40 rounded-full h-1.5">
          <div className="bg-yellow-400 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${(round / totalRounds) * 100}%` }} />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-[#1a1145] rounded-2xl p-6 border border-purple-900/60 text-center space-y-2">
        <div className="text-5xl mb-2">🤔</div>
        <h2 className="text-white font-black text-xl" style={{ fontFamily: "'Fredoka One', cursive" }}>
          True or False?
        </h2>
        <p className="text-purple-300 text-sm">
          {isHost ? "Wait for players to answer, then reveal the correct answer." : "Choose your answer and lock it in!"}
        </p>
      </div>

      {/* Player: T/F buttons */}
      {!isHost && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleSelect(true)} disabled={locked}
              className={`py-8 rounded-2xl font-black text-2xl transition-all duration-150 active:scale-95 border-2 ${
                selected === true
                  ? "bg-emerald-500 border-emerald-400 text-white scale-95 shadow-lg shadow-emerald-900/40"
                  : "bg-[#1a1145] border-emerald-900 text-emerald-400 hover:border-emerald-600"
              } ${locked ? "opacity-60 cursor-not-allowed" : ""}`}>
              ✅<br /><span className="text-lg">TRUE</span>
            </button>
            <button onClick={() => handleSelect(false)} disabled={locked}
              className={`py-8 rounded-2xl font-black text-2xl transition-all duration-150 active:scale-95 border-2 ${
                selected === false
                  ? "bg-rose-500 border-rose-400 text-white scale-95 shadow-lg shadow-rose-900/40"
                  : "bg-[#1a1145] border-rose-900 text-rose-400 hover:border-rose-600"
              } ${locked ? "opacity-60 cursor-not-allowed" : ""}`}>
              ❌<br /><span className="text-lg">FALSE</span>
            </button>
          </div>
          <button onClick={handleLock} disabled={selected === null || locked}
            className={`w-full font-black py-3.5 rounded-xl text-base transition-all duration-150 active:scale-95 ${
              locked
                ? "bg-purple-900/60 text-purple-500 cursor-not-allowed"
                : selected !== null
                  ? "bg-yellow-400 text-[#0f0a2e] hover:bg-yellow-300"
                  : "bg-[#1a1145] text-purple-700 border border-purple-900 cursor-not-allowed"
            }`}>
            {locked ? "✓ Answer Locked In!" : "Lock In Answer →"}
          </button>
        </div>
      )}

      {/* Host: reveal panel */}
      {isHost && (
        <div className="bg-[#1a1145] rounded-2xl p-5 border border-purple-900/60 space-y-4">
          <div className="text-center">
            <p className="text-purple-300 text-sm font-semibold mb-1">Responses</p>
            <div className="flex items-center justify-center gap-2">
              <span className={`text-3xl font-black ${lockedCount === totalCount ? "text-yellow-400" : "text-white"}`}>
                {lockedCount}
              </span>
              <span className="text-purple-600 text-xl">/</span>
              <span className="text-white text-3xl font-black">{totalCount}</span>
            </div>
            <p className="text-purple-500 text-xs mt-1">players locked in</p>
          </div>

          {/* Mini player list */}
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {players.map((p, i) => (
              <div key={p.id} className="flex items-center gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${p.locked ? "bg-emerald-400" : "bg-purple-800"}`} />
                <span className={p.locked ? "text-white" : "text-purple-600"}>{p.name}</span>
                {p.locked && <span className="ml-auto text-emerald-500">✓</span>}
              </div>
            ))}
          </div>

          <div>
            <p className="text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">Correct Answer</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button onClick={() => setHostAnswer(true)}
                className={`py-3 rounded-xl font-bold text-sm transition-all border-2 ${hostAnswer === true ? "bg-emerald-600 border-emerald-500 text-white" : "bg-[#0f0a2e] border-emerald-900 text-emerald-400"}`}>
                ✅ TRUE
              </button>
              <button onClick={() => setHostAnswer(false)}
                className={`py-3 rounded-xl font-bold text-sm transition-all border-2 ${hostAnswer === false ? "bg-rose-600 border-rose-500 text-white" : "bg-[#0f0a2e] border-rose-900 text-rose-400"}`}>
                ❌ FALSE
              </button>
            </div>
            <button onClick={handleReveal} disabled={hostAnswer === null}
              className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 active:scale-95 text-[#0f0a2e] font-black py-3.5 rounded-xl text-sm transition-all">
              Reveal Answer & Score →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
