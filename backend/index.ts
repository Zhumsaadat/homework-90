import { WebSocket } from 'ws';
import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';

const app = express();
const WSServer = expressWs(app);
const aWss = WSServer.getWss();
const port = 8000;

app.use(cors());
const router = express.Router();

interface Message {
    method: string;
    id: string;
    username: string;
}

router.ws('/paint', (ws, req) => {
    ws.on('message', (msg: string) => {
        const parsedMsg: Message = JSON.parse(msg);
        switch (parsedMsg.method) {
            case "connection":
                connectionHandler(ws, parsedMsg);
                break;
            case "draw":
                broadcastConnection(ws, parsedMsg);
                break;
        }
    });
});

app.use(router);
app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
});

const connectionHandler = (ws: any, msg: Message) => {
    ws.id = msg.id;
    broadcastConnection(ws, msg);
}

const broadcastConnection = (ws: any, msg: Message) => {
    aWss.clients.forEach((client: WebSocket) => {
        if ((client as any).id === msg.id) {
            client.send(JSON.stringify(msg));
        }
    });
}