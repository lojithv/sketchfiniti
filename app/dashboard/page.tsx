import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

export default function Dashboard() {
    return (
        <AuthProvider>
            <div className="flex justify-center flex-col items-center">
                <Navbar />
                Dashboard
            </div>
        </AuthProvider>
    )
}