"use client"

import AppNavbar from "@/components/AppNavbar";
import { ToolStateStore } from "@/store/Tools";
import Toolbar from "@/widgets/Toolbar";

import { KonvaEventObject } from "konva/lib/Node";
import React, { use, useContext, useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect } from "react-konva";

import Konva from "konva";
import ActionsPanel from "@/widgets/ActionsPanel";
import { useSearchParams } from "next/navigation";
import { addDoc, collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { db, fstore } from "@/config/firebase-config";
import { child, onValue, push, ref, set, update } from "firebase/database";
import { AuthContext } from "@/context/AuthContext";
import _ from "lodash";
import { parseColor, Color } from "@react-stately/color";

const NotebookEditor = () => {
    const [tool, setTool] = React.useState("pan");
    const [isDrawing, setIsDrawing] = useState(false);

    const [isLoaded, setIsLoaded] = useState(false);

    const [prevTool, setPrevTool] = useState("pan");

    const searchParams = useSearchParams()

    const prId = searchParams.get('pr')

    const [subscriptions, setSubscriptions] = useState<any[]>([]);

    const { isAuthenticated, login, logout, user } = useContext(AuthContext);

    const [enableTools, setEnableTools] = useState(false);

    const [projectSub, setProjectSub] = useState<any>(null);

    const [isAccessGranted, setIsAccessGranted] = useState(false);

    const handleToolChange = (toolName: string) => {
        if (toolName === "pan") {
            setIsDrawing(false);
        }
        setTool(toolName);
    };

    const [lines, setLines] = useState<any[]>([]);
    const [images, setImages] = useState<any[]>([]);

    const [scale, setScale] = useState(1);
    const stageRef = useRef<any>(null);
    const layerRef = useRef<any>(null);

    const [pages, setPages] = useState<any[]>([1, 2, 3]);

    const pageRefs = useRef<any>(pages.map(() => React.createRef()));

    const [lastLineRef, setLastLineRef] = useState<any>(null);

    const [lineRefs, setLineRefs] = useState<any[]>([]);

    const [redoStack, setRedoStack] = useState<any[]>([]);


    const brushStrokeWidth = ToolStateStore.useBrushStrokeWidth()

    const eraserStrokeWidth = ToolStateStore.useEraserStrokeWidth()

    const canvasBgColor = ToolStateStore.useCanvasBgColor()

    const brushStrokeColor = ToolStateStore.useBrushStrokeColor();

    const exportOptions = ToolStateStore.useExportOptions();

    const stateUpdated = ToolStateStore.useStateUpdated();

    const [project, setProject] = useState<any>(null);

    const [selectedId, setSelectedId] = useState<any>(null);

    const A4_WIDTH = 595; // A4 width in pixels
    const A4_HEIGHT = 842; // A4 height in pixels

    const handleMouseDown = (e: any, i: number) => {
        if (e.evt.which === 2) {
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
        const pos = e.target.getStage().getRelativePointerPosition();
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
        setLineRefs([...lineRefs, newLine]);
        pageRefs.current[i].current.add(newLine);
        ToolStateStore.setStateUpdated(true);
    };

    const handleAddLine = (line: any, action?: string) => {
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
        if (layerRef.current && stageRef.current) {
            layerRef.current.add(newLine);
            layerRef.current.batchDraw();
            stageRef.current.batchDraw();
            if (action === 'redo') {
                setLineRefs([...lineRefs, newLine]);
            }
        }
    }

    const handleAddImage = (image: any, saveImage?: boolean) => {
        const img = new window.Image() as any;
        console.log(img);
        img.src = image.image;
        img.onload = () => {
            const windowWidth = window.innerWidth - 50;
            const windowHeight = window.innerHeight - 50;

            let scale = 1;
            if (img.width > windowWidth || img.height > windowHeight) {
                const scaleX = windowWidth / img.width;
                const scaleY = windowHeight / img.height;
                scale = Math.min(scaleX, scaleY);
            }

            const newImage = {
                id: images.length + 1,
                image: image.image,
                width: img.width * scale,
                height: img.height * scale,
                x: (windowWidth - img.width * scale) / 2,
                y: (windowHeight - img.height * scale) / 2,
                rotation: 0,
            };

            setImages([...images, newImage]);

            // Add the image to the Konva Layer using layerRef
            const konvaImage = new Konva.Image({
                image: img,
                x: (windowWidth - img.width * scale) / 2,
                y: (windowHeight - img.height * scale) / 2,
                width: img.width * scale,
                height: img.height * scale,
                draggable: true,
                id: newImage.id.toString(),
                name: 'image',
                rotation: newImage.rotation,
            });


            konvaImage.on('click', (e) => {
                const clickedId = e.target.id();
                if (selectedId !== clickedId) {
                    setSelectedId(clickedId);
                } else {
                    setSelectedId(null);
                }
            });

            konvaImage.on('dragend', (e) => {
                handleImageChange(newImage.id, {
                    x: e.target.x(),
                    y: e.target.y(),
                });
            });

            konvaImage.on('transformend', (e) => {
                const node = layerRef.current.findOne(`#${newImage.id}`);
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const rotation = node.rotation();

                handleImageChange(newImage.id, {
                    x: node.x(),
                    y: node.y(),
                    width: node.width() * scaleX,
                    height: node.height() * scaleY,
                    rotation: rotation,
                });
            });

            konvaImage.on('transform', (e) => {
                const node = e.target;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();

                // Prevent negative scaling
                if (scaleX < 0 || scaleY < 0) {
                    node.scaleX(Math.max(scaleX, 0.1));
                    node.scaleY(Math.max(scaleY, 0.1));
                }
            });

            const transformer = new Konva.Transformer({
                node: konvaImage,
            });

            layerRef.current.add(konvaImage);
            layerRef.current.add(transformer);
            layerRef.current.batchDraw();
        };
    }

    const handleMouseMove = (e: any, i: number) => {
        if (!isDrawing) {
            return;
        }

        if (tool === "brush" || tool === "eraser") {
            const point = e.target.getStage().getRelativePointerPosition();
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

    const handleMouseUp = (e: any, i: number) => {
        if (e.evt.which === 2) {
            setTool(prevTool);
        }
        setIsDrawing(false);
        ToolStateStore.setStateUpdated(true);
    };

    const handleWheelOld = (e: KonvaEventObject<WheelEvent>) => {
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
                handleUndo();
                break;
            case 'redo':
                handleRedo();
                break;
            case 'clear':
                layerRef.current?.destroyChildren();
                setLines([]);
                handleSaveProject('clear');
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
        console.log('Data updated');
        console.log(data);
        const imagesList = data?.images ? Object.keys(data?.images).map((key) => data?.images[key]) : [];
        console.log(imagesList);
        const linesDiff = _.difference(data?.lines, lines);
        const imageDiff = _.difference(imagesList, images);
        if (!data?.lines?.length) {
            layerRef?.current?.destroyChildren();
        }
        if (!data?.images?.length) {
            layerRef?.current?.destroyChildren();
        }
        // layerRef?.current?.destroyChildren();
        for (let line of linesDiff) {
            handleAddLine(line);
        }
        for (let image of imageDiff) {
            handleAddImage(image);
        }
        setLines(data?.lines ? data?.lines : []);
        // var result = Object.keys(data?.images).map((key) => data?.images[key]);
        setImages(imagesList ? imagesList : []);
        if (data?.canvasBgColor) {
            ToolStateStore.setCanvasBgColor(parseColor(data?.canvasBgColor));
        }
    }

    useEffect(() => {
        if (user && project.createdBy === user.uid) {
            for (let unsub of subscriptions) {
                unsub();
            }
        }
    }, [subscriptions])

    useEffect(() => {
        const detectProjectChanges = () => {
            if (!prId) return;
            const dbRef = ref(db, 'v1/projects/' + prId + '/drawing');
            const unsub = onValue(dbRef, (snapshot) => {
                console.log('Data updated');
                const data = snapshot.val();
                if (data) {
                    updateLocalState(data);
                } else {
                    updateLocalState([]);
                }
                setSubscriptions([...subscriptions, unsub]);
            });
        }

        if (project?.id && prId) {
            if (project.accessibility === 'private') {
                if (user && user.uid === project.createdBy && user.uid !== null) {
                    setIsAccessGranted(true);
                    detectProjectChanges();
                } else {
                    console.log("You don't have access to this project")
                }
            } else {
                setIsAccessGranted(true);
                detectProjectChanges();
            }
        }
        return () => {
            for (let unsub of subscriptions) {
                unsub();
            }
        };
    }, [project])

    useEffect(() => {
        const getProject = () => {

            if (!prId) return;
            const unsub = onSnapshot(doc(fstore, "projects", prId), (doc) => {
                const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
                const projectData: any = {
                    id: doc.id,
                    ...doc.data()
                }
                setProject(projectData);
                if (projectData) {
                    if (user && projectData.createdBy === user.uid) {
                        setEnableTools(true);
                        unsub()
                    }
                }
            });
        }

        if (prId && prId !== 'offline') {
            getProject();
        } else if (prId === 'offline') {
            setEnableTools(true);
            setIsAccessGranted(true);
        }
    }, [prId, isAuthenticated])

    useEffect(() => {

        const handleKeyDownEvents = (e: KeyboardEvent) => {
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
            } else if (e.key === '0') {
                //reset canvas zoom and pan
                setScale(1);
                stageRef.current.position({ x: 0, y: 0 });
            }
        }

        if (enableTools) {
            window.addEventListener('keydown', handleKeyDownEvents);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDownEvents);
        };
    }, [brushStrokeWidth, eraserStrokeWidth, tool, enableTools]);

    const handleSaveProject = async (action?: string) => {
        if (!project) {
            return;
        }
        try {
            const stateRef = ref(db, 'v1/projects/' + prId + '/drawing');
            const linesData = action == 'clear' ? [] : lines
            set(stateRef, { lines: linesData, canvasBgColor: canvasBgColor.toString('css'), pages: pages, images: images });
            ToolStateStore.setStateUpdated(false);
        } catch (error) {
            console.error('Error adding item: ', error);
        }
    }

    const handlePushPoints = async (data: any[]) => {
        try {
            const stateRef = ref(db, 'v1/projects/' + prId + '/drawing/lines/');
            const linesData = data
            set(stateRef, linesData);
        } catch (error) {
            console.error('Error adding item: ', error);
        }
    }

    useEffect(() => {
        // if (lines?.length > 0 && stateUpdated) {
        //     handleSaveProject();
        // }
    }, [stateUpdated])

    const handleUndo = () => {
        if (lines.length === 0) return;
        const lastLine = lines[lines.length - 1];

        const lastLineRef = lineRefs[lineRefs.length - 1];
        if (lastLineRef) {
            setRedoStack([...redoStack, lastLine]);
            setLines(lines.slice(0, -1));
            lastLineRef.destroy();
            setLineRefs(lineRefs.slice(0, -1));
        }
        ToolStateStore.setStateUpdated(true);
    }

    const handleRedo = () => {
        if (redoStack.length === 0) return;
        const lastRedoLine = redoStack[redoStack.length - 1];
        if (lastRedoLine) {
            setLines([...lines, lastRedoLine]);
            setRedoStack(redoStack.slice(0, -1));
            handleAddLine(lastRedoLine, 'redo');
            ToolStateStore.setStateUpdated(true);
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

    const handleDrop = (e: any) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const img = new window.Image() as any;
            console.log(img);
            img.src = reader.result;
            img.onload = () => {
                const windowWidth = window.innerWidth - 50;
                const windowHeight = window.innerHeight - 50;

                let scale = 1;
                if (img.width > windowWidth || img.height > windowHeight) {
                    const scaleX = windowWidth / img.width;
                    const scaleY = windowHeight / img.height;
                    scale = Math.min(scaleX, scaleY);
                }

                const newImage = {
                    id: images.length + 1,
                    image: reader.result,
                    width: img.width * scale,
                    height: img.height * scale,
                    x: (windowWidth - img.width * scale) / 2,
                    y: (windowHeight - img.height * scale) / 2,
                    rotation: 0,
                };

                setImages([...images, newImage]);

                // Add the image to the Konva Layer using layerRef
                const konvaImage = new Konva.Image({
                    image: img,
                    x: (windowWidth - img.width * scale) / 2,
                    y: (windowHeight - img.height * scale) / 2,
                    width: img.width * scale,
                    height: img.height * scale,
                    draggable: true,
                    id: newImage.id.toString(),
                    name: 'image',
                    rotation: newImage.rotation,
                });

                handleSaveImage(newImage);

                konvaImage.on('click', (e) => {
                    const clickedId = e.target.id();
                    if (selectedId !== clickedId) {
                        setSelectedId(clickedId);
                    } else {
                        setSelectedId(null);
                    }
                });

                konvaImage.on('dragend', (e) => {
                    handleImageChange(newImage.id, {
                        x: e.target.x(),
                        y: e.target.y(),
                    });
                });

                konvaImage.on('transformend', (e) => {
                    const node = layerRef.current.findOne(`#${newImage.id}`);
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();
                    const rotation = node.rotation();

                    handleImageChange(newImage.id, {
                        x: node.x(),
                        y: node.y(),
                        width: node.width() * scaleX,
                        height: node.height() * scaleY,
                        rotation: rotation,
                    });
                });

                konvaImage.on('transform', (e) => {
                    const node = e.target;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    // Prevent negative scaling
                    if (scaleX < 0 || scaleY < 0) {
                        node.scaleX(Math.max(scaleX, 0.1));
                        node.scaleY(Math.max(scaleY, 0.1));
                    }
                });

                const transformer = new Konva.Transformer({
                    node: konvaImage,
                });

                layerRef.current.add(konvaImage);
                layerRef.current.add(transformer);
                layerRef.current.batchDraw();
            };
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: any) => {
        e.preventDefault();
    };

    const handleImageChange = (id: any, newProps: { x?: number; y?: number; width?: number, height?: number, rotation?: number }) => {
        console.log('Image changed');
        console.log(newProps)

        const updatedImages = images.map((image) => {
            if (image.id === id) {
                return {
                    ...image,
                    ...newProps,
                };
            }
            return image;
        });
        setImages(updatedImages);

        // Find the corresponding transformer and update its props
        const selectedNode = layerRef.current.findOne(`#${id}`);
        const transformer = layerRef.current.findOne(`Transformer`);
        if (selectedNode && transformer) {
            transformer.setNode(selectedNode);
            layerRef.current.batchDraw();
        }
    };

    const handleSaveImage = (image: any) => {
        if (!project) {
            return;
        }
        try {
            // const stateRef = ref(db, 'v1/projects/' + prId + '/drawing');
            const newImageKey = push(child(ref(db), 'v1/projects/' + prId + '/drawing/images')).key;
            // set(stateRef, { images: images });
            const updates: any = {};
            updates['v1/projects/' + prId + '/drawing/images/' + newImageKey] = image;
            update(ref(db), updates);
            ToolStateStore.setStateUpdated(false);
        } catch (error) {
            console.error('Error adding item: ', error);
        }
    }

    // Calculate center position for A4 sheets
    const centerPosition = {
        x: (window.innerWidth - A4_WIDTH) / 2,
        y: (window.innerHeight - A4_HEIGHT) / 2,
    };


    const calculatePagePosition = (pageIndex: number) => {
        const pageSpacing = 20; // Spacing between pages
        const yPos = (pageIndex * (A4_HEIGHT + pageSpacing)) + pageSpacing;
        return { x: pageSpacing, y: yPos };
    };

    const handleDragMove = (e: any) => {
        const newY = e.target.y();
        e.target.y(Math.min(0, newY)); // Prevent dragging beyond top
        e.target.y(Math.max(-(A4_HEIGHT + 20) * (pages.length - 1), newY)); // Prevent dragging beyond bottom
    };

    const handleWheel = (e: any) => {
        e.evt.preventDefault(); // Prevents default browser scrolling
        const deltaY = e.evt.deltaY;
        const stage = stageRef.current;
        const currentPosition = stage.y();
        const maxPosition = 50;
        const minPosition = -(A4_HEIGHT + 20) * (pages.length - 1);
        let newPosition = currentPosition + deltaY;

        if (newPosition > maxPosition) {
            newPosition = maxPosition;
        } else if (newPosition < minPosition) {
            newPosition = minPosition;
        }

        stage.y(newPosition);
        stage.batchDraw();
    };

    return (
        <div
            className="w-screen h-screen relative "
        >
            <div
                className="h-[50px] absolute w-full z-50"
            >
                <AppNavbar />
            </div>
            <div className="w-full h-full relative"
                onDrop={handleDrop}
                onDragOver={handleDragOver}>
                {enableTools && <Toolbar tool={tool} handleToolChange={handleToolChange} />}
                {enableTools && <ActionsPanel handleAction={handleAction} />}
                {isAccessGranted && (
                    <Stage
                        width={window.innerWidth}
                        height={window.innerHeight}
                        onMouseEnter={() => changeCursor('crosshair')}
                        ref={stageRef}
                        onWheel={handleWheel}
                        scaleX={scale}
                        scaleY={scale}
                        className="stage"
                        y={50}
                        style={{ backgroundColor: canvasBgColor.toString('css') }}
                        draggable={tool === "pan" ? true : false}
                        onDragMove={handleDragMove}
                        dragBoundFunc={(pos) => ({ x: 0, y: pos.y })}
                    >

                        {pages.map((page, i) => (
                            <Layer
                                key={page.id}
                                ref={pageRefs.current[i]}
                                onPointerDown={(e: any) => handleMouseDown(e, i)}
                                onPointerMove={(e: any) => handleMouseMove(e, i)}
                                onMouseup={(e: any) => handleMouseUp(e, i)}
                                // onTouchStart={handleMouseDown}
                                // onTouchMove={handleMouseMove}
                                onTouchEnd={(e: any) => handleMouseUp(e, i)}
                            >
                                <Rect
                                    x={centerPosition.x}
                                    y={calculatePagePosition(i).y}
                                    width={A4_WIDTH}
                                    height={A4_HEIGHT}
                                    fill="white"
                                />
                            </Layer>
                        ))}

                    </Stage>
                )}
            </div>

            {!isAccessGranted && (
                <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white">
                    <h1 className="text-4xl">You don&apos;t have access to this project</h1>
                </div>
            )}
        </div>
    );
};

export default NotebookEditor;
