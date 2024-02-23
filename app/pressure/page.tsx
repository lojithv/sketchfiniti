"use client"

// PenPressureCanvas.js
import React, { useRef, useEffect, useState, use } from 'react';
import { getStroke } from 'perfect-freehand'
import { getSvgPathFromStroke } from './utils'
import "./styles.css";

const options = {
    size: 32,
    thinning: 0.5,
    smoothing: 0.5,
    streamline: 0.5,
    easing: (t: any) => t,
    start: {
        taper: 0,
        easing: (t: any) => t,
        cap: true
    },
    end: {
        taper: 100,
        easing: (t: any) => t,
        cap: true
    }
};

const PenPressureCanvas = () => {
    const [points, setPoints] = React.useState<any[]>([]);

    function handlePointerDown(e: any) {
        e.target.setPointerCapture(e.pointerId);
        setPoints([[e.pageX, e.pageY, e.pressure]]);
    }

    function handlePointerMove(e: any) {
        if (e.buttons !== 1) return;
        setPoints([...points, [e.pageX, e.pageY, e.pressure]]);
    }

    const stroke = getStroke(points, options);
    const pathData = getSvgPathFromStroke(stroke);

    return (
        <svg
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            style={{ touchAction: "none" }}
        >
            {points && <path d={pathData} />}
        </svg>
    );
};

export default PenPressureCanvas;
