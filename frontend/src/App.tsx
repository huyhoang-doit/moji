import { BrowserRouter, Route, Routes } from 'react-router';
import SignUpPage from './pages/SignUpPage';
import ChatAppPage from './pages/ChatAppPage';
import { Toaster } from 'sonner';
import SignInPage from './pages/SignInPage';
function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        {/* public router */}
        <Routes>
          <Route path='/signin' element={<SignInPage />} />
          <Route path='/signup' element={<SignUpPage />} />

          {/* private router */}
          <Route path='/' element={<ChatAppPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
