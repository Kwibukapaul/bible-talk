import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

type Route = '/' | '/blog' | '/books' | '/videos' | '/admin' | '/admin/login';

interface RouterContextValue {
  route: Route;
  navigate: (to: Route) => void;
}

const RouterContext = createContext<RouterContextValue>({
  route: '/',
  navigate: () => {},
});

function getRoute(): Route {
  const hash = window.location.hash.replace('#', '') || '/';
  const validRoutes: Route[] = ['/', '/blog', '/books', '/videos', '/admin', '/admin/login'];
  return validRoutes.includes(hash as Route) ? (hash as Route) : '/';
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(getRoute);

  useEffect(() => {
    const handleHashChange = () => setRoute(getRoute());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (to: Route) => {
    window.location.hash = to;
    setRoute(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <RouterContext.Provider value={{ route, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  return useContext(RouterContext);
}
