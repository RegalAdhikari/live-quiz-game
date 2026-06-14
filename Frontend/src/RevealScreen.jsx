const COLORS = ["bg-violet-500","bg-pink-500","bg-yellow-400","bg-teal-500","bg-orange-500","bg-sky-500","bg-rose-500","bg-emerald-500"];

export default function RevealScreen({ revealData, isHost, myId, onNext }) {
  const { correctAnswer, players, round, totalRounds } = revealData;
  const myPlayer = players.find(p => p.id === myId);
  const iGotIt = myPlayer?.answer === correctAnswer;
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col gap-4">
      {/* Answer reveal */}
      <div className={`rounded-2xl p-6 text-center border-2 ${correctAnswer ? "bg-emerald-900/30 border-emerald-600" : "bg-rose-900/30 border-rose-600"}`}>
        <div className="text-5xl mb-2">{correctAnswer ? "✅" : "❌"}</div>
        <h2 className="text-white font-black text-2xl" style={{ fontFamily: "'Fredoka One', cursive" }}>
          The answer was <span className={correctAnswer ? "text-emerald-400" : "text-rose-400"}>{correctAnswer ? "TRUE" : "FALSE"}</span>
        </h2>
        {!isHost && (
          <div className={`mt-3 inline-block px-4 py-1.5 rounded-full text-sm font-bold ${iGotIt ? "bg-emerald-600 text-white" : "bg-rose-900 text-rose-300"}`}>
            {iGotIt ? "🎉 You got it! +100 pts" : "😅 Better luck next round!"}
          </div>
        )}
      </div>

      {/* Leaderboard after reveal */}
      <div className="bg-[#1a1145] rounded-2xl p-4 border border-purple-900/60">
        <p className="text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">Standings after Round {round}</p>
        <ul className="space-y-2">
          {sorted.map((p, i) => {
            const gotIt = p.answer === correctAnswer;
            return (
              <li key={p.id} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${p.id === myId ? "bg-violet-900/40 border border-violet-700" : "bg-[#0f0a2e]/60"}`}>
                <span className={`text-sm font-black w-5 text-center ${i === 0 ? "text-yellow-400" : "text-purple-600"}`}>
                  {i === 0 ? "👑" : `${i + 1}`}
                </span>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-[#0f0a2e] flex-shrink-0 ${COLORS[i % COLORS.length]}`}>
                  {p.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-white text-sm font-semibold flex-1 truncate">{p.name}</span>
                <span className={`text-xs font-bold ${gotIt ? "text-emerald-400" : "text-rose-400"}`}>
                  {gotIt ? "+100" : "+0"}
                </span>
                <span className="text-yellow-400 text-sm font-black">{p.score}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {isHost && (
        <button onClick={onNext}
          className="w-full bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-[#0f0a2e] font-black py-3.5 rounded-xl text-base transition-all mb-2">
          {round >= totalRounds ? "See Final Results 🏆" : `Next Round (${round + 1}/${totalRounds}) →`}
        </button>
      )}
      {!isHost && (
        <div className="bg-[#1a1145] rounded-2xl p-4 border border-purple-900/60 text-center">
          <div className="animate-pulse text-purple-400 text-sm">⏳ Waiting for host to continue...</div>
        </div>
      )}
    </div>
  );
}
