import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid with configuration
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'monospace',
});

const Mermaid = ({ chart, theme }) => {
  const ref = useRef(null);
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!chart) return;

    // Update mermaid theme based on app theme
    mermaid.initialize({
      startOnLoad: false,
      theme: theme === 'light' ? 'default' : 'dark',
      securityLevel: 'loose',
      fontFamily: 'monospace',
    });

    const renderChart = async () => {
      try {
        // Generate a unique ID for this diagram
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        
        // Render the mermaid diagram
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
        setError(null);
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(err.message);
      }
    };

    renderChart();
  }, [chart, theme]);

  if (error) {
    return (
      <div style={{ 
        padding: '1rem', 
        background: 'rgba(255,0,0,0.1)', 
        border: '1px solid red',
        borderRadius: '4px',
        color: 'red'
      }}>
        <strong>Mermaid Diagram Error:</strong>
        <pre style={{ whiteSpace: 'pre-wrap', marginTop: '0.5rem' }}>{error}</pre>
      </div>
    );
  }

  return (
    <div 
      ref={ref}
      className="mermaid-diagram"
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        margin: '2rem 0',
        overflow: 'auto'
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default Mermaid;
