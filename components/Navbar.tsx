export default function Navbar() {

    return (
        <div className="bg-slate-900 w-full text-slate-50 p-5 flex gap-5 justify-between">
            <div>Plannr</div>
            <div className="flex gap-5">
                <div>Sign In</div>
                <div>Sign Up</div>
            </div>
            <div>Dashboard</div>
        </div>
    )
}