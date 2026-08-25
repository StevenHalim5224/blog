"use client"

import { axiosInstance } from '@/lib/axios';
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
            await axiosInstance.delete(`/articles/${objectId}`);

            window.location.href=("/")
            toast.success("success deleting blog");

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
            className='bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-950 disabled:opacity-50 transition-colors'
        >
            {isLoading ? "deleting..." : "delete blog"}
        </button>
    )
}
export default DeleteButton