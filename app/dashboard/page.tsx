"use client"
import CreateProject from "@/components/CreateProject";
import Navbar from "@/components/Navbar";
import ProjetcsList from "@/components/ProjetcsList";
import { AuthProvider } from "@/context/AuthContext";

export default function Dashboard() {


    return (
        <AuthProvider>
            <div className="flex w-screen h-screen justify-center flex-col items-center">
                <Navbar />
                <CreateProject />
                <ProjetcsList />
            </div>
        </AuthProvider>
    )
}