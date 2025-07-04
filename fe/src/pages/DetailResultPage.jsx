import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Row,
  Col,
  ListGroup,
  Button,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { FaArrowLeft, FaClipboard } from "react-icons/fa";

const DetailResultPage = () => {
  const { resultId } = useParams(); // Get the result ID from the URL
  const [result, setResult] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    // Fetch result details by ID
    axios
      .get(`http://127.0.0.1:5000/api/result/${resultId}`)
      .then((response) => setResult(response.data))
      .catch((error) => console.error("Error fetching result:", error));
  }, [resultId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.re_pattern);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const openInVSCode = (filePath, line) => {
    const vscodeUrl = `vscode://file/${filePath}:${line}`;
    window.open(vscodeUrl, "_blank");
  };

  if (!result) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  const { name, vuln_name, re_pattern, plugins } = result;

  return (
    <div className="container mt-5">
      <Row>
        <Col md={8} className="mx-auto">
          <Card className="shadow-lg border-0">
            <Card.Body>
              {/* Back Button in the card */}
              <div className="d-flex justify-content-start mb-3">
                <Link to="/results">
                  <Button
                    variant="outline-secondary"
                    className="d-flex align-items-center"
                  >
                    <FaArrowLeft className="mr-2" />
                  </Button>
                </Link>
              </div>

              <Card.Title className="text-center text-primary">
                {name}
              </Card.Title>
              <Card.Text className="text-center text-muted mb-3">
                {vuln_name}
              </Card.Text>

              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>Regex Pattern:</strong>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip>
                      {copySuccess ? "Copied!" : "Copy to clipboard"}
                    </Tooltip>
                  }
                >
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="position-relative"
                    onClick={handleCopy}
                    style={{ marginTop: "-8px" }} // Adjust icon position further up
                  >
                    <FaClipboard />
                  </Button>
                </OverlayTrigger>
              </div>
              <pre className="bg-light p-3 rounded">
                <code>{re_pattern}</code>
              </pre>

              {/* Plugins List */}
              <h5 className="mb-4">Scanned Plugins:</h5>
              {plugins.map((plugin, idx) => (
                <ListGroup key={idx} className="mb-3">
                  <ListGroup.Item className="p-4 border-0 shadow-sm rounded-lg">
                    <Row className="g-0">
                      <Col md={9} className="plugin-content w-100">
                        <strong className="d-block text-primary">
                          {plugin.plugin_name}
                        </strong>
                        {plugin.details.map((detail, i) => (
                          <div key={i} className="plugin-detail mt-2">
                            <div className="text-muted">
                              <strong>Location → </strong>{" "}
                              <a
                                href="#"
                                onClick={() =>
                                  openInVSCode(detail.floc, detail.line || 1)
                                }
                                style={{
                                  color: "#007bff",
                                  textDecoration: "none",
                                  cursor: "pointer",
                                }}
                              >
                                {detail.floc}:{detail.line || 1}
                              </a>
                            </div>
                            <div className="code-block">
                              <div className="line-numbers">
                                {detail.line || 1}
                              </div>
                              <pre className="code-content">
                                <code>{detail.detail}</code>
                              </pre>
                            </div>
                          </div>
                        ))}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DetailResultPage;
