import { fstore } from '@/config/firebase-config';
import { AuthContext } from '@/context/AuthContext';
import { DialogTrigger, ActionButton, Dialog, Heading, Divider, ButtonGroup, Button, Content, Form, TextField, Checkbox, Provider, defaultTheme, DialogContainer } from '@adobe/react-spectrum';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'

type Props = {
    project: any;
    isOpen: boolean;
    setOpen: (value: boolean) => void;
}

const UpdateProject = ({ isOpen, setOpen, project }: Props) => {

    const { isAuthenticated, login, logout, user } = useContext(AuthContext);

    const [projectData, setProjectData] = useState<any>();

    useEffect(() => {
        console.log('Project', project.name);
        setProjectData(project);
    }, [project])


    const updateProject = async () => {
        console.log('Update project', projectData);
        // Create a new project
        //use firebase to create a new project

        const docRef = doc(fstore, 'projects', project.id);

        const updateProject = await updateDoc(docRef, {
            name: projectData.name,
            updatedAt: new Date().toISOString()
        });

        console.log(updateProject)
    }

    let alertSave = () => {
        setOpen(false)
        // alert('Profile saved!');
        updateProject();
    };

    let alertCancel = () => {
        setOpen(false)
        // alert('Project not created!');
    };

    return (
        <div className='p-4'>
            <DialogContainer onDismiss={() => setOpen(false)}>
                {isOpen && (
                    <Dialog>
                        <Heading>Update Project</Heading>
                        <Divider />
                        <ButtonGroup>
                            <Button variant="secondary" onPress={() => alertCancel()}>
                                Cancel
                            </Button>
                            <Button autoFocus variant="accent" onPress={() => alertSave()}>
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
            </DialogContainer>
        </div >
    )
}

export default UpdateProject