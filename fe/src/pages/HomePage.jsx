// HomePage.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  Card,
  Form,
  InputGroup,
  FormControl,
  Row,
  Col,
  Button,
  ListGroup,
} from "react-bootstrap";
import axios from "axios";
import { FaTrash } from "react-icons/fa";

const HomePage = () => {
  const [searchRegex, setSearchRegex] = useState("");
  const [regexList, setRegexList] = useState([]);
  const [selectedRegex, setSelectedRegex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/all-regex")
      .then((response) => setRegexList(response.data.list_regex))
      .catch((error) => console.error("Error fetching regexes:", error));
  }, []);

  const handleRemoveRegex = (id, e) => {
    e.stopPropagation();
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this regex?"
    );
    if (confirmDelete) {
      axios
        .delete(`http://127.0.0.1:5000/api/remove-regex/${id}`)
        .then(() =>
          setRegexList((prev) => prev.filter((regex) => regex.id !== id))
        )
        .catch((error) => console.error("Error removing regex:", error));
    }
  };

  const handleExecute = () => {
    if (searchRegex || selectedRegex) {
      navigate("/loading");
      setTimeout(() => {
        axios
          .post("http://127.0.0.1:5000/api/execute", {
            search_regex: searchRegex,
            regex_id: selectedRegex,
          })
          .then((response) => {
            console.log("Execution response:", response.data);

            // Setelah eksekusi selesai, arahkan ke halaman hasil dengan ID
            const resultId = response.data.result.id;
            navigate(`/result/${resultId}`); // Redirect ke halaman hasil menggunakan ID
          })
          .catch((error) => {
            console.error("Error executing search:", error);
          });
      }, 2000); // 2000ms = 2 seconds delay before sending request
    } else {
      alert("No search term or regex selected.");
    }
  };

  return (
    <div className="container mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-lg">
            <Card.Body>
              <Card.Title className="text-center">AWP-H</Card.Title>
              <Form>
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Custom Regex"
                    value={searchRegex}
                    onChange={(e) => {
                      setSearchRegex(e.target.value);
                      setSelectedRegex(null); // Reset selected regex when searching
                    }}
                  />
                </InputGroup>
              </Form>
              <div className="mt-4">
                <h5>Saved Regexes</h5>
                <ListGroup>
                  {regexList.map((regex) => (
                    <ListGroup.Item
                      key={regex.id}
                      onClick={() => {
                        if (!searchRegex) setSelectedRegex(regex.id);
                      }}
                      style={{
                        cursor: searchRegex ? "not-allowed" : "pointer",
                        backgroundColor:
                          selectedRegex === regex.id && !searchRegex
                            ? "#d1ecf1"
                            : "",
                        opacity: searchRegex ? 0.6 : 1,
                      }}
                    >
                      <Row>
                        <Col xs={10}>
                          <strong>{regex.name}</strong> <br />
                          <code>{regex.pattern}</code>
                        </Col>
                        <Col xs={2} className="text-end">
                          <FaTrash
                            style={{ color: "red", cursor: "pointer" }}
                            onClick={(e) => handleRemoveRegex(regex.id, e)}
                          />
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <Row className="mt-3">
                  <Col>
                    <Button
                      variant="success"
                      className="w-100"
                      onClick={handleExecute}
                    >
                      Go
                    </Button>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
