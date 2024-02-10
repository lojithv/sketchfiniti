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
    View,
    Checkbox
} from "@adobe/react-spectrum";
import { PressEvent } from "@react-types/shared";
import Actions from '@spectrum-icons/workflow/Actions';
import Export from '@spectrum-icons/workflow/Export';

type Props = {
    handleAction: (action: string) => void
}

const ExportOptionsPanel = ({ handleAction }: Props) => {

    const exportOptions = ToolStateStore.useExportOptions();

    const handleUpdateExportOptions = (key: string, value: boolean) => {
        ToolStateStore.setExportOptions({ ...exportOptions, [key]: value });
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
                <Export />
            </ActionButton>
            {(close) => (
                <Dialog size="S">
                    <Heading>Export Options</Heading>

                    <Divider />
                    <Content>
                        <Flex direction="column" maxWidth="size-3000" gap="size-300">
                            <Checkbox isSelected={exportOptions.withBackground} onChange={(v) => { handleUpdateExportOptions('withBackground', v) }}>Include Background</Checkbox>
                        </Flex>
                    </Content>
                    <ButtonGroup>
                        <Button variant="secondary" onPress={close}>
                            Cancel
                        </Button>
                        <Button
                            variant="accent"
                            onPress={() => {
                                handleAction('export');
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

export default ExportOptionsPanel