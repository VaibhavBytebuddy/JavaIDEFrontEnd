// src/components/Editor/Editor.tsx
import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { Button, Container, Row, Col, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CodeEditor() {
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [code, setCode] = useState('// Write your Java code here');

  useEffect(() => {
    axios.get('/api/files')
      .then(res => setFiles(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSave = () => {
    axios.post('/api/files', {
      filename: selectedFile?.filename || 'NewFile.java',
      content: code
    }).then(res => {
      setFiles([...files, res.data]);
    });
  };

  return (
    <Container fluid className="mt-3">
      <Row>
        <Col md={3}>
          <ListGroup>
            {files.map(file => (
              <ListGroup.Item 
                key={file.id}
                active={selectedFile?.id === file.id}
                onClick={() => {
                  setSelectedFile(file);
                  setCode(file.content);
                }}
              >
                {file.filename}
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Button variant="primary" className="mt-2" onClick={handleSave}>
            Save
          </Button>
        </Col>
        <Col md={9}>
          <Editor
            height="80vh"
            defaultLanguage="java"
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
          />
        </Col>
      </Row>
    </Container>
  );
}