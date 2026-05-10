import { RouterProvider } from 'react-router';
import { router } from './routes';
import { LanguageProvider } from '../context/LanguageContext';
import { UserProvider } from '../context/UserContext';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <LanguageProvider>
      <UserProvider>
        <RouterProvider router={router} />
        <Toaster position="bottom-right" theme="system" />
      </UserProvider>
    </LanguageProvider>
  );
}