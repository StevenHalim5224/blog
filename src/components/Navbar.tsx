"use client"
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from './ui/button'

const navbar = () => {
    const session = useSession()

    return (
        <div className='flex justify-between items-center container mx-auto p-4'>
            <p className='font-bold text-2xl text-purple-950'>Food Ninja</p>

            <div className='flex gap-4 items-center'>
                <Link href="/">Blog</Link>
                <Link href="/write">Write</Link>



                {session.status === "unauthenticated" ?
                    <Link href="/sign-in"><Button>Sign In </Button></Link> :
                    <Button variant="destructive" onClick={() => signOut()}>Sign Out</Button>}
            </div>
        </div>
    )
}

export default navbar