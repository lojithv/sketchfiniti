import Link from 'next/link'
import React from 'react'

type Props = {}

const Page = (props: Props) => {
    return (
        <div className='w-screen h-screen text-white flex flex-col p-5 justify-center gap-5 items-center bg-slate-900'>
            <div className='font-bold text-2xl'>Select Mode</div>
            <div className='flex gap-5'>
                <div className='border border-slate-200 p-5'>
                    <Link href={'/editor?pr=offline'}>Offline</Link>
                </div>
                <div className='border border-slate-200 p-5'>
                    <Link href={'/dashboard'}>Online</Link>
                </div>
            </div>
        </div>
    )
}

export default Page