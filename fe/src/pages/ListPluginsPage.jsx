import { useState, useEffect } from "react";
import axios from "axios";
import {
  ListGroup,
  FormControl,
  InputGroup,
  Card,
  Row,
  Col,
} from "react-bootstrap";

const ListPluginsPage = () => {
  const [plugins, setPlugins] = useState([]);
  const [searchRegex, setSearchRegex] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/all-plugins")
      .then((response) => setPlugins(response.data.plugins))
      .catch((error) => console.error("Error fetching plugins:", error));
  }, []);

  const handleSearchChange = (e) => setSearchRegex(e.target.value);

  const filteredPlugins = plugins.filter((plugin) =>
    plugin.toLowerCase().includes(searchRegex.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <Row>
        <Col md={8} className="mx-auto">
          <Card className="shadow-lg">
            <Card.Body>
              <Card.Title className="text-center">List of Plugins</Card.Title>
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Search Plugins"
                  value={searchRegex}
                  onChange={handleSearchChange}
                />
              </InputGroup>
              <ListGroup variant="flush">
                {filteredPlugins.length === 0 ? (
                  <ListGroup.Item>No plugins found</ListGroup.Item>
                ) : (
                  filteredPlugins.map((plugin, index) => (
                    <ListGroup.Item key={index}>{plugin}</ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ListPluginsPage;
