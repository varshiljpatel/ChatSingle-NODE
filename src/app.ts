import express, { Request, Response, NextFunction } from "express";
import { createServer, Server } from 'http';
import { Server as socketioServer } from 'socket.io'
import path from 'path';

const app = express();
const server : Server = createServer(app);

// app.use(morgan('dev'));  
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve('public')));

const io = new socketioServer(server);
io.on('connection', socket => {
    socket.broadcast.emit('hi');
    console.log("User is connected with socket =>", socket.id);
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
    io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' });
});

app.get('/', (req : Request, res : Response, next : NextFunction) => {
    try {
        res.sendFile('../public/index.html');
    } catch (error: any) {
        next(error.message);
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('Server listening on port :', PORT);
})