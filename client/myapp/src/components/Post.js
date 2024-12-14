import React, { useEffect, useState } from 'react';
import BlogCard from './BlogCard';

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/post`).then(response => {
      response.json().then(posts => {
        setPosts(posts);
        setFilteredPosts(posts); // Initialize filtered posts
      });
    });
  }, []);

  // Filter posts when search query or category changes
  useEffect(() => {
    const filtered = posts.filter((post) => {
      const matchesQuery = post.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? post.category === selectedCategory : true;
      return matchesQuery && matchesCategory;
    });
    setFilteredPosts(filtered);
    console.log(filtered);
  }, [searchQuery, selectedCategory, posts]);

  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gray-800">
      {/* Search and Filter Section */}
      <div className="mb-8 flex flex-col items-center gap-4">
       

        {/* Category Filters */}
        <div className="pt-4 flex items-center justify-evenly gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="category"
              value=""
              checked={selectedCategory === ''}
              onChange={() => setSelectedCategory('')}
              className="form-radio h-5 w-5 text-blue-500 dark:text-blue-300"
            />
            <span className="text-gray-700 dark:text-gray-300">All</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="category"
              value="Technology"
              checked={selectedCategory === 'Technology'}
              onChange={() => setSelectedCategory('Technology')}
              className="form-radio h-5 w-5 text-blue-500 dark:text-blue-300"
            />
            <span className="text-gray-700 dark:text-gray-300">Technology</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="category"
              value="Design"
              checked={selectedCategory === 'Design'}
              onChange={() => setSelectedCategory('Design')}
              className="form-radio h-5 w-5 text-blue-500 dark:text-blue-300"
            />
            <span className="text-gray-700 dark:text-gray-300">Design</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="category"
              value="Sports"
              checked={selectedCategory === 'Sports'}
              onChange={() => setSelectedCategory('Sports')}
              className="form-radio h-5 w-5 text-blue-500 dark:text-blue-300"
            />
            <span className="text-gray-700 dark:text-gray-300">Sport</span>
          </label>
        </div>
      </div>

      
      <div className="pt-10 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => <BlogCard key={post._id} {...post} />)
        ) : (
          <div className="text-gray-700 dark:text-gray-300 col-span-full text-center">
            No posts found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
