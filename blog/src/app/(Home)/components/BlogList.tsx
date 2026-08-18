"use client";

import { Blog } from '@/types/blog';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BlogCard } from './BlogCard';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';

interface ApiResponse {
    message: String;
    data: Blog[];
    meta?: any;
}

const BlogList = () => {
    //cara manual
    // const [blog, setBlog] = useState<Blog[]>([]);

    // const [loading, setLoading] = useState<boolean>(true);

    // const getBlog = async () => {
    //     try {
    //         const result = await axios.get("https://brightmitten-us.backendless.app/api/data/blogs?sortBy=%60created%60%20desc");

    //         setBlog(result.data);
    //     } catch (error) {
    //         console.log(error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     getBlog();
    // }, [])

    const { data: responseBody, isPending } = useQuery({
        queryKey: ["Blogs"],
        queryFn: async () => {
            const Response = await axiosInstance.get<ApiResponse>("/articles");
            return Response.data;
        }
    });


    return (
        <div className='grid grid-cols-3 container mx-auto p-4 gap-8'>
            {isPending && (<div className='text-center my-16 col-span-3 '><p className=' font-bold text-2xl'>Loading...</p></div>)}

            {responseBody?.data?.map((item) => {
                return <BlogCard key={item.id} blog={item} />
            })}
        </div>
    )
}

export default BlogList