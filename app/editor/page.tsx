"use client"
import { AuthProvider } from '@/context/AuthContext'
import React from 'react'
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/components/Editor'), {
    ssr: false,
  });

type Props = {}

const page = (props: Props) => {
    return (
        <AuthProvider>
            <Editor />
        </AuthProvider>
    )
}

export default page