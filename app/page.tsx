import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

export default function Home() {
  return (
    <AuthProvider>
      <div className="flex w-screen h-screen flex-col">
        <Navbar />
        Home
      </div>
    </AuthProvider>
  )
}