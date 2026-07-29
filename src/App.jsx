import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  useReactFlow,
} from '@xyflow/react';
import { Upload, Code, Plus, Sparkles, FolderOpen } from 'lucide-react';

import CustomNode from './components/CustomNode';
import HeaderBar from './components/HeaderBar';
import NodeDetailDrawer from './components/NodeDetailDrawer';
import JsonEditorModal from './components/JsonEditorModal';
import AddNodeModal from './components/AddNodeModal';
import DiagramModal from './components/DiagramModal';

import { parseJsonToGraph } from './utils/jsonToGraph';
import {
  getDagreLayout,
  getCircularLayout,
  getGridLayout,
  getOrganicLayout
} from './utils/layoutUtils';
import { exportToJson, exportToPng, exportToSvg } from './utils/exportUtils';
import { PRESETS } from './utils/presets';

const nodeTypes = {
  customNode: CustomNode,
};

function GraphCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [currentLayout, setCurrentLayout] = useState('TB');
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('dark'); // 'dark' | 'light'

  // Modals
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isAddNodeModalOpen, setIsAddNodeModalOpen] = useState(false);
  const [isDiagramModalOpen, setIsDiagramModalOpen] = useState(false);

  const { fitView, setCenter } = useReactFlow();
  const fileInputRef = React.useRef(null);

  // Toggle Theme class on document body
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Helper to apply layout to nodes & edges
  const applyLayout = useCallback(
    (nodesToLayout, edgesToLayout, layoutType) => {
      let layoutedNodes = [];
      if (layoutType === 'TB' || layoutType === 'LR') {
        layoutedNodes = getDagreLayout(nodesToLayout, edgesToLayout, layoutType);
      } else if (layoutType === 'circular') {
        layoutedNodes = getCircularLayout(nodesToLayout);
      } else if (layoutType === 'grid') {
        layoutedNodes = getGridLayout(nodesToLayout);
      } else if (layoutType === 'organic') {
        layoutedNodes = getOrganicLayout(nodesToLayout, edgesToLayout);
      } else {
        layoutedNodes = getDagreLayout(nodesToLayout, edgesToLayout, 'TB');
      }
      return layoutedNodes;
    },
    []
  );

  const loadGraphData = useCallback(
    (graphData, layoutType = currentLayout) => {
      if (!graphData || !graphData.nodes) return;
      const layoutedNodes = applyLayout(graphData.nodes, graphData.edges || [], layoutType);
      setNodes(layoutedNodes);
      setEdges(graphData.edges || []);
      setSelectedNodeId(null);
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 400 });
      }, 50);
    },
    [applyLayout, currentLayout, setNodes, setEdges, fitView]
  );

  // Handle Manual Layout Switch
  const handleLayoutChange = (newLayout) => {
    setCurrentLayout(newLayout);
    if (nodes.length > 0) {
      const layouted = applyLayout(nodes, edges, newLayout);
      setNodes(layouted);
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 400 });
      }, 50);
    }
  };

  // Connect two nodes on canvas
  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        id: `e-${params.source}-${params.target}-${Date.now()}`,
        animated: true,
        style: { stroke: theme === 'light' ? '#94a3b8' : '#475569', strokeWidth: 2 },
        labelStyle: { fill: theme === 'light' ? '#0f172a' : '#f8fafc', fontWeight: 600, fontSize: '11px' },
        labelBgStyle: { fill: theme === 'light' ? '#ffffff' : '#0f172a', rx: 6, ry: 6 },
        labelBgPadding: [6, 4]
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, theme]
  );

  const onNodeClick = useCallback((_, node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  // Center view on a specific node
  const handleFocusNode = useCallback(
    (nodeId) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (node) {
        setSelectedNodeId(nodeId);
        setCenter(node.position.x + 100, node.position.y + 40, {
          zoom: 1.2,
          duration: 500,
        });
      }
    },
    [nodes, setCenter]
  );

  // Update a single node property
  const handleUpdateNode = useCallback(
    (nodeId, updatedFields) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === nodeId) {
            return {
              ...n,
              data: {
                ...n.data,
                ...updatedFields,
              },
            };
          }
          return n;
        })
      );
    },
    [setNodes]
  );

  // Delete a node and its associated edges
  const handleDeleteNode = useCallback(
    (nodeId) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
      setSelectedNodeId(null);
    },
    [setNodes, setEdges]
  );

  // Add a new node manually
  const handleAddNode = useCallback(
    (newNodeData) => {
      const newId = `node_${Date.now()}`;
      const newNode = {
        id: newId,
        type: 'customNode',
        position: {
          x: Math.random() * 300 + 100,
          y: Math.random() * 300 + 100,
        },
        data: {
          label: newNodeData.label,
          subtitle: newNodeData.subtitle,
          type: newNodeData.type,
          bgColor: newNodeData.bgColor,
          icon: newNodeData.icon,
          shape: newNodeData.shape || 'rectangle',
          status: 'active',
          theme,
          details: {
            createdManually: true,
            createdAt: new Date().toLocaleTimeString(),
          },
        },
      };

      setNodes((nds) => [...nds, newNode]);

      if (newNodeData.connectToNodeId) {
        const newEdge = {
          id: `e_${newNodeData.connectToNodeId}_${newId}`,
          source: newNodeData.connectToNodeId,
          target: newId,
          animated: true,
          style: { stroke: theme === 'light' ? '#94a3b8' : '#475569', strokeWidth: 2 },
          labelStyle: { fill: theme === 'light' ? '#0f172a' : '#f8fafc', fontWeight: 600, fontSize: '11px' },
          labelBgStyle: { fill: theme === 'light' ? '#ffffff' : '#0f172a', rx: 6, ry: 6 },
          labelBgPadding: [6, 4]
        };
        setEdges((eds) => [...eds, newEdge]);
      }

      setTimeout(() => {
        handleFocusNode(newId);
      }, 100);
    },
    [setNodes, setEdges, handleFocusNode, theme]
  );

  // Apply JSON Input with optional column-matching key
  const handleApplyJson = (rawJson, matchKey = '') => {
    const graphData = parseJsonToGraph(rawJson, matchKey);
    loadGraphData(graphData, currentLayout);
  };

  // Direct File Upload handler
  const handleDirectFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const rawJson = JSON.parse(e.target.result);
        handleApplyJson(rawJson);
      } catch (err) {
        alert('Yüklenen dosya geçerli bir JSON dosyası değil: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  // Export Handlers
  const handleExportJson = () => {
    if (nodes.length === 0) {
      alert('İndirilecek düğüm bulunmuyor.');
      return;
    }
    exportToJson(nodes, edges, `graf-verisi-${Date.now()}.json`);
  };

  const handleExportPng = () => {
    if (nodes.length === 0) {
      alert('İndirilecek graf bulunmuyor.');
      return;
    }
    const bg = theme === 'light' ? '#f8fafc' : '#0b0f19';
    exportToPng('.react-flow', `graf-gorseli-${Date.now()}.png`, bg);
  };

  const handleExportSvg = () => {
    if (nodes.length === 0) {
      alert('İndirilecek graf bulunmuyor.');
      return;
    }
    const bg = theme === 'light' ? '#f8fafc' : '#0b0f19';
    exportToSvg('.react-flow', `graf-vektorel-${Date.now()}.svg`, bg);
  };

  // Search Filter Highlights & Theme Injection
  const processedNodes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return nodes.map((n) => {
      const labelMatch = query && n.data?.label?.toLowerCase().includes(query);
      const subMatch = query && n.data?.subtitle?.toLowerCase().includes(query);
      const typeMatch = query && n.data?.type?.toLowerCase().includes(query);
      const match = Boolean(query && (labelMatch || subMatch || typeMatch));
      return {
        ...n,
        data: {
          ...n.data,
          theme,
          isHighlighted: match
        }
      };
    });
  }, [nodes, searchQuery, theme]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className={`w-full h-full flex flex-col relative overflow-hidden transition-colors ${
      theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Hidden File Input for Empty State Button */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".json,application/json"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleDirectFileUpload(file);
        }}
        className="hidden"
      />

      {/* Top Header Bar */}
      <HeaderBar
        currentLayout={currentLayout}
        onLayoutChange={handleLayoutChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenJsonEditor={() => setIsJsonModalOpen(true)}
        onOpenAddNode={() => setIsAddNodeModalOpen(true)}
        onResetView={() => fitView({ padding: 0.2, duration: 400 })}
        onExportJson={handleExportJson}
        onExportPng={handleExportPng}
        onExportSvg={handleExportSvg}
        onOpenDiagramModal={() => setIsDiagramModalOpen(true)}
        onFileUpload={handleDirectFileUpload}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        nodesCount={nodes.length}
        edgesCount={edges.length}
      />

      {/* Main Canvas Area */}
      <div className="flex-1 w-full h-full relative">
        <ReactFlow
          nodes={processedNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          proOptions={{ hideAttribution: true }}
          fitView
          minZoom={0.1}
          maxZoom={2.5}
          defaultEdgeOptions={{
            animated: true,
            style: { stroke: theme === 'light' ? '#94a3b8' : '#475569', strokeWidth: 2 },
            labelStyle: { fill: theme === 'light' ? '#0f172a' : '#f8fafc', fontWeight: 600, fontSize: '11px' },
            labelBgStyle: { fill: theme === 'light' ? '#ffffff' : '#0f172a', rx: 6, ry: 6 },
            labelBgPadding: [6, 4]
          }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1.5}
            color={theme === 'light' ? '#cbd5e1' : '#334155'}
          />
          <Controls />
          <MiniMap
            nodeColor={(node) => node.data?.bgColor || (theme === 'light' ? '#64748b' : '#3b82f6')}
            maskColor={theme === 'light' ? 'rgba(241, 245, 249, 0.7)' : 'rgba(11, 15, 25, 0.7)'}
            ariaLabel="Mini Map"
          />
        </ReactFlow>

        {/* Empty Canvas Overlay State */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 text-center z-10 animate-in fade-in duration-300">
            <div className={`p-8 rounded-3xl border shadow-2xl max-w-md pointer-events-auto backdrop-blur-md ${
              theme === 'light' ? 'bg-white/90 border-slate-200 text-slate-800' : 'glass-modal border-slate-800 text-slate-100'
            }`}>
              <div className="w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-500 flex items-center justify-center mx-auto mb-4 border border-blue-500/30 shadow-lg shadow-blue-500/10">
                <FolderOpen size={32} />
              </div>

              <h2 className="text-xl font-bold mb-2">Graf Tuvaliniz Boş</h2>
              <p className={`text-xs mb-6 leading-relaxed ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                Görselleştirmek için JSON dosyanızı yükleyebilir, hazır şablonlarımızdan seçebilir veya manuel olarak yeni düğümler ekleyebilirsiniz.
              </p>

              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => setIsJsonModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
                >
                  <Code size={15} /> JSON Editör veya Şablon Aç
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                    theme === 'light'
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                  }`}
                >
                  <Upload size={15} className="text-indigo-400" /> Bilgisayardan JSON Yükle
                </button>

                <button
                  onClick={() => setIsAddNodeModalOpen(true)}
                  className={`w-full py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                    theme === 'light' ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Plus size={15} /> Düğüm Ekle
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Selected Node Details Drawer */}
        <NodeDetailDrawer
          selectedNode={selectedNode}
          allNodes={nodes}
          allEdges={edges}
          onClose={() => setSelectedNodeId(null)}
          onUpdateNode={handleUpdateNode}
          onDeleteNode={handleDeleteNode}
          onFocusNode={handleFocusNode}
          theme={theme}
        />
      </div>

      {/* Modals */}
      <JsonEditorModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        onApplyJson={handleApplyJson}
        theme={theme}
      />

      <AddNodeModal
        isOpen={isAddNodeModalOpen}
        onClose={() => setIsAddNodeModalOpen(false)}
        existingNodes={nodes}
        onAddNode={handleAddNode}
        theme={theme}
      />

      <DiagramModal
        isOpen={isDiagramModalOpen}
        onClose={() => setIsDiagramModalOpen(false)}
        nodes={nodes}
        edges={edges}
        theme={theme}
      />
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <GraphCanvas />
    </ReactFlowProvider>
  );
}
