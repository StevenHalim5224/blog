"use client"
import { useAuth } from '@/stores/auth'
import { Button } from './ui/button'
import Link from 'next/link'

const navbar = () => {
    const {user, clearAuth} = useAuth()
    return (
        <div className='flex justify-between items-center container mx-auto p-4'>
            <p className='font-bold text-2xl text-purple-950'>Food Ninja</p>

            <div className='flex gap-4 items-center'>
                <Link href = "/">Blog</Link>
                <Link href = "/write">Write</Link>

                {!user ? <Link href = "/sign-in"><Button>Sign In </Button></Link> : <Button variant="destructive" onClick={clearAuth}>Sign Out</Button>}
            </div>
        </div>
    )
}

export default navbar