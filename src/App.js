import './App.css';
import {Routes,Route} from "react-router-dom"
import Navbar from './Navbar/Navbar';
import Home from './pages/home';
import Favorites from './pages/Favorites';
import Podcast from './pages/podcast';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/podcast/:id" element={<Podcast />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </div>
  );
}

export default App;
