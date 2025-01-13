import { Server } from 'socket.io';
import express from 'express';
import { createServer } from 'http';
import { CursorPosition } from './types/cursor';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "https://socket-io-server-ub8o.onrender.com/", // Si vous utilisez Vite (port par défaut)
        methods: ["GET", "POST"]
    }
});

const cursorsList: CursorPosition[] = [];

const cursorMove = (
    payload: CursorPosition,
    callback: (res: CursorPosition[]) => void
) => {
    const cursorIndex = cursorsList.findIndex((cursor) => cursor.id === payload.id);
    if (cursorIndex !== -1) {
        cursorsList[cursorIndex] = payload;
    } else {
        cursorsList.push(payload);
    }
    io.emit('cursorMove', cursorsList);
    callback(cursorsList);
};

io.on('connection', (socket) => {
    // on socket connect add the cursor to the list
    if (socket.connected) {
        console.log('connected');
        cursorsList.push({
            id: socket.id,
            x: 0,
            y: 0,
            hostname: '',
        });
        io.emit('cursorMove', cursorsList);
    }

    // on socket disconnect remove the cursor from the list
    socket.on('disconnect', () => {
        console.log('disconnected');
        const cursorIndex = cursorsList.findIndex((cursor) => cursor.id === socket.id);
        cursorsList.splice(cursorIndex, 1);
    });

    socket.on('cursorMove', cursorMove);
});

const PORT = 4000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});