const COLORS = ["bg-violet-500","bg-pink-500","bg-yellow-400","bg-teal-500","bg-orange-500","bg-sky-500","bg-rose-500","bg-emerald-500"];
const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardScreen({ players, myId, onPlayAgain }) {
  const top3 = players.slice(0, 3);
  const rest = players.slice(3);

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col gap-4">
      <div className="text-center pt-2">
        <div className="text-5xl mb-1">🏆</div>
        <h1 className="text-4xl font-black text-white" style={{ fontFamily: "'Fredoka One', cursive" }}>
          Final Results
        </h1>
        <p className="text-purple-400 text-sm mt-1">Game over! Here's how everyone did.</p>
      </div>

      {/* Podium */}
      {top3.length > 0 && (
        <div className="bg-[#1a1145] rounded-2xl p-5 border border-purple-900/60">
          <div className="flex items-end justify-center gap-3">
            {/* 2nd */}
            {top3[1] && (
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-black text-[#0f0a2e] ${COLORS[1]}`}>
                  {top3[1].name.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-white text-xs font-semibold text-center truncate w-full text-center">{top3[1].name}</span>
                <span className="text-yellow-400 font-black">{top3[1].score}</span>
                <div className="bg-violet-700/60 w-full h-16 rounded-t-xl flex items-center justify-center text-2xl">🥈</div>
              </div>
            )}
            {/* 1st */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="text-2xl animate-bounce">👑</div>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-base font-black text-[#0f0a2e] ${COLORS[0]} ring-4 ring-yellow-400`}>
                {top3[0]?.name.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-white text-xs font-semibold truncate w-full text-center">{top3[0]?.name}</span>
              <span className="text-yellow-400 font-black text-lg">{top3[0]?.score}</span>
              <div className="bg-yellow-500/30 w-full h-24 rounded-t-xl flex items-center justify-center text-2xl">🥇</div>
            </div>
            {/* 3rd */}
            {top3[2] && (
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-black text-[#0f0a2e] ${COLORS[2]}`}>
                  {top3[2].name.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-white text-xs font-semibold truncate w-full text-center">{top3[2].name}</span>
                <span className="text-yellow-400 font-black">{top3[2].score}</span>
                <div className="bg-orange-700/40 w-full h-10 rounded-t-xl flex items-center justify-center text-2xl">🥉</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rest of players */}
      {rest.length > 0 && (
        <div className="bg-[#1a1145] rounded-2xl p-4 border border-purple-900/60">
          <ul className="space-y-2">
            {rest.map((p, i) => (
              <li key={p.id} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${p.id === myId ? "bg-violet-900/40 border border-violet-700" : "bg-[#0f0a2e]/60"}`}>
                <span className="text-purple-600 text-sm font-bold w-5 text-center">{i + 4}</span>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-[#0f0a2e] ${COLORS[(i + 3) % COLORS.length]}`}>
                  {p.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-white text-sm font-semibold flex-1 truncate">{p.name}</span>
                {p.id === myId && <span className="text-purple-400 text-xs">You</span>}
                <span className="text-yellow-400 font-black">{p.score}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={onPlayAgain}
        className="w-full bg-violet-600 hover:bg-violet-500 active:scale-95 text-white font-black py-3.5 rounded-xl text-base transition-all mb-2">
        🎮 Play Again
      </button>
    </div>
  );
}
