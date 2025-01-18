import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import Index from "./Index.jsx";
import Datatable from "./Datatable.jsx";
import Header from "./Header.jsx";
import '../Styles/App.css';

function App() {

  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return (
      <>
        <Header/>
        <div>Loading...</div>
      </>
    );
  }

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/index" />} />
        <Route path="/index" element={<Index/>} />
        <Route path="/datatable" element={<Datatable/>} />
      </Routes>
    </Router>
  );
}

export default App;