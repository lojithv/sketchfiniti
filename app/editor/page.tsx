"use client"
import Editor from '@/components/Editor'
import { AuthProvider } from '@/context/AuthContext'
import React from 'react'

type Props = {}

const page = (props: Props) => {
    return (
        <AuthProvider>
            <Editor />
        </AuthProvider>
    )
}

export default page