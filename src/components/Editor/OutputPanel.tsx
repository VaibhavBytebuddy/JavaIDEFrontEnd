import { Card, Tab, Tabs } from 'react-bootstrap';
import { useEffect, useRef } from 'react';
import './styles.css';

interface OutputPanelProps {
  output: string;
  error: string;
  executionTime: number;
  activeKey: string;
  onTabSelect: (key: string) => void;
  shouldScroll: boolean;
}

export default function OutputPanel({ 
  output, 
  error, 
  executionTime, 
  activeKey, 
  onTabSelect,
  shouldScroll
}: OutputPanelProps) {
  const outputEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldScroll && containerRef.current) {
      containerRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest'
      });
      outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output, error, shouldScroll]);

  return (
    <Card className="mt-3 output-panel" ref={containerRef}>
      <Card.Body>
        <Tabs 
          activeKey={activeKey} 
          onSelect={(k) => onTabSelect(k as string)}
          className="mb-3"
        >
          <Tab eventKey="output" title="Output">
            <div className="output-container">
              <pre className="output-content">
                {output || 'No output yet'}
                <div ref={outputEndRef} />
              </pre>
            </div>
          </Tab>
          <Tab eventKey="errors" title="Errors">
            <div className="output-container">
              <pre className="error-content">
                {error || 'No errors'}
                <div ref={outputEndRef} />
              </pre>
            </div>
          </Tab>
        </Tabs>
        <div className="execution-time">
          Execution time: {executionTime ? `${executionTime}ms` : '-'}
        </div>
      </Card.Body>
    </Card>
  );
}