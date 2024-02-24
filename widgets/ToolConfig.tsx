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
    Slider,
    TextField,
    View,
} from "@adobe/react-spectrum";
import { PressEvent } from "@react-types/shared";
import Actions from '@spectrum-icons/workflow/Actions';

type Props = {}

const ToolConfig = (props: Props) => {
    let [color, setColor] = React.useState(parseColor('hsba(0, 100%, 50%, 0.5)'));
    let [, saturationChannel, brightnessChannel] = color.getColorChannels();

    const brushStrokeWidth = ToolStateStore.useBrushStrokeWidth()

    const setBrushStrokeWidth = (value: string) => {
        const parsedValue = parseInt(value ? value?.toString() : '0')
        ToolStateStore.setBrushStrokeWidth(parsedValue)
    }

    const eraserStrokeWidth = ToolStateStore.useEraserStrokeWidth()

    const setEraserStrokeWidth = (value: string) => {
        const parsedValue = parseInt(value ? value?.toString() : '0')
        ToolStateStore.setEraserStrokeWidth(parsedValue)
    }

    return (
        <DialogTrigger>
            <ActionButton>
                {/* <div
                    style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: color.toString("css"),
                        borderRadius: '3px'
                    }}
                ></div> */}
                <Actions />
            </ActionButton>
            {(close) => (
                <Dialog size="S">
                    <Heading>Configure Tools</Heading>

                    <Divider />
                    <Content>
                        <Flex direction="column" maxWidth="size-3000" gap="size-300">
                            <TextField
                                inputMode='numeric'
                                label="Brush Stroke Width"
                                value={brushStrokeWidth?.toString()}
                                onChange={setBrushStrokeWidth} />
                            <TextField
                                inputMode='numeric'
                                label="Erase Stroke Width"
                                value={eraserStrokeWidth?.toString()}
                                onChange={setEraserStrokeWidth}
                            />
                        </Flex>
                    </Content>
                    <ButtonGroup>
                        <Button variant="secondary" onPress={close}>
                            Cancel
                        </Button>
                        <Button
                            variant="accent"
                            onPress={() => {
                                close();
                            }}
                        >
                            Confirm
                        </Button>
                    </ButtonGroup>
                </Dialog>
            )}
        </DialogTrigger>
    )
}

export default ToolConfig