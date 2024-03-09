"use client"
import NotebookEditor from '@/components/NotebookEditor'
import { AuthProvider } from '@/context/AuthContext'
import React from 'react'

type Props = {}

const page = (props: Props) => {
    return (
        <AuthProvider>
            <NotebookEditor />
        </AuthProvider>
    )
}

export default page