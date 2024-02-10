"use client"
import { AuthContext } from '@/context/AuthContext';
import React, { useContext, useState } from 'react'


type Props = {}

const ProjetcsList = (props: Props) => {
    const { isAuthenticated, login, logout, user } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);


    const getProjects = async () => {
        // Fetch the projects from the database
        //use firebase to get project by user id

    }

    const createProject = async () => {
        // Create a new project
        //use firebase to create a new project

    }

    return (
        <div className='flex w-full h-full p-10 flex-col'>
            <div>Create Project</div>
            <div>Project List</div>
        </div>
    )
}

export default ProjetcsList