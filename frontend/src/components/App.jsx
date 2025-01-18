import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import Index from "./Index.jsx";
import Datatable from "./Datatable.jsx";
import Header from "./Header.jsx";
import '../Styles/App.css';

function App() {
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
