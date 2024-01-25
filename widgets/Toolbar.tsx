import { Provider, defaultTheme, View, Flex, ActionGroup, Item, Text } from '@adobe/react-spectrum'
import Brush from '@spectrum-icons/workflow/Brush'
import Erase from '@spectrum-icons/workflow/Erase'
import Hand from '@spectrum-icons/workflow/Hand'
import React from 'react'
import ColorPicker from './ColorPicker'
import { ColorPickerTypes } from '@/types/ColorPickerTypes'

type Props = {
    tool: string,
    handleToolChange: (toolName: string) => void
}

const Toolbar = ({ tool, handleToolChange }: Props) => {
    return (
        <div style={{ position: "absolute", zIndex: 20, top: "50px" }}>
            <Provider theme={defaultTheme}>
                <View backgroundColor="gray-50" padding="size-50">
                    <Flex direction={"column"} gap={"size-100"}>
                        <ActionGroup
                            orientation="vertical"
                            isEmphasized
                            selectionMode="single"
                            onAction={(key: any) => handleToolChange(key.toString())}
                            selectedKeys={[tool]}
                            buttonLabelBehavior="hide"
                        >
                            <Item key="pan">
                                <Hand />
                                <Text>Pan</Text>
                            </Item>
                            <Item key="brush" aria-label="Brush">
                                <Brush />
                                <Text>Brush</Text>
                            </Item>
                            <Item key="eraser" aria-label="Brush">
                                <Erase />
                                <Text>Eraser</Text>
                            </Item>
                        </ActionGroup>

                        <ColorPicker colorPickerType={ColorPickerTypes.BRUSH_STROKE} />
                    </Flex>
                </View>
            </Provider>
        </div>
    )
}

export default Toolbar