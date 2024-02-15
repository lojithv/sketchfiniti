import { db } from '@/config/firebase-config';
import { AuthContext } from '@/context/AuthContext';
import { DialogTrigger, ActionButton, Dialog, Heading, Divider, ButtonGroup, Button, Content, Form, TextField, Checkbox, Provider, defaultTheme } from '@adobe/react-spectrum';
import { addDoc, collection } from 'firebase/firestore';
import React, { useContext, useState } from 'react'

type Props = {}

const CreateProject = (props: Props) => {

    const { isAuthenticated, login, logout, user } = useContext(AuthContext);
    const [projectData, setProjectData] = useState<any>({});

    const createProject = async () => {
        // Create a new project
        //use firebase to create a new project
        try {
            const docRef = await addDoc(collection(db, "projects"), {
                name: projectData.name,
                createdBy: user.uid,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                state: null,
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
        <Provider theme={defaultTheme}>
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
                            </Form>
                        </Content>
                    </Dialog>
                )}
            </DialogTrigger>
        </Provider>
    )
}

export default CreateProject