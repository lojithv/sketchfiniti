"use client"
import CreateProject from "@/components/CreateProject";
import Navbar from "@/components/Navbar";
import ProjetcsList from "@/components/ProjetcsList";
import { AuthProvider } from "@/context/AuthContext";
import { ActionButton, Provider, defaultTheme } from "@adobe/react-spectrum";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter();

    return (
        <Provider theme={defaultTheme}>
            <AuthProvider>
                <div className="flex w-screen h-screen flex-col">
                    <Navbar />
                    <div className="flex">
                        <CreateProject />
                        <div className='p-4'>
                            <ActionButton onPress={() => router.push("/editor?pr=offline")}>
                                Use Offline Mode</ActionButton>
                        </div>
                    </div>

                    <div className="w-full flex flex-col items-center">
                        <ProjetcsList />
                    </div>
                </div>
            </AuthProvider>
        </Provider>
    )
}