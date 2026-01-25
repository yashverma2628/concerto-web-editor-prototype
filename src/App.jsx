import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
} from 'reactflow';
import 'reactflow/dist/style.css';

import ConcertoNode from './ConcertoNode'; 
import './index.css';

const nodeTypes = {
  concerto: ConcertoNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'concerto',
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
  
  // NEW: State for the selected node
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // Helper: Get the actual node object based on the ID
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

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
      if (typeof type === 'undefined' || !type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      const newNode = {
        id: getId(),
        type: 'concerto', 
        position,
        data: { 
            label: `New ${type}`, 
            fields: [] 
        },
      };

      setNodes((nds) => nds.concat(newNode));
      setSelectedNodeId(newNode.id); // Auto-select the new node
    },
    [reactFlowInstance],
  );

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // NEW: Handle Node Click
  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id);
  }, []);

  // NEW: Handle Canvas Click (Deselect)
  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  // NEW: Update Node Name
  const onNameChange = (evt) => {
    const newName = evt.target.value;
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNodeId) {
          // Create a new data object so React "sees" the change
          return {
            ...node,
            data: {
              ...node.data,
              label: newName,
            },
          };
        }
        return node;
      })
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <h3>Concerto Editor</h3>
        <p style={{ fontSize: '12px', color: '#666' }}>Drag these to the canvas:</p>
        <div className="dndnode" onDragStart={(event) => onDragStart(event, 'Concept')} draggable>Concept</div>
        <div className="dndnode" onDragStart={(event) => onDragStart(event, 'Asset')} draggable>Asset</div>
        <div className="dndnode" onDragStart={(event) => onDragStart(event, 'Enum')} draggable>Enum</div>
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
          onNodeClick={onNodeClick} 
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>

      {/* NEW: RIGHT SIDEBAR (PROPERTIES) */}
      <aside className="right-sidebar">
        <div className="panel-title">Properties</div>
        {selectedNode ? (
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '5px' }}>Name</label>
            <input 
              type="text" 
              className="panel-input"
              value={selectedNode.data.label} 
              onChange={onNameChange} 
            />
            <div className="info-text">
              Selected ID: {selectedNode.id} <br/>
              Type: {selectedNode.type}
            </div>
          </div>
        ) : (
          <div className="info-text">Select a node to edit its properties.</div>
        )}
      </aside>
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <App />
  </ReactFlowProvider>
);