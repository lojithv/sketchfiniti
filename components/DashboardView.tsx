import React, { useContext } from 'react'
import Navbar from './Navbar'
import { ActionButton } from '@adobe/react-spectrum'
import ProjetcsList from './ProjetcsList'
import CreateProject from './CreateProject'
import { useRouter } from 'next/navigation'
import { AuthContext } from '@/context/AuthContext'

type Props = {}

const DashboardView = (props: Props) => {
    const router = useRouter();
    const { isAuthenticated, login, logout, user } = useContext(AuthContext);

    return (
        <div className="flex w-screen h-screen flex-col">
            <Navbar />
            {isAuthenticated && (<div className="flex">
                <CreateProject />
                <div className='p-4'>
                    <ActionButton onPress={() => router.push("/editor?pr=offline")}>
                        Use Offline Mode</ActionButton>
                </div>
            </div>)}

            {isAuthenticated && (
                <div className="w-full flex flex-col items-center">
                    <ProjetcsList />
                </div>
            )}

            {!isAuthenticated && (
                <div className="flex w-full h-full justify-center items-center">
                    <div className="flex flex-col gap-5 items-center">
                        <ActionButton onPress={login}>Sign In to Create Projects</ActionButton>
                        <div>OR</div>
                        <ActionButton onPress={() => router.push("/editor?pr=offline")}>
                            Use Offline Mode</ActionButton>
                    </div>
                </div>

            )}
        </div>
    )
}

export default DashboardView