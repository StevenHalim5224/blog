import React from 'react'
import WritePage from './component/WritePage'
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
const write = async () => {
    const session = await auth();

    if (!session?.user.email) return redirect("/sign-in");
  return (
    <div>
        <WritePage />
    </div>
  )
}

export default write 