import { useState } from "react";
import { Card, Form, Button, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";

const AddPatternPage = () => {
  const [regexName, setRegexName] = useState("");
  const [regexPattern, setRegexPattern] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  const handleSubmit = (e) => {
    e.preventDefault();

    // API call to add regex
    axios
      .post("http://127.0.0.1:5000/api/add-regex", {
        name: regexName,
        pattern: regexPattern,
      })
      .then((response) => {
        setAlert({
          show: true,
          message: response.data.message,
          variant: "success",
        });
        setRegexName("");
        setRegexPattern("");
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message ||
          "An error occurred while adding regex.";
        setAlert({
          show: true,
          message: errorMessage,
          variant: "danger",
        });
      });
  };

  return (
    <div className="container mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-lg">
            <Card.Body>
              <Card.Title className="text-center">Add Regex</Card.Title>
              {alert.show && (
                <Alert
                  variant={alert.variant}
                  onClose={() => setAlert({ ...alert, show: false })}
                  dismissible
                >
                  {alert.message}
                </Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="regexName" className="mb-3">
                  <Form.Label>Regex Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Regex Name"
                    value={regexName}
                    onChange={(e) => setRegexName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="regexPattern" className="mb-3">
                  <Form.Label>Regex Pattern</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter Regex Pattern"
                    value={regexPattern}
                    onChange={(e) => setRegexPattern(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                  Add Regex
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AddPatternPage;
