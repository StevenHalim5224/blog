import { Blog } from '@/types/blog'
import Image from 'next/image'
import { format } from 'date-fns'
import Link from 'next/link'
interface BlogCardProps {
    blog: Blog

}
export const BlogCard = (props: BlogCardProps) => {
    return (
        <Link href = {`/article/${props.blog.objectId}`}>
            <div className='border p-8 rounded-3xl space-y-2'>
                <Image src={props.blog.Thumbnail} alt="gambar" width={500} height={300} />
                <p className='bg-green-500 w-fit text-black px-4 font-bold text-sm rounded-sm'>
                    {props.blog?.Category}
                </p>
                <h2 className='font-bold text-lg line-clamp-2'>
                    {props.blog?.Title}
                </h2>
                <p className='text-xs'>{format(new Date(props.blog.created), "dd-MMMM-yyyy")} - {props.blog?.Author}</p>
                <p className='line-clamp-3'>
                    {props.blog?.Description}
                </p>
            </div>
        </Link>
    )
}

export default BlogCard