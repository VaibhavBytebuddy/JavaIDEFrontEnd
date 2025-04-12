import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, ListGroup, Form } from 'react-bootstrap';
import { Editor } from '@monaco-editor/react';
import OutputPanel from './OutputPanel';
import './styles.css';

const CodeEditor = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>();
  const [code, setCode] = useState('// Write your Java code here\nimport java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner scanner = new Scanner(System.in);\n    System.out.println("Enter your name:");\n    String name = scanner.nextLine();\n    System.out.println("Hello, " + name + "!");\n  }\n}');
  const [fileName, setFileName] = useState('Main.java');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState({
    output: '',
    error: '',
    executionTime: 0
  });
  const [activeTab, setActiveTab] = useState('output');
  const [shouldScroll, setShouldScroll] = useState(false);
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const response = await axios.get('/api/files');
      setFiles(response.data);
    } catch (err) {
      console.error('Error loading files:', err);
    }
  };

  const handleFileSelect = (file: any) => {
    setSelectedFile(file);
    setCode(file.content);
    setFileName(file.filename);
  };

  const handleSave = async () => {
    try {
      const fileData = {
        filename: fileName,
        content: code
      };

      const response = selectedFile?.id
        ? await axios.put(`/api/files/${selectedFile.id}`, fileData)
        : await axios.post('/api/files', fileData);

      loadFiles();
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    setExecutionResult({
      output: '',
      error: '',
      executionTime: 0
    });
    setShouldScroll(false);

    try {
      const response = await axios.post('/api/execute', { 
        code,
        input: userInput ,
        
      });
      const result = {
        output: response.data.output,
        error: response.data.error,
        executionTime: response.data.executionTime
      };

      setExecutionResult(result);
      setShouldScroll(true);

      if (result.error) {
        setActiveTab('errors');
      } else {
        setActiveTab('output');
      }
    } catch (err: any) {
      setExecutionResult({
        output: '',
        error: 'Failed to execute code: ' + err.message,
        executionTime: 0
      });
      setActiveTab('errors');
      setShouldScroll(true);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleNewFile = () => {
    setSelectedFile(null);
    setCode('// Write your Java code here\nimport java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner scanner = new Scanner(System.in);\n    System.out.println("Enter your name:");\n    String name = scanner.nextLine();\n    System.out.println("Hello, " + name + "!");\n  }\n}');
    setFileName('Main.java');
    setUserInput('');

  };

  return (
    <Container fluid className="editor-container">
      <Row>
        <Col md={3} className="file-list-container pe-3">
          <div className="button-group">
            <Button variant="primary" onClick={handleSave} size="sm">
              Save
            </Button>
            <Button 
              variant="success" 
              onClick={handleExecute}
              disabled={isExecuting}
              size="sm"
            >
              {isExecuting ? 'Running...' : 'Run'}
            </Button>
            <Button 
              variant="outline-secondary" 
              onClick={handleNewFile}
              size="sm"
            >
              New
            </Button>
          </div>
          
          <ListGroup className="file-list">
            {files.map(file => (
              <ListGroup.Item
                key={file.id}
                action
                active={selectedFile?.id === file.id}
                onClick={() => handleFileSelect(file)}
              >
                {file.filename}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        
        <Col md={9}>
          <Form.Control
            className="filename-input mb-3"
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Filename (e.g., Main.java)"
          />
          
          <div className="monaco-editor-container">
            <Editor
              height="100%"
              language="java"
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: true,
              }}
            />
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Program Input (for Scanner)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={userInput}
          
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter input before running the program"
            />
          </Form.Group>
          
          <OutputPanel
            output={executionResult.output}
            error={executionResult.error}
            executionTime={executionResult.executionTime}
            activeKey={activeTab}
            onTabSelect={setActiveTab}
            shouldScroll={shouldScroll}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CodeEditor;