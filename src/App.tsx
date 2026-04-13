import { useEffect, useState } from 'react';
import { RouterProvider, useRouter } from './hooks/useRouter';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { BlogPage } from './pages/BlogPage';
import { BooksPage } from './pages/BooksPage';
import { VideosPage } from './pages/VideosPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { supabase } from './lib/supabase';

function AppContent() {
  const { route } = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAdmin(!!data.session);
      setCheckingAuth(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (checkingAuth && (route === '/admin' || route === '/admin/login')) {
    return (
      <div className="min-h-screen bg-[#060b17] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  const isAdminRoute = route === '/admin' || route === '/admin/login';

  if (isAdminRoute) {
    if (route === '/admin/login') return <AdminLoginPage />;
    if (route === '/admin') return isAdmin ? <AdminDashboardPage /> : <AdminLoginPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#080d1a]">
      <Header />
      <main className="flex-1">
        {route === '/' && <HomePage />}
        {route === '/blog' && <BlogPage />}
        {route === '/books' && <BooksPage />}
        {route === '/videos' && <VideosPage />}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}
