"use client";

import { Blog } from '@/types/blog';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BlogCard } from './BlogCard';

const BlogList = () => {
    const [blog, setBlog] = useState<Blog[]>([]);

    const [loading, setLoading] = useState<boolean>(true);

    const getBlog = async () => {
        try {
            const result = await axios.get("https://brightmitten-us.backendless.app/api/data/blogs?sortBy=%60created%60%20desc");

            setBlog(result.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getBlog();
    }, [])


    return (
        <div className='grid grid-cols-3 container mx-auto p-4 gap-8'>
            {loading && (<div className='text-center my-16 col-span-3 '><p className=' font-bold text-2xl'>Loading...</p></div>)}

            {blog.map((blog) => {
                return <BlogCard key={blog.objectId} blog={blog} />
            })}
        </div>
    )
}

export default BlogList