import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

// This component defines the design of our custom node
const ConcertoNode = ({ data }) => {
  return (
    <div className="concerto-node">
      {/* 1. The Header (Concept Name) */}
      <div className="concerto-header">
        {data.label}
      </div>

      {/* 2. The Body (Fields/Properties) */}
      <div className="concerto-body">
        {data.fields && data.fields.length > 0 ? (
          data.fields.map((field, index) => (
            <div key={index} className="concerto-field">
              {/* The little bullet point */}
              <span className="field-icon">o</span> 
              
              {/* The Type (e.g. String) */}
              <span className="field-type">{field.type}</span>
              
              {/* The Name (e.g. firstName) */}
              <span className="field-name">{field.name}</span>
            </div>
          ))
        ) : (
          <div className="field-empty">No properties</div>
        )}
      </div>

      {/* 3. The Connectors (Dots for lines) */}
      <Handle type="target" position={Position.Top} className="handle" />
      <Handle type="source" position={Position.Bottom} className="handle" />
    </div>
  );
};

export default memo(ConcertoNode);