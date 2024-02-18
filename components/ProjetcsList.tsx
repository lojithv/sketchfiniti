"use client"
import { app, fstore } from '@/config/firebase-config';
import { AuthContext } from '@/context/AuthContext';
import { ActionMenu, AlertDialog, DialogContainer, Image, Item, Key, ListView, Text } from '@adobe/react-spectrum';
import Delete from '@spectrum-icons/workflow/Delete';
import Edit from '@spectrum-icons/workflow/Edit';
import Folder from '@spectrum-icons/workflow/Folder';
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import UpdateProject from './UpdateProject';
import { set } from 'firebase/database';
import { useRouter } from 'next/navigation';


type Props = {}

const ProjetcsList = (props: Props) => {
    const { isAuthenticated, login, logout, user } = useContext(AuthContext);
    const [projects, setProjects] = useState<any[]>([]);
    const [loadingState, setLoadingState] = useState('idle');
    const [loadMore, setLoadMore] = useState(null);
    const [editingProject, setEditingProject] = useState<any>({});

    let [isUpdateDialogOpen, setUpdateDialogOpen] = React.useState(false);

    const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            detectProjectChanges();
        }
    }, [isAuthenticated])

    const detectProjectChanges = () => {
        const q = query(collection(fstore, "projects"), where("createdBy", "==", user.uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const projectsList: any[] = [];
            querySnapshot.forEach((doc) => {
                projectsList.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setProjects(projectsList);
            console.log("Current projects: ", projectsList.join(", "));
        });
    }

    const getProjects = async () => {
        // Fetch the projects from the database
        //use firebase to get project by user id
        const querySnapshot = await getDocs(collection(fstore, "projects"));
        const fetchedData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setProjects(fetchedData);
    }

    const handleAction = (item: any, action: Key) => {
        console.log(item);
        console.log(action);
        switch (action) {
            case 'edit':
                console.log('Edit');
                openEditPopup(item);
                break;
            case 'delete':
                console.log('Delete');
                setDeleteDialogOpen(true);
                setEditingProject(item);
                break;
            default:
                break;
        }
    }

    const openEditPopup = (item: any) => {
        setUpdateDialogOpen(true);
        setEditingProject(item);
        console.log('Edit', item);
    }

    const handleDeleteProject = async () => {
        console.log('Delete', editingProject);
        await deleteDoc(doc(fstore, "projects", editingProject.id));
        setDeleteDialogOpen(false);
    }

    const handleSelectProject = (item: any) => {
        console.log('Select', item);
        router.push(`/editor?pr=${item}`);
    }

    return (
        <div className='flex w-full min-w-[300px] max-w-[600px] p-4 h-full flex-col'>
            <UpdateProject isOpen={isUpdateDialogOpen} setOpen={setUpdateDialogOpen} project={editingProject} />
            {projects.length === 0 && <div className="text-center text-xl">No projects found</div>}
            {projects.length > 0 && (
                <ListView
                    selectionMode="none"
                    maxWidth="size-6000"
                    aria-label="ListView example with complex items"
                    items={projects}
                    onAction={(id) => handleSelectProject(id)}
                >
                    {(item) => (
                        <Item key={item.id} textValue={item.name}>
                            <Text>{item.name}</Text>
                            <ActionMenu onAction={(key) => handleAction(item, key)}>
                                <Item key="edit" textValue="Edit">
                                    <Edit />
                                    <Text>Edit</Text>
                                </Item>
                                <Item key="delete" textValue="Delete">
                                    <Delete />
                                    <Text>Delete</Text>
                                </Item>
                            </ActionMenu>
                        </Item>
                    )}
                </ListView>
            )}
            <DialogContainer onDismiss={() => setDeleteDialogOpen(false)} {...props}>
                {isDeleteDialogOpen &&
                    <AlertDialog
                        title="Delete"
                        variant="destructive"
                        primaryActionLabel="Delete"
                        secondaryActionLabel='Cancel'
                        onPrimaryAction={() => handleDeleteProject()}
                        onSecondaryAction={() => setDeleteDialogOpen(false)}
                    >
                        Are you sure you want to delete this item?
                    </AlertDialog>
                }
            </DialogContainer>
        </div>
    )
}

export default ProjetcsList