import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Users from './pages/Users';
import Posts from './pages/Posts';
import Login from './pages/Login';
import { AuthProvider } from './contexts/userContext';

function App() {
  return (
    <>
      <AuthProvider>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </>
  );
}

export default App;
