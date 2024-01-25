"use client"
import { ColorArea, ColorSlider } from "@react-spectrum/color";
import { Flex } from "@react-spectrum/layout";
import { Label } from "@react-spectrum/label";
import { parseColor } from "@react-stately/color";
import React, { useEffect, useState } from "react";
import { ToolStateStore } from "../store/Tools";
import { Color } from "@react-types/color";
import {
  ActionButton,
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DialogTrigger,
  Divider,
  Header,
  Heading,
  View,
} from "@adobe/react-spectrum";
import { PressEvent } from "@react-types/shared";

function ColorPicker({ colorPickerType }: { colorPickerType: string }) {
  let [color, setColor] = React.useState(parseColor("#000000"));
  let [redChannel, greenChannel, blueChannel] = color.getColorChannels();


  const updateColorState = () => {
    if (colorPickerType === "BRUSH_STROKE") {
      ToolStateStore.setBrushStrokeColor(color.toString("css"));
    } else if (colorPickerType === "CANVAS_BG") {
      ToolStateStore.setCanvasBgColor(color.toString("css"));
    }
  }

  useEffect(() => {
    updateColorState();
  }, []);

  const setListner = () => {
    if (colorPickerType === "BRUSH_STROKE") {
      ToolStateStore.brushStrokeColorChange$?.subscribe((c) => {
        setColor(parseColor(c));
      });
    } else if (colorPickerType === "CANVAS_BG") {
      ToolStateStore.canvasBgColorChange$?.subscribe((c) => {
        setColor(parseColor(c));
      });
    }
  }

  const handleColorChangeEnd = () => {
    updateColorState();
  };

  return (
    <DialogTrigger>
      <ActionButton>
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: color.toString("css"),
            borderRadius: '3px'
          }}
        ></div>
      </ActionButton>
      {(close) => (
        <Dialog size="S">
          <Heading>Select Color</Heading>

          <Divider />
          <Content>
            <fieldset style={{ border: 0 }}>
              {/* <legend>{color.getColorSpace().toUpperCase()}A Example</legend> */}
              <Flex direction="column" alignItems={"center"}>
                <ColorArea
                  xChannel={redChannel}
                  yChannel={greenChannel}
                  value={color}
                  onChange={setColor}
                // onChangeEnd={handleColorChangeEnd}
                />
                <ColorSlider
                  channel={blueChannel}
                  value={color}
                  onChange={setColor}
                // onChangeEnd={handleColorChangeEnd}
                />
                <ColorSlider
                  channel="alpha"
                  value={color}
                  onChange={setColor}
                // onChangeEnd={handleColorChangeEnd}
                />
                <p>Current value: {color.toString("css")}</p>
              </Flex>
            </fieldset>
          </Content>
          <ButtonGroup>
            <Button variant="secondary" onPress={close}>
              Cancel
            </Button>
            <Button
              variant="accent"
              onPress={() => {
                handleColorChangeEnd();
                close();
              }}
            >
              Confirm
            </Button>
          </ButtonGroup>
        </Dialog>
      )}
    </DialogTrigger>
  );
}

export default ColorPicker;
