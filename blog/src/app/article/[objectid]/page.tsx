import Navbar from "@/components/Navbar";
import { Blog } from "@/types/blog";
import { format } from "date-fns";
import Image from "next/image";
import { cache } from "react";
import DeleteButton from "@/components/deleteButton";
import { axiosInstance } from "@/lib/axios";
import Link from "next/link";
import ArticleActions from "@/components/articleAction";

interface ArticleDetailprops {
  params: Promise<{ objectid: string }>;
}

const getArticle = cache(async (objectid: string) => {
  try{
    const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/articles`,{
      headers:{
        'Cache-Control': 'no-store'
      }
    });
    return response.data.data as Blog;
  } catch (error) {
    console.error("failed to fetch article", error);
    return null;
  }
});

export const generateMetadata = async (props: ArticleDetailprops) => {
  const { objectid } = await props.params;
  const blog = await getArticle(objectid);

  return {
    title: blog?.title,
    category: blog?.category,
    description: blog?.content,
    openGraph: {
      images: blog?.imageUrl
    }
  }
}

const ArticleDetail = async (props: ArticleDetailprops) => {
  const { objectid } = await props.params;
  const blog = await getArticle(objectid);
  if (!blog ) {
    return (
      <div>
        <Navbar />
        <div className="text-center mt-20 font-bold text-2xl">
          Article not found or has been deleted.
        </div>
      </div>
    );
  }
  return(

    <div>
      <Navbar />
      <div className="mx-auto container max-w-5xl space-y-2">
        <p className="w-fit rounded-sm bg-green-500 px-4 text-sm font-bold text-black">
          {blog.category}
        </p>
        <h1 className="font-bold text-5xl">{blog.title}</h1>
        <p className="font-light text-xm">{format(new Date(blog.createdAt || new Date()), "dd-MMMM-yyyy")} - {blog.author?.name || "unknown author"}</p>
        <div className="flex gap-3 mt-4 mb-2">
          {blog.prepTime && (
            <span className="bg-orange-100 text-orange-800 text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1">
               {blog.prepTime}
            </span>
          )}

          {blog.difficulty &&(
            <span className="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full flex item-center gap-1">
              {blog.difficulty}
            </span>
          )}
        </div>
        {blog.imageUrl && blog.imageUrl !== "" ? (
          <div className = " relative h-[300px] md:h-[450px] w-full bg-gray-200  flex items-center justify-center text-gray-500 rounded-xl mt-6 mb-6 overflow-hidden">
          <Image src={blog.imageUrl} alt={blog.title} className="object-cover" fill />
          </div>
        ) : (
          <div className="h-[300px] md:h-[450px] w-full bg-gray-200 flex items-center justify-center text-gray-500 rounded-xl mt-6 mb-6">
            No Image Available
          </div>
        )}
        <div className="leading-relaxed text-lg prose max-w-none"
          dangerouslySetInnerHTML={{__html: blog.content}}
        />

        <ArticleActions objectId={objectid} authorId={blog.authorId}/>
        
        </div>
      </div>
)
};

export default ArticleDetail;
