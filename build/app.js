"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
// app.use(morgan('dev'));  
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path_1.default.resolve('public')));
const io = new socket_io_1.Server(server);
io.on('connection', socket => {
    socket.broadcast.emit('hi');
    console.log("User is connected with socket =>", socket.id);
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
    io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' });
});
app.get('/', (req, res, next) => {
    try {
        res.sendFile('../public/index.html');
    }
    catch (error) {
        next(error.message);
    }
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('Server listening on port :', PORT);
});
