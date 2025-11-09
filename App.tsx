import React from 'react';
import useAuth from './hooks/useAuth';
import useTheme from './hooks/useTheme';
import Auth from './components/Auth';
import TradingJournal from './components/TradingJournal';

const App: React.FC = () => {
  const { user, logout, loading, loginWithGoogle, login, signup } = useAuth();
  const [theme, toggleTheme] = useTheme();

  if (loading) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary text-xl font-bold">Loading...</div>
      </div>
    );
  }

  if (user) {
    // The user object from `useAuth` (firebase.User) has the required properties.
    const journalUser = {
      uid: user.uid,
      email: user.email
    };
    return <TradingJournal user={journalUser} logout={logout} theme={theme} toggleTheme={toggleTheme} />;
  }

  return <Auth login={login} signup={signup} loginWithGoogle={loginWithGoogle} />;
};

export default App;
