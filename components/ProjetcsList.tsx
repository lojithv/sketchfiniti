"use client"
import { app, db } from '@/config/firebase-config';
import { AuthContext } from '@/context/AuthContext';
import { ActionMenu, Image, Item, ListView, Text } from '@adobe/react-spectrum';
import Delete from '@spectrum-icons/workflow/Delete';
import Edit from '@spectrum-icons/workflow/Edit';
import Folder from '@spectrum-icons/workflow/Folder';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'


type Props = {}

const ProjetcsList = (props: Props) => {
    const { isAuthenticated, login, logout, user } = useContext(AuthContext);
    const [projects, setProjects] = useState<any[]>([]);
    const [loadingState, setLoadingState] = useState('idle');
    const [loadMore, setLoadMore] = useState(false);

    useEffect(() => {
        getProjects();

    }, [])

    const getProjects = async () => {
        // Fetch the projects from the database
        //use firebase to get project by user id
        const querySnapshot = await getDocs(collection(db, "projects"));
        const fetchedData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setProjects(fetchedData);
    }

    return (
        <div className='flex w-full min-w-[300px] max-w-[600px] p-4 h-full flex-col'>
            <ListView
                selectionMode="multiple"
                maxWidth="size-6000"
                aria-label="ListView example with complex items"
                items={projects}
                onAction={(key) => alert(`Triggering action on item ${key}`)}
            >
                {(item) => (
                    <Item key={item.name} textValue="Glasses Dog">
                        <Image
                            src="https://random.dog/1a0535a6-ca89-4059-9b3a-04a554c0587b.jpg"
                            alt="Shiba Inu with glasses"
                        />
                        <Text>Glasses Dog</Text>
                        <Text slot="description">JPG</Text>
                        <ActionMenu>
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
        </div>
    )
}

export default ProjetcsList