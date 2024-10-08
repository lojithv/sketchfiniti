import { Provider, defaultTheme, View, Flex, ActionGroup, Item, Text } from '@adobe/react-spectrum'
import Brush from '@spectrum-icons/workflow/Brush'
import Erase from '@spectrum-icons/workflow/Erase'
import Hand from '@spectrum-icons/workflow/Hand'
import React from 'react'
import ColorPicker from './ColorPicker'
import { ColorPickerTypes } from '@/types/ColorPickerTypes'
import ToolConfig from './ToolConfig'
import Shortcuts from './Shortcuts'

type Props = {
    tool: string,
    handleToolChange: (toolName: string) => void
}

const Toolbar = ({ tool, handleToolChange }: Props) => {

    return (
        <div style={{ position: "absolute", zIndex: 20, top: "50px", }}>
            <Provider theme={defaultTheme} UNSAFE_style={{ backgroundColor: 'transparent' }}>

                {/* <View backgroundColor="transparent"> */}

                {/* <Flex direction={"column"} gap={"size-100"} justifyContent={"space-between"}> */}
                <div style={{ height: 'calc(100vh - 55px)' }} className='flex flex-col justify-between p-2 bg-transparent'>
                    <div className='flex flex-col gap-2'>
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
                        <ToolConfig />
                        <ColorPicker colorPickerType={ColorPickerTypes.BRUSH_STROKE} />
                    </div>

                    <Shortcuts />
                </div>
                {/* </Flex> */}
                {/* </View> */}
            </Provider>
        </div>
    )
}

export default Toolbar