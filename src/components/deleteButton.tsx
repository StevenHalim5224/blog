"use client"

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';


function DeleteButton({ objectId }: { objectId: string }) {
    const router = useRouter();
    const [isLoading, SetIsLoading] = useState(false);

    const handleDelete = async () => {
        const confirmDelete = confirm("are you sure delete the blog ?")

        if (!confirmDelete) return;

        SetIsLoading(true);
        try {
            const response = await fetch(
                `https://brightmitten-us.backendless.app/api/data/blogs/${objectId}`,
                {
                    method: "DELETE"
                }
            );
            if (!response.ok) {
                throw new Error("deleting blog failed, please try again");
            }

            toast.success("success deleting blog");
            router.push("/")
            router.refresh();

        } catch (error) {
            console.log("error");
            toast.error("something wrong while deleting blog");
        } finally {
            SetIsLoading(false)
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isLoading}
            className='bg-red-500 text-black px-4 py-2 rounded-md font-semibold hover:bg-red-950 disabled:opacity-50 transition-colors'
        >
            {isLoading ? "deleting..." : "delete blog"}
        </button>
    )
}
export default DeleteButton