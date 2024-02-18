"use client"

import AppNavbar from "@/components/AppNavbar";
import { ToolStateStore } from "@/store/Tools";
import Toolbar from "@/widgets/Toolbar";

import { KonvaEventObject } from "konva/lib/Node";
import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect } from "react-konva";

import Konva from "konva";
import ActionsPanel from "@/widgets/ActionsPanel";
import { useSearchParams } from "next/navigation";
import { addDoc, collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { fstore } from "@/config/firebase-config";

const Editor = () => {
    const [tool, setTool] = React.useState("pan");
    const [isDrawing, setIsDrawing] = useState(false);

    const [prevTool, setPrevTool] = useState("pan");

    const searchParams = useSearchParams()

    const prId = searchParams.get('pr')

    const [subscriptions, setSubscriptions] = useState<any[]>([]);

    const handleToolChange = (toolName: string) => {
        if (toolName === "pan") {
            setIsDrawing(false);
        }
        setTool(toolName);
    };

    const [lines, setLines] = useState<any[]>([]);
    const [scale, setScale] = useState(1);
    const stageRef = useRef<any>(null);
    const layerRef = useRef<any>(null);

    const [lastLineRef, setLastLineRef] = useState<any>(null);

    // const groupRef = useRef<any>(null);


    const brushStrokeWidth = ToolStateStore.useBrushStrokeWidth()

    const eraserStrokeWidth = ToolStateStore.useEraserStrokeWidth()

    const canvasBgColor = ToolStateStore.useCanvasBgColor()

    const brushStrokeColor = ToolStateStore.useBrushStrokeColor();

    const exportOptions = ToolStateStore.useExportOptions();

    const [project, setProject] = useState<any>({});

    const handleMouseDown = (e: any) => {
        console.log("down", e)
        if (e.evt.which === 2) {
            console.log("middle click")
            setPrevTool(tool);
            setTool('pan');
            return;
        }
        if (tool === "brush" || tool === "eraser") {
            setIsDrawing(true);
        } else {
            setIsDrawing(false)
            return;
        }
        const pos = layerRef.current.getRelativePointerPosition();
        setLines([...lines, { tool, points: [pos.x, pos.y], color: brushStrokeColor.toString('css'), brushStrokeWidth, eraserStrokeWidth }]);
        const newLine = new Konva.Line({
            stroke: brushStrokeColor.toString('css'),
            strokeWidth: tool === 'brush' ? brushStrokeWidth : eraserStrokeWidth,
            globalCompositeOperation:
                tool === 'brush' ? 'source-over' : 'destination-out',
            // round cap for smoother lines
            lineCap: 'round',
            lineJoin: 'round',
            // add point twice, so we have some drawings even on a simple click
            points: [pos.x, pos.y, pos.x, pos.y],
        });
        setLastLineRef(newLine);
        layerRef.current.add(newLine);
        // db.ref(`projects/${prId}/drawings/lines`).push(newLine);
    };

    const handleAddLine = (line: any) => {
        const newLine = new Konva.Line({
            stroke: line.color,
            strokeWidth: line.tool === 'brush' ? line.brushStrokeWidth : line.eraserStrokeWidth,
            globalCompositeOperation:
                line.tool === 'brush' ? 'source-over' : 'destination-out',
            // round cap for smoother lines
            lineCap: 'round',
            lineJoin: 'round',
            // add point twice, so we have some drawings even on a simple click
            points: line.points,
        });
        layerRef.current.add(newLine);
        layerRef.current.batchDraw();
        stageRef.current.batchDraw();
    }

    const handleMouseMove = (e: any) => {
        // console.log(e.evt.pressure)
        console.log("move")
        if (!isDrawing) {
            return;
        }
        // console.log(e)
        console.log(e.evt.pressure)


        if (tool === "brush" || tool === "eraser") {
            const point = layerRef.current.getRelativePointerPosition();
            let lastLine = lines[lines.length - 1];
            if (lastLine) {
                // add point
                lastLine.points = lastLine.points.concat([point.x, point.y]);
                let lastLineRefCopy = lastLineRef;
                const newPoints = lastLineRefCopy.points().concat([point.x, point.y]);
                lastLineRefCopy.points(newPoints);
                // lastLineRefCopy.strokeWidth(5);
                // replace last
                lines.splice(lines.length - 1, 1, lastLine);
                setLines(lines.concat());
                setLastLineRef(lastLineRefCopy);
            }
        }
    };

    const handleMouseUp = (e: any) => {
        if (e.evt.which === 2) {
            console.log("middle click")
            setTool(prevTool);
        }
        setIsDrawing(false);
    };

    const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();

        const stage = stageRef.current;
        const oldScale = scale;
        const pointer = stage.getPointerPosition();

        let zoomAmount = e.evt.deltaY > 0 ? 1.1 : 1 / 1.1;
        let newScale = oldScale * zoomAmount;

        setScale(newScale);

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        const newZoom = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };

        stage.scale({ x: newScale, y: newScale });
        stage.position(newZoom);
        stage.batchDraw();
    };

    const handleExport = () => {
        let rectRef;
        let rectLayerRef;
        const stage = stageRef.current;

        //Get the original stage size
        const stageWidth = stage.width();
        const stageHeight = stage.height();

        // Get the current scale of the stage
        const scaleX = stage.scaleX();
        const scaleY = stage.scaleY();

        // Calculate the actual stage size after zooming out
        const actualWidth = stageWidth / scaleX;
        const actualHeight = stageHeight / scaleY;

        // Get the current position of the stage
        const stageX = stage.x();
        const stageY = stage.y();

        // Calculate the actual position of the stage, considering any panning and scaling
        const rectX = -stageX / scaleX;
        const rectY = -stageY / scaleY;
        if (exportOptions.withBackground) {
            const rectLayer = new Konva.Layer();
            const rect = new Konva.Rect({
                x: rectX,
                y: rectY,
                width: actualWidth,
                height: actualHeight,
                fill: canvasBgColor.toString('css')
            });
            rectRef = rect;
            rectLayer.add(rect);
            stageRef.current.add(rectLayer);
            rect.moveToBottom();
            rectLayer.moveToBottom();
            rectLayerRef = rectLayer;
        }

        const uri = stageRef.current.toDataURL({
            // mimeType: 'image/png',
            // quality: 0.8,
            // pixelRatio: 2,
        });
        // we also can save uri as file
        // but in the demo on Konva website it will not work
        // because of iframe restrictions
        // but feel free to use it in your apps:
        downloadURI(uri, 'stage.png');
        if (rectRef && rectLayerRef) {
            rectRef.destroy();
            rectLayerRef.destroy();
        }
    };

    function downloadURI(uri: string, name: string) {
        var link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const changeCursor = (cursor: string) => {
        stageRef.current.container().style.cursor = cursor;
    }

    const handleAction = (action: string) => {
        switch (action) {
            case 'undo':
                break;
            case 'redo':
                break;
            case 'clear':
                layerRef.current.destroyChildren();
                setLines([]);
                break;
            case 'save':
                handleSaveProject();
                break;
            case 'export':
                handleExport();
                break;
        }
    }

    const updateLocalState = (data: any) => {
        const parsedData = JSON.parse(data);
        setLines(parsedData);
        console.log(parsedData)
        for (let line of parsedData) {
            handleAddLine(line);
        }
    }

    const detectProjectChanges = () => {
        if (!prId) return;
        const unsub = onSnapshot(doc(fstore, "projects", prId), (doc) => {
            const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
            console.log(source, " data: ", doc.data());
            const projectData: any = {
                id: doc.id,
                ...doc.data()
            }
            setProject(projectData);
            if (projectData?.state) {
                updateLocalState(projectData?.state);
            }
        });
        setSubscriptions([...subscriptions, unsub]);
    }

    useEffect(() => {
        if (prId) {
            console.log(prId)
            detectProjectChanges();
        }
        const handleKeyDownEvents = (e: KeyboardEvent) => {
            console.log("test.............")
            if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
                console.log('undo');
            } else if (e.key === 'y' && (e.ctrlKey || e.metaKey)) {
                console.log('redo');
            } else if (e.key === 'b') {
                //enable brush tool
                setTool('brush');
            } else if (e.key === 'e') {
                //enable eraser tool
                setTool('eraser');
            } else if (e.key === 'm') {
                //enable move tool
                setTool('pan');
            } else if (e.key === '[') {
                console.log('decrease brush size');
                //decrease brush size
                if (tool === 'brush') {
                    ToolStateStore.setBrushStrokeWidth(brushStrokeWidth - 1);
                    console.log(brushStrokeWidth - 1)
                } else {
                    ToolStateStore.setEraserStrokeWidth(eraserStrokeWidth - 1);
                    console.log(eraserStrokeWidth - 1)
                }
            } else if (e.key === ']') {
                console.log('increase brush size');
                //increase brush size
                if (tool === 'brush') {
                    ToolStateStore.setBrushStrokeWidth(brushStrokeWidth + 1);
                    console.log(brushStrokeWidth + 1)
                } else {
                    ToolStateStore.setEraserStrokeWidth(eraserStrokeWidth + 1);
                    console.log(eraserStrokeWidth + 1)
                }
            }
        }

        window.addEventListener('keydown', handleKeyDownEvents);
        return () => {
            window.removeEventListener('keydown', handleKeyDownEvents);
            for (let unsub of subscriptions) {
                unsub();
            }
        };
    }, [brushStrokeWidth, eraserStrokeWidth, tool]);

    const handleSaveProject = async () => {
        console.log("save project")
        try {
            const docRef = doc(fstore, 'projects', project.id);

            const updateProject = await updateDoc(docRef, {
                state: JSON.stringify(lines),
                updatedAt: new Date().toISOString()
            });

            // Clear form fields after successful submission
            console.log('Item added successfully', docRef.id);
        } catch (error) {
            console.error('Error adding item: ', error);
        }
    }

    // useEffect(() => {
    //   function logPressure(ev: any) {
    //     console.log(ev.pressure)
    //     // console.log(ev.pointerType)
    //     // console.log(ev.type)
    //     // if (isDrawing) {
    //     //   if (ev.type === 'pointerdown') {

    //     //     handleMouseDown(ev);

    //     //   } else {
    //     //     handleMouseMove(ev);
    //     //   }
    //     // }
    //   }

    //   document.addEventListener('pointerdown', logPressure, false);
    //   document.addEventListener('pointermove', logPressure, false);
    // }, []);

    return (
        <div
            className="w-screen h-screen relative "
        >
            <div
                className="h-[50px] absolute w-full z-50"
            >
                <AppNavbar />
            </div>
            <Toolbar tool={tool} handleToolChange={handleToolChange} />
            <ActionsPanel handleAction={handleAction} />
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                onMouseEnter={() => changeCursor('crosshair')}
                onPointerDown={handleMouseDown}
                onPointerMove={handleMouseMove}
                onMouseup={handleMouseUp}
                onWheel={handleWheel}
                // onTouchStart={handleMouseDown}
                // onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
                ref={stageRef}

                scaleX={scale}
                scaleY={scale}
                className="stage"
                style={{ backgroundColor: canvasBgColor.toString('css') }}
                draggable={tool === "pan" ? true : false}
            >
                <Layer
                    ref={layerRef}
                    className="layer"
                >
                    {/* <Rect
            x={50}
            y={50}
            width={100}
            height={100}
            fill="red"
            draggable={true}
          /> */}

                </Layer>
            </Stage>
        </div>
    );
};

export default Editor;
