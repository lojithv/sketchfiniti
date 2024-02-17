import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { Provider, defaultTheme } from "@adobe/react-spectrum";

export default function Home() {
  return (
    <Provider theme={defaultTheme}>
      <AuthProvider>
        <div className="flex w-screen h-screen flex-col bg-slate-900">
          <Navbar />
          Home
        </div>
      </AuthProvider>
    </Provider>
  )
}