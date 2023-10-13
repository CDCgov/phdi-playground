import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UploadFile from './pages/UploadFile';

function App() {
  return (
    <div >
      <BrowserRouter>
        <Routes>
          <Route index element={<UploadFile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
