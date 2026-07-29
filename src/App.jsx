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

import { parseJsonToGraph } from './utils/jsonToGraph';
import {
  getDagreLayout,
  getCircularLayout,
  getGridLayout,
  getOrganicLayout
} from './utils/layoutUtils';
import { exportToJson, exportToPng } from './utils/exportUtils';
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

  // Load graph data into canvas
  const loadGraphData = useCallback((parsedData, layoutMode = 'TB') => {
    const { nodes: parsedNodes, edges: parsedEdges } = parsedData;

    let layouted;
    if (layoutMode === 'circular') {
      layouted = getCircularLayout(parsedNodes, parsedEdges);
    } else if (layoutMode === 'grid') {
      layouted = getGridLayout(parsedNodes, parsedEdges);
    } else if (layoutMode === 'organic') {
      layouted = getOrganicLayout(parsedNodes, parsedEdges);
    } else {
      layouted = getDagreLayout(parsedNodes, parsedEdges, layoutMode);
    }

    setNodes(layouted.nodes);
    setEdges(layouted.edges);

    setTimeout(() => {
      fitView({ padding: 0.2, duration: 400 });
    }, 50);
  }, [setNodes, setEdges, fitView]);

  // Handle Layout Switch
  const handleLayoutChange = (newLayoutMode) => {
    setCurrentLayout(newLayoutMode);
    if (nodes.length === 0) return;

    let layouted;
    if (newLayoutMode === 'circular') {
      layouted = getCircularLayout(nodes, edges);
    } else if (newLayoutMode === 'grid') {
      layouted = getGridLayout(nodes, edges);
    } else if (newLayoutMode === 'organic') {
      layouted = getOrganicLayout(nodes, edges);
    } else {
      layouted = getDagreLayout(nodes, edges, newLayoutMode);
    }

    setNodes(layouted.nodes);
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 400 });
    }, 50);
  };

  // Handle Connecting 2 nodes on canvas
  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: '#3b82f6', strokeWidth: 2 },
            labelStyle: { fill: theme === 'light' ? '#0f172a' : '#f8fafc', fontWeight: 600, fontSize: '11px' },
            labelBgStyle: { fill: theme === 'light' ? '#ffffff' : '#0f172a', rx: 6, ry: 6 },
            labelBgPadding: [6, 4],
            markerEnd: { type: 'arrowclosed', color: '#3b82f6' }
          },
          eds
        )
      ),
    [setEdges, theme]
  );

  // Handle Node Click -> Select Node
  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id);
  }, []);

  // Handle Canvas Click -> Deselect Node
  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  // Focus camera on node
  const handleFocusNode = useCallback((nodeId) => {
    const targetNode = nodes.find((n) => n.id === nodeId);
    if (targetNode) {
      setSelectedNodeId(nodeId);
      const x = targetNode.position.x + 110;
      const y = targetNode.position.y + 45;
      setCenter(x, y, { zoom: 1.3, duration: 800 });
    }
  }, [nodes, setCenter]);

  // Update Node Property
  const handleUpdateNode = useCallback((nodeId, updatedFields) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === nodeId) {
          return {
            ...n,
            data: {
              ...n.data,
              ...updatedFields
            }
          };
        }
        return n;
      })
    );
  }, [setNodes]);

  // Delete Node
  const handleDeleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    setSelectedNodeId(null);
  }, [setNodes, setEdges]);

  // Add Custom Node
  const handleAddNode = useCallback(({ label, subtitle, type, bgColor, icon, shape, connectToNodeId }) => {
    const newId = `node_${Date.now()}`;
    const newNode = {
      id: newId,
      type: 'customNode',
      position: { x: 250 + Math.random() * 50, y: 200 + Math.random() * 50 },
      data: {
        label,
        subtitle,
        type,
        bgColor,
        icon,
        shape: shape || 'rectangle',
        status: 'active',
        details: { created: new Date().toLocaleTimeString() }
      }
    };

    setNodes((nds) => [...nds, newNode]);

    if (connectToNodeId) {
      const newEdge = {
        id: `e_${connectToNodeId}_${newId}`,
        source: connectToNodeId,
        target: newId,
        label: 'Bağlantılı',
        animated: true,
        style: { stroke: bgColor || '#3b82f6', strokeWidth: 2 },
        labelStyle: { fill: theme === 'light' ? '#0f172a' : '#f8fafc', fontWeight: 600, fontSize: '11px' },
        labelBgStyle: { fill: theme === 'light' ? '#ffffff' : '#0f172a', rx: 6, ry: 6 },
        labelBgPadding: [6, 4],
        markerEnd: { type: 'arrowclosed', color: bgColor || '#3b82f6' }
      };
      setEdges((eds) => [...eds, newEdge]);
    }

    setTimeout(() => {
      handleFocusNode(newId);
    }, 100);
  }, [setNodes, setEdges, handleFocusNode, theme]);

  // Apply JSON Input
  const handleApplyJson = (rawJson) => {
    const graphData = parseJsonToGraph(rawJson);
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
          <Controls position="bottom-left" showInteractive={false} />
          {nodes.length > 0 && (
            <MiniMap
              position="bottom-right"
              nodeColor={(n) => n.data?.bgColor || '#3b82f6'}
              maskColor={theme === 'light' ? 'rgba(241, 245, 249, 0.7)' : 'rgba(15, 23, 42, 0.7)'}
              style={{ width: 140, height: 90 }}
            />
          )}
        </ReactFlow>

        {/* Empty Canvas Welcome Overlay */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center p-4">
            <div className={`pointer-events-auto max-w-md w-full glass-modal p-8 rounded-3xl border text-center shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-300 ${
              theme === 'light' ? 'bg-white/95 border-slate-200 text-slate-900' : 'bg-slate-950/90 border-slate-800 text-slate-100'
            }`}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-blue-500/20">
                <FolderOpen size={32} />
              </div>

              <div>
                <h2 className="text-xl font-bold m-0">Graf Tuvali Boş</h2>
                <p className={`text-xs mt-1.5 leading-relaxed ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                  Başlamak için bilgisayarınızdan bir JSON dosyası yükleyin, editörden JSON kodunuzu yapıştırın veya manuel düğüm ekleyin.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
                >
                  <Upload size={15} /> Dosya Yükle (.json)
                </button>

                <button
                  onClick={() => setIsJsonModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
                >
                  <Code size={15} /> JSON Editörünü Aç
                </button>

                <button
                  onClick={() => handleApplyJson(PRESETS[0].data)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                    theme === 'light'
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                  }`}
                >
                  <Sparkles size={15} className="text-amber-500" /> Örnek Veri Yükle
                </button>

                <button
                  onClick={() => setIsAddNodeModalOpen(true)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                    theme === 'light'
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
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
