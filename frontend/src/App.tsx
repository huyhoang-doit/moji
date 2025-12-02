import { BrowserRouter, Route, Routes } from 'react-router';
import SignUpPage from './pages/SignUpPage';
import ChatAppPage from './pages/ChatAppPage';
import { Toaster } from 'sonner';
import SignInPage from './pages/SignInPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useThemeStore } from './stores/useThemeStore';
import { useEffect } from 'react';
function App() {
      // handle theme here
    const { isDark, setTheme } = useThemeStore();
    useEffect(() => {
        // on initial load, set the theme based on the store value
        setTheme(isDark);
    }, []); // run only once on mount
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        {/* public router */}
        <Routes>
          <Route path='/signin' element={<SignInPage />} />
          <Route path='/signup' element={<SignUpPage />} />

          {/* private router */}
          <Route element={<ProtectedRoute />}>
            <Route path='/' element={<ChatAppPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
