"use client"
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from './ui/button'
import { useAuth } from '@/stores/auth'
import { useEffect, useState } from 'react'

const navbar = () => {

    const { token, clearAuth } = useAuth()

    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const handleSignOut = () =>{
        const isConfirm = window.confirm("Do you really want to Sign Out ?")
        if(isConfirm){
            clearAuth()
        }
    }

    return (
        <div className='flex justify-between items-center container mx-auto p-4'>
            <p className='font-bold text-2xl text-purple-950'>Food Ninja</p>

            <div className='flex gap-4 items-center'>
                <Link href="/">Blog</Link>
                <Link href="/write">Write</Link>

                {isMounted ? (
                    !token ? (
                        <Link href="/login">
                            <Button>sign in</Button>
                        </Link>
                    ) : (
                        <Button variant="destructive" onClick={handleSignOut}>
                            sign out
                        </Button>
                    )
                ) : (
                    <Button variant="outline" disabled> loading...</Button>
                )
                }

            </div>
        </div>
    )
}

export default navbar