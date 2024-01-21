"use client"

import Navbar from "@/components/Navbar";
import { ToolStateStore } from "@/store/Tools";
import ColorPicker from "@/widgets/ColorPicker";
import Toolbar from "@/widgets/Toolbar";
import {
  TooltipTrigger,
  ActionButton,
  Tooltip,
  View,
  ProgressBar,
  Flex,
  Provider,
  defaultTheme,
  Button,
  ActionGroup,
  Item,
  Text,
  Header,
  Divider,
} from "@adobe/react-spectrum";
import Brush from "@spectrum-icons/workflow/Brush";
import Edit from "@spectrum-icons/workflow/Edit";
import Erase from "@spectrum-icons/workflow/Erase";
import Hand from "@spectrum-icons/workflow/Hand";
import Move from "@spectrum-icons/workflow/Move";
import { KonvaEventObject } from "konva/lib/Node";
import React, { MouseEvent, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Stage, Layer, Line, Rect, Circle, Group } from "react-konva";

import Konva from "konva";
import ActionsPanel from "@/widgets/ActionsPanel";

const App = () => {
  const [tool, setTool] = React.useState("pan");
  const [isDrawing, setIsDrawing] = useState(false);

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

  const [color, setColor] = useState<string>("");

  const [lastLineRef, setLastLineRef] = useState<any>(null);

  // const groupRef = useRef<any>(null);

  useEffect(() => {

  }, []);

  ToolStateStore.colorChange$?.subscribe((c) => {
    setColor(c);
  });

  const handleMouseDown = () => {
    if (tool === "brush" || tool === "eraser") {
      setIsDrawing(true);
    }
    const pos = layerRef.current.getRelativePointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y], color: color }]);
    const newLine = new Konva.Line({
      stroke: color,
      strokeWidth: 5,
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
  };

  const handleAddLine = (line: any) => {
    const newLine = new Konva.Line({
      stroke: line.color,
      strokeWidth: 5,
      globalCompositeOperation:
        tool === line.tool ? 'source-over' : 'destination-out',
      // round cap for smoother lines
      lineCap: 'round',
      lineJoin: 'round',
      // add point twice, so we have some drawings even on a simple click
      points: line.points,
    });
    layerRef.current.add(newLine);
  }

  const handleMouseMove = () => {
    if (!isDrawing) {
      return;
    }
    if (tool === "brush" || tool === "eraser") {
      const point = layerRef.current.getRelativePointerPosition();
      let lastLine = lines[lines.length - 1];
      if (lastLine) {
        // add point
        lastLine.points = lastLine.points.concat([point.x, point.y]);
        let lastLineRefCopy = lastLineRef;
        const newPoints = lastLineRefCopy.points().concat([point.x, point.y]);
        lastLineRefCopy.points(newPoints);
        // replace last
        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
        setLastLineRef(lastLineRefCopy);
      }
    }
  };

  const handleMouseUp = () => {
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
    const uri = stageRef.current.toDataURL();
    // we also can save uri as file
    // but in the demo on Konva website it will not work
    // because of iframe restrictions
    // but feel free to use it in your apps:
    downloadURI(uri, 'stage.png');
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
        break;
      case 'save':
        break;
      case 'export':
        handleExport();
        break;
    }
  }

  return (
    <div
      className="w-screen h-screen relative "
    >
      <div
        className="h-[50px] absolute w-full z-20"
      >
        <Navbar />
      </div>

      <Toolbar tool={tool} handleToolChange={handleToolChange} />
      <ActionsPanel handleAction={handleAction} />
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseEnter={() => changeCursor('crosshair')}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        ref={stageRef}
        scaleX={scale}
        scaleY={scale}
        className="stage"
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

export default App;
