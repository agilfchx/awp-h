import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FormControl,
  InputGroup,
  Card,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { FaTrash } from "react-icons/fa";

const ListResultsPage = () => {
  const [results, setResults] = useState([]);
  const [searchRegex, setSearchRegex] = useState("");

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = () => {
    axios
      .get("http://127.0.0.1:5000/api/all-results")
      .then((response) => setResults(response.data["list_results"]))
      .catch((error) => console.error("Error fetching results:", error));
  };

  const handleSearchChange = (e) => setSearchRegex(e.target.value);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this result?")) {
      axios
        .delete(`http://127.0.0.1:5000/api/remove-result/${id}`)
        .then(() => {
          // Filter the result from the current state
          setResults((prevResults) =>
            prevResults.filter((result) => result.id !== id)
          );
        })
        .catch((error) => console.error("Error deleting result:", error));
    }
  };

  const filteredResults = results.filter((result) =>
    result.name.toLowerCase().includes(searchRegex.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <Row>
        <Col md={8} className="mx-auto">
          <Card className="shadow-lg">
            <Card.Body>
              <Card.Title className="text-center">List of Results</Card.Title>
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Search Results"
                  value={searchRegex}
                  onChange={handleSearchChange}
                  className="border rounded"
                />
              </InputGroup>

              <div className="mt-4">
                {filteredResults.length === 0 ? (
                  <div className="text-center">No results found</div>
                ) : (
                  filteredResults.map((result) => (
                    <Card
                      key={result.id}
                      className="mb-3 hover-card"
                      style={{ cursor: "pointer" }}
                    >
                      <Card.Body>
                        <Row>
                          <Col xs={10}>
                            <Link
                              to={`/result/${result.id}`}
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                              }}
                            >
                              <Card.Title>{result.name}</Card.Title>
                              <Card.Text>{result.vuln_name}</Card.Text>
                            </Link>
                          </Col>
                          <Col
                            xs={2}
                            className="d-flex align-items-center justify-content-end"
                          >
                            <Button
                              variant="link"
                              onClick={() => handleDelete(result.id)}
                              style={{ color: "red", padding: 0 }}
                            >
                              <FaTrash size={20} />
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ListResultsPage;
