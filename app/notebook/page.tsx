"use client"
import { AuthProvider } from '@/context/AuthContext'
import dynamic from 'next/dynamic';
import React from 'react'

const NotebookEditor = dynamic(() => import('@/components/NotebookEditor'), {
    ssr: false,
  });

type Props = {}

const page = (props: Props) => {
    return (
        <AuthProvider>
            <NotebookEditor />
        </AuthProvider>
    )
}

export default page