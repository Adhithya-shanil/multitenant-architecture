import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import StorePage from './pages/StorePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:handle" element={<StorePage />} />
      </Routes>
    </BrowserRouter>
  );
}
