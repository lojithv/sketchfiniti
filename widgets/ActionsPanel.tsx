import { ActionGroup, Flex, Item, Provider, View, defaultTheme, Text } from '@adobe/react-spectrum'
import Brush from '@spectrum-icons/workflow/Brush'
import Erase from '@spectrum-icons/workflow/Erase'
import Hand from '@spectrum-icons/workflow/Hand'
import Undo from '@spectrum-icons/workflow/Undo'
import React from 'react'
import ColorPicker from './ColorPicker'
import Redo from '@spectrum-icons/workflow/Redo'
import Remove from '@spectrum-icons/workflow/Remove'
import RemoveCircle from '@spectrum-icons/workflow/RemoveCircle'
import Delete from '@spectrum-icons/workflow/Delete'
import SaveFloppy from '@spectrum-icons/workflow/SaveFloppy'
import Export from '@spectrum-icons/workflow/Export'
import { ColorPickerTypes } from '@/types/ColorPickerTypes'
import ExportOptionsPanel from './ExportOptionsPanel'

type Props = {
    handleAction: (action: string) => void
}

const ActionsPanel = ({ handleAction }: Props) => {
    return (
        <div className='absolute z-20 top-[50px] right-0'>
            {/* <div className="flex flex-col gap-4 bg-black p-3">
                <button className="bg-gray-100 p-2 rounded-md" onClick={() => handleAction('undo')}></button>
                <button className="bg-gray-100 p-2 rounded-md" onClick={() => handleAction('redo')}>Redo</button>
                <button className="bg-gray-100 p-2 rounded-md" onClick={() => handleAction('clear')}>Clear</button>
                <button className="bg-gray-100 p-2 rounded-md" onClick={() => handleAction('save')}>Save</button>
                <button className="bg-gray-100 p-2 rounded-md" onClick={() => handleAction('export')}>Export</button>
            </div> */}

            <Provider theme={defaultTheme}>
                <View backgroundColor="gray-50" padding="size-50">
                    <Flex direction={"column"} gap={"size-100"}>
                        <ActionGroup
                            orientation="vertical"
                            isEmphasized
                            selectionMode="none"
                            onAction={(key: any) => handleAction(key.toString())}
                            buttonLabelBehavior="hide"
                        >
                            <Item key="undo">
                                <Undo />
                                <Text>Undo</Text>
                            </Item>
                            <Item key="redo" aria-label="Redo">
                                <Redo />
                                <Text>Redo</Text>
                            </Item>
                            <Item key="clear" aria-label="Clear">
                                <Delete />
                                <Text>Clear</Text>
                            </Item>
                            <Item key="save" aria-label="Save">
                                <SaveFloppy />
                                <Text>Save</Text>
                            </Item>
                            {/* <Item key="export" aria-label="Export">
                                <Export />
                                <Text>Export</Text>
                            </Item> */}
                        </ActionGroup>
                        <ExportOptionsPanel handleAction={handleAction} />
                        <ColorPicker colorPickerType={ColorPickerTypes.CANVAS_BG} />
                    </Flex>
                </View>
            </Provider>
        </div>
    )
}

export default ActionsPanel