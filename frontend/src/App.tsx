import { BrowserRouter, Route, Routes } from 'react-router';
import SignUpPage from './pages/SignUpPage';
import ChatAppPage from './pages/ChatAppPage';
import { Toaster } from 'sonner';
import SignInPage from './pages/SignInPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useThemeStore } from './stores/useThemeStore';
import { useEffect } from 'react';
import { useAuthStore } from './stores/useAuthStore';
import { useSocketStore } from './stores/useSocketStore';
function App() {
  // handle theme here
  const { isDark, setTheme } = useThemeStore();
  const { accessToken } = useAuthStore()
  const { connectSocket, disconnectSocket } = useSocketStore()
  useEffect(() => {
    // on initial load, set the theme based on the store value
    setTheme(isDark);
  }, [isDark]); // run only once on mount

  // Theo doi thay doi cua accessToken de ket noi socket
  useEffect(() => {
    if (accessToken) {
      connectSocket();
    } else {
      disconnectSocket();
    }
    // clean up function
    // khi component unmount hoac accessToken thay doi (useEffect chay lai)
    return () => {
      disconnectSocket();
    }
  }, [accessToken]);


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
