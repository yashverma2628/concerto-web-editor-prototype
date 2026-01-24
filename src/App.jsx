import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
} from 'reactflow';
import 'reactflow/dist/style.css';

import ConcertoNode from './ConcertoNode'; // Import our custom node
import './index.css';

// 1. REGISTER CUSTOM NODE
const nodeTypes = {
  concerto: ConcertoNode,
};

// 2. INITIAL DATA
const initialNodes = [
  {
    id: '1',
    type: 'concerto', // This MUST match the key in nodeTypes
    position: { x: 250, y: 100 },
    data: { 
      label: 'Person',
      fields: [
        { type: 'String', name: 'firstName' },
        { type: 'String', name: 'lastName' },
        { type: 'Integer', name: 'age' }
      ]
    },
  },
];

let id = 2;
const getId = () => `${id++}`;

const App = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      const newNode = {
        id: getId(),
        type: 'concerto', 
        position,
        data: { 
            label: `${type} Node`, 
            fields: [
                { type: 'String', name: 'newField' }
            ] 
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <h3>Concerto Editor</h3>
        <p style={{ fontSize: '12px', color: '#666' }}>Drag these to the canvas:</p>
        
        <div className="dndnode" onDragStart={(event) => onDragStart(event, 'Concept')} draggable>
          Concept
        </div>
        <div className="dndnode" onDragStart={(event) => onDragStart(event, 'Asset')} draggable>
          Asset
        </div>
        <div className="dndnode" onDragStart={(event) => onDragStart(event, 'Enum')} draggable>
          Enum
        </div>
      </aside>

      {/* MAIN CANVAS */}
      <div style={{ flexGrow: 1, height: '100%' }} ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <App />
  </ReactFlowProvider>
);