"use client"
import CreateProject from "@/components/CreateProject";
import Navbar from "@/components/Navbar";
import ProjetcsList from "@/components/ProjetcsList";
import { AuthProvider } from "@/context/AuthContext";
import { Provider, defaultTheme } from "@adobe/react-spectrum";

export default function Dashboard() {


    return (
        <Provider theme={defaultTheme}>
            <AuthProvider>
                <div className="flex w-screen h-screen flex-col">
                    <Navbar />
                    <div>
                        <CreateProject />
                    </div>

                    <div className="w-full flex flex-col items-center">
                        <ProjetcsList />
                    </div>
                </div>
            </AuthProvider>
        </Provider>
    )
}