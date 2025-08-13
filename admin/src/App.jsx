import React, { useState } from 'react';
import PasswordModal from './components/PasswordModal';
import ControlCenter from './components/ControlCenter';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="App">
      {!isAuthenticated ? (
        <PasswordModal onAuthenticate={setIsAuthenticated} />
      ) : (
        <ControlCenter />
      )}
    </div>
  );
}

export default App;
