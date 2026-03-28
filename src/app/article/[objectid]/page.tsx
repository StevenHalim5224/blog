import Navbar from "@/components/Navbar";
import { Blog } from "@/types/blog";
import { format } from "date-fns";
import Image from "next/image";
import { cache } from "react";
import DeleteButton from "@/components/deleteButton";

interface ArticleDetailprops {
  params: Promise<{ objectid: string }>;
}

const getArticle = cache(async (objectid: string) => {
  const response = await fetch(`https://brightmitten-us.backendless.app/api/data/blogs/${objectid}`);
  const blog: Blog = await response.json();
  return blog
});

export const generateMetadata = async (props: ArticleDetailprops) => {
  const { objectid } = await props.params;
  const blog = await getArticle(objectid);

  return {
    title: blog.Title,
    description: blog.Description,
    openGraph: {
      images: blog.Thumbnail
    }
  }
}

const ArticleDetail = async (props: ArticleDetailprops) => {
  const { objectid } = await props.params;
  const blog = await getArticle(objectid);
  return (
    <div>
      <Navbar />
      <div className="mx-auto container max-w-5xl space-y-2">
        <p className="w-fit rounded-sm bg-green-500 px-4 text-sm font-bold text-black">
          {blog.Category}
        </p>
        <h1 className="font-bold text-5xl">{blog.Title}</h1>
        <p className="font-light text-xm">{format(new Date(blog.created), "dd-MMMM-yyyy")} - {blog.Author}</p>
        <div className="h-[260px] relative w-full rounded-xl overflow-hidden">
          <Image src={blog.Thumbnail} alt="Thumbnail" className="object-cover" fill />
        </div>
        <p>
          {blog.Content}
        </p>

        <div className="mt-8 mb-8">
          <DeleteButton objectId={objectid} />
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
