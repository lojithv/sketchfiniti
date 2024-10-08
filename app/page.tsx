import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { Provider, defaultTheme } from "@adobe/react-spectrum";
import Link from "next/link";

export default function Home() {
  return (
    <Provider theme={defaultTheme}>
      <AuthProvider>
        <div className="flex w-screen h-screen flex-col bg-slate-900">
          <Navbar />
          <div className="flex flex-col justify-center items-center gap-5 h-full">
            <h1 className="text-6xl text-slate-50">Welcome to Sketchfiniti</h1>
            <p className="text-slate-50 text-lg">This is a simple app to manage your products</p>
            <Link href={"/dashboard"}>
              <div className="p-5 bg-slate-300 text-black w-fit font-bold text-lg">
                Get Started
              </div>
            </Link>
          </div>
        </div>
      </AuthProvider>
    </Provider>
  )
}