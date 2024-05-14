import { useEffect, useRef } from 'react';
import { Pixels } from '../../types';

const Canvas = () => {
    const data = useRef(new WebSocket('ws://localhost:8000/chat'));

    useEffect(() => {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        const drawPixels = (pixelBold: Pixels[]) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pixelBold.forEach(({x, y}) => ctx.fillRect(x, y, 1, 1));
        };

        data.current.addEventListener('message', (event) => {
            const {type, pixels} = JSON.parse(event.data);

            if (type === 'init' || type === 'update') {
                drawPixels(pixels);
            }
        });

        canvas.addEventListener('mousemove', (event) => {
            if (event.buttons === 1) {
                const pixel = {x: event.clientX, y: event.clientY};
                data.current.send(JSON.stringify({type: 'addPixel', pixel}));
            }
        });

    }, []);

    return (
        <canvas id="canvas" width="1000" height="700" style={{border: '3px solid black'}}/>


    );
};

export default Canvas;