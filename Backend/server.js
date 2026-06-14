const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
        methods: ["GET", "POST"]
    }
});
const lobbies = {};

io.on("connection", (socket) => {
    console.log("Connection Established: " + socket.io)

    // Create Lobby
    socket.on("createLobby", (lobbyId) => {
        if (lobbies[lobbyId]) return socket.emit("error", "Lobby already exists");
        lobbies[lobbyId] = { players: [] };
        socket.join(lobbyId);
        console.log("Lobby Created " + lobbyId);
        lobbies[lobbyId].players.push(socket.id);

        io.to(lobbyId).emit("updateLobby", lobbies[lobbyId]);

    });

    // Joining Lobby
    socket.on("joinLobby", (lobbyId) => {
        if (!lobbies[lobbyId]) return;
        if (lobbies[lobbyId].players.includes(socket.id)) return; // add this
        socket.join(lobbyId);
        lobbies[lobbyId].players.push(socket.id);
        io.to(lobbyId).emit("updateLobby", lobbies[lobbyId]);
    });

    // Leaving the lobby
    socket.on("leaveLobby", (lobbyId) => {
        if (!lobbies[lobbyId]) return;
        lobbies[lobbyId].players = lobbies[lobbyId].players.filter(id => id !== socket.id);
        socket.leave(lobbyId);
        if (lobbies[lobbyId].players.length === 0) delete lobbies[lobbyId];
        else io.to(lobbyId).emit("updateLobby", lobbies[lobbyId]);
    });

    // Disconnecting the lobby
    socket.on("disconnect", () => {
        for (const lobbyId in lobbies) {
            lobbies[lobbyId].players =
                lobbies[lobbyId].players.filter(id => id !== socket.id);
            io.to(lobbyId).emit("updateLobby", lobbies[lobbyId]);
        }
    });

});

server.listen(3000, () => {
    console.log("Server running on port 3000");
})