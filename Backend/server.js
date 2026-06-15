const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// lobbies[lobbyId] = {
//   hostId: socket.id,
//   phase: "lobby" | "question" | "reveal" | "leaderboard",
//   round: 1,
//   totalRounds: N,
//   correctAnswer: null | true | false,
//   players: [ { id, name, score, answer, locked } ]
// }
const lobbies = {};

function getLobby(lobbyId) { return lobbies[lobbyId]; }

function broadcastLobby(lobbyId) {
    const lobby = getLobby(lobbyId);
    if (!lobby) return;
    io.to(lobbyId).emit("updateLobby", {
        players: lobby.players,
        phase: lobby.phase,
        round: lobby.round,
        totalRounds: lobby.totalRounds,
        hostId: lobby.hostId,
    });
}

io.on("connection", (socket) => {
    console.log("Connected: " + socket.id);

    socket.on("createLobby", ({ lobbyId, name }) => {
        if (lobbies[lobbyId]) return socket.emit("error", "Lobby already exists");
        lobbies[lobbyId] = {
            hostId: socket.id,
            phase: "lobby",
            round: 0,
            totalRounds: 0,
            correctAnswer: null,
            players: []  // host is not a player
        };
        socket.join(lobbyId);
        console.log(`Lobby created: ${lobbyId} by ${name}`);
        broadcastLobby(lobbyId);
    });

    socket.on("joinLobby", ({ lobbyId, name }) => {
        const lobby = getLobby(lobbyId);
        if (!lobby) return socket.emit("error", "Lobby not found");
        if (lobby.phase !== "lobby") return socket.emit("error", "Game already in progress");
        if (lobby.players.find(p => p.id === socket.id)) return;
        lobby.players.push({ id: socket.id, name, score: 0, answer: null, locked: false });
        socket.join(lobbyId);
        broadcastLobby(lobbyId);
    });

    socket.on("leaveLobby", (lobbyId) => {
        removePLayer(socket.id, lobbyId);
    });

    socket.on("startGame", ({ lobbyId, totalRounds }) => {
        const lobby = getLobby(lobbyId);
        if (!lobby || lobby.hostId !== socket.id) return;
        lobby.totalRounds = totalRounds;
        lobby.round = 1;
        lobby.phase = "question";
        lobby.correctAnswer = null;
        lobby.players.forEach(p => { p.answer = null; p.locked = false; });
        io.to(lobbyId).emit("gameStarted", { round: lobby.round, totalRounds: lobby.totalRounds });
        broadcastLobby(lobbyId);
    });

    socket.on("lockAnswer", ({ lobbyId, answer }) => {
        const lobby = getLobby(lobbyId);
        if (!lobby || lobby.phase !== "question") return;
        const player = lobby.players.find(p => p.id === socket.id);
        if (!player || player.locked) return;
        player.answer = answer;   // true | false
        player.locked = true;
        // Tell everyone who has locked (not their answer, just count)
        io.to(lobbyId).emit("answerLocked", {
            lockedCount: lobby.players.filter(p => p.locked).length,
            totalCount: lobby.players.length,
        });
    });

    socket.on("revealAnswer", ({ lobbyId, correctAnswer }) => {
        const lobby = getLobby(lobbyId);
        if (!lobby || lobby.hostId !== socket.id) return;
        lobby.correctAnswer = correctAnswer;
        lobby.phase = "reveal";
        // Score: +100 per correct answer
        lobby.players.forEach(p => {
            if (p.answer === correctAnswer) p.score += 100;
        });
        io.to(lobbyId).emit("answerRevealed", {
            correctAnswer,
            players: lobby.players,
            round: lobby.round,
            totalRounds: lobby.totalRounds,
        });
        broadcastLobby(lobbyId);
    });

    socket.on("nextRound", (lobbyId) => {
        const lobby = getLobby(lobbyId);
        if (!lobby || lobby.hostId !== socket.id) return;
        if (lobby.round >= lobby.totalRounds) {
            // Final leaderboard
            lobby.phase = "leaderboard";
            const sorted = [...lobby.players].sort((a, b) => b.score - a.score);
            io.to(lobbyId).emit("gameOver", { players: sorted });
            broadcastLobby(lobbyId);
        } else {
            lobby.round += 1;
            lobby.phase = "question";
            lobby.correctAnswer = null;
            lobby.players.forEach(p => { p.answer = null; p.locked = false; });
            io.to(lobbyId).emit("newRound", { round: lobby.round, totalRounds: lobby.totalRounds });
            broadcastLobby(lobbyId);
        }
    });

    socket.on("disconnect", () => {
        for (const lobbyId in lobbies) {
            removePLayer(socket.id, lobbyId);
        }
    });

    function removePLayer(socketId, lobbyId) {
        const lobby = getLobby(lobbyId);
        if (!lobby) return;
        // If host disconnects, close the lobby entirely
        if (lobby.hostId === socketId) {
            io.to(lobbyId).emit("error", "Host left the game. Lobby closed.");
            delete lobbies[lobbyId];
            return;
        }
        lobby.players = lobby.players.filter(p => p.id !== socketId);
        const socket2 = io.sockets.sockets.get(socketId);
        if (socket2) socket2.leave(lobbyId);
        if (lobby.players.length === 0) {
            delete lobbies[lobbyId];
        } else {
            broadcastLobby(lobbyId);
        }
    }
});

server.listen(3000, () => console.log("Server running on port 3000"));