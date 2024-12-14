import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({_id, title, summary, cover, content, category, createdAt, author}) => {
  
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <img src={cover} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-blue-500 text-white text-sm px-2 py-1 rounded-full">
            {category}
          </span>
          <time className="text-sm text-gray-500 dark:text-gray-300">{formattedDate}</time>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          <Link to={`/post/${_id}`} className="hover:underline">
            {title}
          </Link>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{summary}</p>
        <p className="text-sm text-gray-500 dark:text-gray-300">By {author?.username || "Unknown"}</p>
      </div>
    </div>
  );
};

export default BlogCard;
