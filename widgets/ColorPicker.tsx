"use client"
import { ColorArea, ColorSlider, ColorWheel } from '@react-spectrum/color';
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
  Grid,
  Header,
  Heading,
  View,
} from "@adobe/react-spectrum";
import { ColorPickerTypes } from '@/types/ColorPickerTypes';


function ColorPicker({ colorPickerType }: { colorPickerType: string }) {
  let [color, setColor] = React.useState(parseColor('hsba(0, 100%, 50%, 1)'));
  let [, saturationChannel, brightnessChannel] = color.getColorChannels();


  const updateColorState = () => {
    if (colorPickerType === "BRUSH_STROKE") {
      ToolStateStore.setBrushStrokeColor(color);
    } else if (colorPickerType === "CANVAS_BG") {
      ToolStateStore.setCanvasBgColor(color);
      ToolStateStore.setStateUpdated(true);
    }
  }

  const brushStrokeColor = ToolStateStore.useBrushStrokeColor();
  const canvasBgColor = ToolStateStore.useCanvasBgColor();

  useEffect(() => {
    setLocalColor();
  }, [canvasBgColor, brushStrokeColor]);

  const setLocalColor = () => {
    if (colorPickerType === ColorPickerTypes.BRUSH_STROKE) {
      setColor(brushStrokeColor);
    } else if (colorPickerType === ColorPickerTypes.CANVAS_BG) {
      setColor(canvasBgColor);
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
              <legend>HSBA Example</legend>
              <Flex
                direction="column">
                <View
                  position="relative"
                  width="size-2400">
                  <Grid
                    position="absolute"
                    justifyContent="center"
                    alignContent="center"
                    width="100%"
                    height="100%">
                    <ColorArea
                      xChannel={saturationChannel}
                      yChannel={brightnessChannel}
                      value={color}
                      onChange={setColor}
                      size="size-1200" />
                  </Grid>
                  <ColorWheel
                    value={color}
                    onChange={setColor}
                    size="size-2400" />
                </View>
                <ColorSlider channel="alpha" value={color} onChange={setColor} />
                <p>Current value: {color.toString('hsba')}</p>
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
