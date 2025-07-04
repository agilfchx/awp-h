import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ListResultsPage from "./pages/ListResultsPage";
import ListPluginsPage from "./pages/ListPluginsPage";
import AddPaternPage from "./pages/AddPatternPage";
import DetailResultPage from "./pages/DetailResultPage";
import LoadingPage from "./pages/LoadingPage";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        sticky="top"
        className="shadow-sm"
      >
        <Container>
          <Navbar.Brand href="/">EHEK</Navbar.Brand>
          <Nav className="ms-auto">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/add-pattern"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Add Pattern
            </NavLink>
            <NavLink
              to="/plugins"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Plugins
            </NavLink>
            <NavLink
              to="/results"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Results
            </NavLink>
          </Nav>
        </Container>
      </Navbar>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/results" element={<ListResultsPage />} />
        <Route path="/plugins" element={<ListPluginsPage />} />
        <Route path="/add-pattern" element={<AddPaternPage />} />
        <Route path="/result/:resultId" element={<DetailResultPage />} />
        <Route path="/loading" element={<LoadingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
