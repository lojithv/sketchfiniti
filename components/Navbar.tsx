export default function Navbar() {
    const user = null
    return (
        <div className="bg-slate-900 w-full text-slate-50 p-5 flex gap-5 justify-between">
            <div>Plannr</div>
            {!user && <div className="flex gap-5">
                <div>Sign In</div>
            </div>}
            {user &&
                <div>Dashboard</div>
            }
        </div>
    )
}