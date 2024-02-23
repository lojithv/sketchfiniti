"use client"

// PenPressureCanvas.js
import React, { useRef, useEffect, useState } from 'react';
import './styles.css';

const PenPressureCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
    const [drawing, setDrawing] = useState(false);
    const [lastX, setLastX] = useState(0);
    const [lastY, setLastY] = useState(0);
    const [penPressure, setPenPressure] = useState(1); // Default pressure

    const brushSize = 10; // Default brush size

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (context) {
            setCtx(context);
            context.lineWidth = brushSize * 1;
            context.lineCap = 'round';
            context.strokeStyle = '#000';
        }
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        console.log('canvas', canvas);
        if (!canvas) return;

        const handlePointerMove = (e: PointerEvent) => {
            console.log(e.pressure);
            if (!ctx || !drawing) return;
            ctx.lineTo(e.clientX, e.clientY);
            ctx.stroke();
            setLastX(e.clientX);
            setLastY(e.clientY);
        };

        const handlePointerDown = (e: PointerEvent) => {
            setDrawing(true);
            setLastX(e.clientX);
            setLastY(e.clientY);
            if (ctx) {
                ctx.beginPath();
                ctx.moveTo(lastX, lastY);
            }
        };

        const handlePointerUp = () => {
            setDrawing(false);
        };

        canvas.addEventListener('pointermove', handlePointerMove);
        canvas.addEventListener('pointerdown', handlePointerDown);
        canvas.addEventListener('pointerup', handlePointerUp);

        return () => {
            canvas.removeEventListener('pointermove', handlePointerMove);
            canvas.removeEventListener('pointerdown', handlePointerDown);
            canvas.removeEventListener('pointerup', handlePointerUp);
        };
    }, [ctx, drawing, lastX, lastY]);

    // Update canvas size on window resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Set initial size

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="w-screen h-screen relative overflow-hidden">
            <canvas
                ref={canvasRef}
                width={window.innerWidth}
                height={window.innerHeight}
                style={{ border: '1px solid black' }}
            />
        </div>
    );
};

export default PenPressureCanvas;
