import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { router } from './routes';
import { ThemeProvider } from './hooks/useTheme';
import { GraphProvider } from './hooks/useGraphContext';

export default function App() {
  return (
    <ThemeProvider>
      <GraphProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--c-bg-card)',
              border: '1px solid var(--c-border-accent)',
              color: 'var(--c-text-main)',
              fontFamily: "'DM Sans', sans-serif",
            },
          }}
        />
      </GraphProvider>
    </ThemeProvider>
  );
}
