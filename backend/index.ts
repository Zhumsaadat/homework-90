import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import WebSocket from 'ws';
import { Pixels } from "./types";

const app = express();
const port = 8000;
const getWs = expressWs(app);

app.use(cors());

const router = express.Router();
app.use(router);

const pixelsData: Pixels[] = [];

const pixelUpdate = () => {
    const wss = getWs.getWss();
    const payload = JSON.stringify({type: 'update', pixels: pixelsData});

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
};

router.ws('/chat', (ws, _req) => {
    ws.send(JSON.stringify({type: 'init', pixels: pixelsData}));

    ws.on('message', (message: string) => {
        const {type, pixel} = JSON.parse(message);

        if (type === 'addPixel') {
            pixelsData.push(pixel);
            pixelUpdate();
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected!!');
    });
});

app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
});