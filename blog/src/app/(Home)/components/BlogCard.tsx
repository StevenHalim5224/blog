import { Blog } from '@/types/blog'
import Image from 'next/image'
import { format } from 'date-fns'
import Link from 'next/link'
interface BlogCardProps {
    blog: Blog

}
export const BlogCard = (props: BlogCardProps) => {
    return (
        <Link href = {`/article/${props.blog.id}`}>
            <div className='border p-8 rounded-3xl space-y-2'>
                {props.blog.imageUrl && props.blog.imageUrl !== "" ? (
                    <Image
                        src={props.blog.imageUrl}
                        alt= "gambar"
                        width={500}
                        height={300}
                        className='object-cover w-full h-75 rounded-md'
                    />
                ) : (
                    <div className= "w-full h-75 bg-gray-200 flex items-center justify-center text-grey-500 rounded-md">
                        No Image Available
                    </div>
                )}
                <p className='bg-green-500 w-fit text-black px-4 font-bold text-sm rounded-sm'>
                    {props.blog?.category}
                </p>
                <h2 className='font-bold text-lg line-clamp-2'>
                    {props.blog?.title}
                </h2>
                <p className='text-xs'>{format(new Date(props.blog.createdAt || new Date()), "dd-MMMM-yyyy")} - {props.blog?.author?.name}</p>
                <div 
                    className='line-clamp-3 text-sm text-gray-600'
                    dangerouslySetInnerHTML={{__html: props.blog?.content}}
                />
            </div>
        </Link>
    )
}

export default BlogCard