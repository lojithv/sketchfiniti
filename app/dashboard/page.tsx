"use client"

import DashboardView from "@/components/DashboardView";
import { AuthProvider } from "@/context/AuthContext";
import { Provider, defaultTheme } from "@adobe/react-spectrum";


export default function Dashboard() {

    return (
        <Provider theme={defaultTheme}>
            <AuthProvider>
                <DashboardView />
            </AuthProvider>
        </Provider>
    )
}