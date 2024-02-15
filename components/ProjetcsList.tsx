"use client"
import { app, db } from '@/config/firebase-config';
import { AuthContext } from '@/context/AuthContext';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'


type Props = {}

const ProjetcsList = (props: Props) => {
    const { isAuthenticated, login, logout, user } = useContext(AuthContext);
    const [projects, setProjects] = useState<any[]>([]);

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
        <div className='flex w-full h-full p-10 flex-col'>
            {/* <h1 className='text-2xl font-bold'>Projects</h1> */}
            <div className='flex flex-col gap-4 mt-4'>
                {projects.map(project => (
                    <div key={project.id} className='flex justify-between items-center p-4 bg-gray-100 rounded-lg'>
                        <h2>{project.name}</h2>
                        <p>{project.createdAt}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProjetcsList