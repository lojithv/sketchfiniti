import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

export default function Home() {
  return (
    <AuthProvider>
      <div className="flex w-screen h-screen justify-center flex-col items-center">
        <Navbar />
        Home
      </div>
    </AuthProvider>
  )
}