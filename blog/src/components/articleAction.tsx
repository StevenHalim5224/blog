"use client"

import { useAuth } from "@/stores/auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import DeleteButton from "./deleteButton";

interface articleActionsProps {
    objectId: string;
    authorId: string;
}

const ArticleActions = ({objectId, authorId}: articleActionsProps) => {
    const {token} = useAuth();
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        if(token){
            try{
                const payload = JSON.parse(atob(token.split('.')[1]));
                setCurrentUserId(payload.id);
            } catch (error) {
                console.error("Failed Read Token")
            }
        }
    }, [token])

    if(currentUserId !== authorId) {
        return null;
    }

    return(
        <div className="mt-12 mb-8 flex gap-4">
            <Link
                href={`/edit/${objectId}`}
                className="bg-blue-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
                Edit Blog
            </Link>
            <DeleteButton objectId={objectId}/>
        </div>
    )
}

export default ArticleActions