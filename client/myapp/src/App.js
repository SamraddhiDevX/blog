import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from './context/ThemeContext';
import Login from './components/Login';
import Register from './components/Register';
import Layout from './Layout';
import Post from './components/Post';
import { UserContextProvider } from './context/UserContext';
import CreatePost from './pages/CreatePost';
import CreatePostPage from './pages/CreatePostPage';
import EditPost from './pages/EditPost';
import PageNotFound from './pages/PageNotFound';

function App() {
  const { theme } = useTheme();

  // Set body background based on theme
  useEffect(() => {
    document.body.style.backgroundColor = theme === 'dark' ? '#1E293B' : '#FFFFFF'; // Adjust colors as per your design
    document.body.style.color = theme === 'dark' ? '#FFFFFF' : '#000000'; // Optional for text color
    document.body.style.margin = 0; // Remove any default margins
  }, [theme]);

  return (
    <UserContextProvider>
      <ToastContainer theme={theme === 'dark' ? 'dark' : 'light'} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Post />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/createpost" element={<CreatePost />} />
          <Route path="/post/:id" element={<CreatePostPage />} />
          <Route path="/editpost/:id" element={<EditPost />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
