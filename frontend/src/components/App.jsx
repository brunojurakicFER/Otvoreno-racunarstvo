import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import Index from "./Index.jsx";
import Datatable from "./Datatable.jsx";
import Header from "./Header.jsx";
import authConfig from '../../auth_config.json';
import '../Styles/App.css';

function App() {
  return (
    <Auth0Provider
      domain={authConfig.domain}
      clientId={authConfig.clientId}
      authorizationParams={{
        redirect_uri: 'http://localhost:5173/index',
        audience: authConfig.audience
      }}
    >
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/index" />} />
          <Route path="/index" element={<Index />} />
          <Route path="/datatable" element={<Datatable />} />
        </Routes>
      </Router>
    </Auth0Provider>
  );
}

export default App;
