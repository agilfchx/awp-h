import { Card, Row, Col } from "react-bootstrap";
import reloadCatGif from "../assets/reload-cat.gif";

const LoadingPage = () => {
  return (
    <div className="container mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-lg text-center">
            <Card.Body>
              <Card.Title>
                Loading <span className="dot-animation"></span>
              </Card.Title>
              <img
                src={reloadCatGif}
                alt="Loading"
                style={{ width: "100px", marginTop: "20px" }}
              />
              <p className="mt-3">Please wait while we process your request.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LoadingPage;
