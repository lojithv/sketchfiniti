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
    Cell,
    Column,
    Content,
    Dialog,
    DialogTrigger,
    Divider,
    Grid,
    Header,
    Heading,
    Row,
    Slider,
    TableBody,
    TableHeader,
    TableView,
    TextField,
    View,
} from "@adobe/react-spectrum";
import { PressEvent } from "@react-types/shared";
import Actions from '@spectrum-icons/workflow/Actions';
import Info from '@spectrum-icons/workflow/Info';

type Props = {}

const Shortcuts = (props: Props) => {
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

    let columns = [
        { name: 'Action', uid: 'action' },
        { name: 'Shortcut', uid: 'shortcut' },
    ];

    let rows = [
        { id: 1, action: 'Pan Tool', shortcut: 'm' },
        { id: 2, action: 'Brush Tool', shortcut: 'b' },
        { id: 3, action: 'Eraser Tool', shortcut: 'e' },
        { id: 4, action: 'Increase Brush/Eraser Size', shortcut: ']' },
        { id: 5, action: 'Decrease Brush/Eraser Size', shortcut: '[' },
        { id: 6, action: 'Undo', shortcut: 'ctrl + z' },
        { id: 7, action: 'Redo', shortcut: 'ctrl + y' },
        { id: 8, action: 'Reset Canvas Size', shortcut: '0' },
    ];

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
                <Info />
            </ActionButton>
            {(close) => (
                <Dialog size="M">
                    <Heading>Shortcuts</Heading>

                    <Divider />
                    <Content>
                        <Flex height="size-5000" width="100%" direction="column" gap="size-150">
                            <TableView
                                aria-label="Example table with dynamic content"
                                maxWidth="size-6000">
                                <TableHeader columns={columns}>
                                    {column => (
                                        <Column
                                            key={column.uid}
                                            align={column.uid === 'date' ? 'end' : 'start'}>
                                            {column.name}
                                        </Column>
                                    )}
                                </TableHeader>
                                <TableBody items={rows}>
                                    {(item: any) => (
                                        <Row>
                                            {(columnKey: any) => <Cell>{item[columnKey]}</Cell>}
                                        </Row>
                                    )}
                                </TableBody>
                            </TableView>
                        </Flex>
                    </Content>
                    <ButtonGroup>
                        <Button variant="secondary" onPress={close}>
                            Close
                        </Button>
                    </ButtonGroup>
                </Dialog>
            )}
        </DialogTrigger>
    )
}

export default Shortcuts