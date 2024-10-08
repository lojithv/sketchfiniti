import { fstore } from '@/config/firebase-config';
import { AuthContext } from '@/context/AuthContext';
import { DialogTrigger, ActionButton, Dialog, Heading, Divider, ButtonGroup, Button, Content, Form, TextField, Checkbox, Provider, defaultTheme, Key, Picker, Item } from '@adobe/react-spectrum';
import { addDoc, collection } from 'firebase/firestore';
import React, { useContext, useState } from 'react'

type Props = {}

const CreateProject = (props: Props) => {

    const { isAuthenticated, login, logout, user } = useContext(AuthContext);
    const [projectData, setProjectData] = useState<any>({});

    let options = [
        { name: 'Infinite Canvas' },
        { name: 'Notebook' }
    ];
    let [projectType, setProjectType] = React.useState<Key>("Infinite Canvas");

    const createProject = async () => {
        // Create a new project
        //use firebase to create a new project
        try {
            const docRef = await addDoc(collection(fstore, "projects"), {
                name: projectData.name,
                createdBy: user.uid,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                accessibility: 'private',
                projectType: projectType,
                // state: null,
            });

            // Clear form fields after successful submission
            console.log('Item added successfully', docRef.id);
        } catch (error) {
            console.error('Error adding item: ', error);
        }
    }

    let alertSave = (close: () => void) => {
        close();
        // alert('Profile saved!');
        createProject();
    };

    let alertCancel = (close: () => void) => {
        close();
        // alert('Project not created!');
    };

    return (
        <div className='p-4'>
            <DialogTrigger>
                <ActionButton>Create New Project</ActionButton>
                {(close) => (
                    <Dialog>
                        <Heading>Create New Project</Heading>
                        <Divider />
                        <ButtonGroup>
                            <Button variant="secondary" onPress={() => alertCancel(close)}>
                                Cancel
                            </Button>
                            <Button autoFocus variant="accent" onPress={() => alertSave(close)}>
                                Save
                            </Button>
                        </ButtonGroup>
                        <Content>
                            <Form>
                                <TextField label="Name" value={projectData.name} onChange={(v) => setProjectData({ ...projectData, name: v })} />
                                {/* <Checkbox>Make private</Checkbox> */}
                                <Picker
                                    label="Select Project Type"
                                    items={options}
                                    selectedKey={projectType}
                                    onSelectionChange={selected => setProjectType(selected)}>
                                    {item => <Item key={item.name}>{item.name}</Item>}
                                </Picker>
                            </Form>
                        </Content>
                    </Dialog>
                )}
            </DialogTrigger>
        </div >
    )
}

export default CreateProject