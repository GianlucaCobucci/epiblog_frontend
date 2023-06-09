import React, { useState, useEffect } from 'react';
import PostCard from '../Components/PostCard';
import NavigationBar from '../Components/Navbar';
import Footer from '../Components/Footer';

const PostsList = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [visiblePosts, setVisiblePosts] = useState(3); // Numero iniziale di post visibili
  const [totalPosts, setTotalPosts] = useState(0); // Numero totale di post

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const response = await fetch(`${process.env.REACT_APP_API_URL}/posts`,{
      headers:{
        "auth": JSON.parse(localStorage.getItem("loggedIn")).token
        }
    });
    const data = await response.json()
    if(response.ok){
    setData(data)
    setTotalPosts(data.posts.length)
    }
    setIsLoading(false)
  };

  const handleLoadMore = () => {
    setVisiblePosts(prevVisiblePosts => prevVisiblePosts + 3);
  };

  const getVisiblePosts = () => {
    if (data && data.posts) {
      return data.posts.slice(0, visiblePosts);
    }
    return [];
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavigationBar currentPage="posts" />
      <div className="container mt-5">
        <h1 className="text-center mb-4">Lista di post</h1>
        <div className="row">
          {getVisiblePosts().map((post) => {
            return (
              <div className="col-lg-4 col-md-6 mb-4" key={post._id}>
                <PostCard post={post} />
              </div>
            );
          })}
        </div>
        {visiblePosts < totalPosts && (
          <div className="text-center">
            <button className="btn btn-secondary mb-5" onClick={handleLoadMore}>Carica altri</button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PostsList;



