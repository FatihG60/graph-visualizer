import React, { useState } from 'react';
import {
  X,
  Eye,
  Trash2,
  Share2,
  Sliders,
  FileCode,
  ArrowRight,
  ArrowLeft,
  Palette,
  Sparkles,
  Square,
  Circle,
  Triangle,
  Diamond,
  Pill
} from 'lucide-react';
import { getIconComponent, ICON_LIST } from '../utils/iconMap';

const COLOR_PRESETS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#10b981', // emerald
  '#f59e0b', // amber
  '#06b6d4', // cyan
  '#6366f1', // indigo
  '#f43f5e', // rose
  '#64748b', // slate
];

const SHAPE_OPTIONS = [
  { id: 'rectangle', label: 'Dikdörtgen', icon: Square },
  { id: 'circle', label: 'Daire', icon: Circle },
  { id: 'pill', label: 'Kapsül', icon: Pill },
  { id: 'diamond', label: 'Elmas', icon: Diamond },
  { id: 'triangle', label: 'Üçgen', icon: Triangle },
];

const NodeDetailDrawer = ({
  selectedNode,
  allNodes,
  allEdges,
  onClose,
  onUpdateNode,
  onDeleteNode,
  onFocusNode,
  theme = 'dark'
}) => {
  const [activeTab, setActiveTab] = useState('data'); // 'data' | 'connections' | 'style'

  if (!selectedNode) return null;

  const isLight = theme === 'light';

  const nodeData = selectedNode.data || {};
  const {
    label = 'Düğüm',
    subtitle = '',
    icon = 'box',
    bgColor = '#3b82f6',
    status = 'active',
    type = '',
    shape = 'rectangle',
    details = {}
  } = nodeData;

  // Find incoming & outgoing connections
  const incomingEdges = allEdges.filter((e) => e.target === selectedNode.id);
  const outgoingEdges = allEdges.filter((e) => e.source === selectedNode.id);

  const getConnectedNode = (id) => allNodes.find((n) => n.id === id);

  return (
    <div className={`fixed right-0 top-0 bottom-0 w-96 glass-panel z-50 flex flex-col border-l shadow-2xl animate-in slide-in-from-right duration-300 ${
      isLight
        ? 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300/50'
        : 'bg-slate-900/95 border-slate-700/80 text-slate-100'
    }`}>
      {/* Header */}
      <div className={`p-4 border-b flex items-start justify-between ${
        isLight ? 'bg-slate-50/90 border-slate-200' : 'bg-slate-900/60 border-slate-700/80'
      }`}>
        <div className="flex items-center gap-3">
          <div
            className="p-3 rounded-xl text-white shadow-lg flex items-center justify-center"
            style={{ backgroundColor: bgColor }}
          >
            {getIconComponent(icon, { size: 24 })}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-base font-semibold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{label}</h2>
              <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-full border ${
                isLight ? 'bg-slate-200 text-slate-700 border-slate-300' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                {type || 'Node'}
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{subtitle || `ID: ${selectedNode.id}`}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className={`p-1.5 rounded-lg transition-colors ${
            isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-200' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <X size={18} />
        </button>
      </div>

      {/* Action Bar */}
      <div className={`px-4 py-2 border-b flex items-center gap-2 ${
        isLight ? 'bg-slate-100/60 border-slate-200' : 'bg-slate-950/40 border-slate-800'
      }`}>
        <button
          onClick={() => onFocusNode(selectedNode.id)}
          className="flex-1 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-500 hover:text-blue-600 text-xs font-medium border border-blue-500/30 transition-all flex items-center justify-center gap-1.5"
        >
          <Eye size={14} /> Odaklan
        </button>
        <button
          onClick={() => onDeleteNode(selectedNode.id)}
          className="px-3 py-1.5 rounded-lg bg-rose-600/10 hover:bg-rose-600/20 text-rose-500 hover:text-rose-600 text-xs font-medium border border-rose-500/20 transition-all flex items-center justify-center gap-1.5"
        >
          <Trash2 size={14} /> Sil
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className={`flex border-b text-xs ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/40 border-slate-800'
      }`}>
        <button
          onClick={() => setActiveTab('data')}
          className={`flex-1 py-2.5 font-medium border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'data'
              ? 'border-blue-500 text-blue-500 font-semibold'
              : isLight ? 'border-transparent text-slate-500 hover:text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode size={14} /> Veri Detayı
        </button>
        <button
          onClick={() => setActiveTab('connections')}
          className={`flex-1 py-2.5 font-medium border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'connections'
              ? 'border-blue-500 text-blue-500 font-semibold'
              : isLight ? 'border-transparent text-slate-500 hover:text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Share2 size={14} /> Bağlantılar ({incomingEdges.length + outgoingEdges.length})
        </button>
        <button
          onClick={() => setActiveTab('style')}
          className={`flex-1 py-2.5 font-medium border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'style'
              ? 'border-blue-500 text-blue-500 font-semibold'
              : isLight ? 'border-transparent text-slate-500 hover:text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders size={14} /> Özelleştir
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: DATA DETAILS */}
        {activeTab === 'data' && (() => {
          const IGNORED_SYSTEM_KEYS = ['icon', 'bgcolor', 'bg_color', 'status', 'shape', 'ishighlighted', 'theme'];
          
          const cleanDataObject = (obj) => {
            if (!obj || typeof obj !== 'object') return obj;
            if (Array.isArray(obj)) return obj.map(cleanDataObject);
            const result = {};
            Object.entries(obj).forEach(([key, val]) => {
              if (!IGNORED_SYSTEM_KEYS.includes(key.toLowerCase())) {
                result[key] = typeof val === 'object' && val !== null ? cleanDataObject(val) : val;
              }
            });
            return result;
          };

          const filteredData = cleanDataObject(details || nodeData.rawJson || {});
          const hasDataKeys = Object.keys(filteredData).length > 0;

          return (
            <div className="space-y-4">
              {/* Key Value Metadata Table */}
              <div>
                <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Özellikler & Metadata
                </h4>
                <div className={`rounded-xl border overflow-hidden divide-y ${
                  isLight ? 'bg-slate-50 border-slate-200 divide-slate-200' : 'bg-slate-900/80 border-slate-800 divide-slate-800'
                }`}>
                  {hasDataKeys ? (
                    Object.entries(filteredData).map(([key, val]) => (
                      <div key={key} className="px-3.5 py-2.5 flex items-start justify-between gap-3 text-xs">
                        <span className={`font-mono shrink-0 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{key}:</span>
                        <span className={`font-medium text-right break-all ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                          {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-500">Özel veri bulunmuyor.</div>
                  )}
                </div>
              </div>

              {/* Raw JSON Code Block */}
              <div>
                <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Ham JSON Çıktısı
                </h4>
                <pre className={`p-3 rounded-xl border text-[11px] font-mono overflow-x-auto ${
                  isLight ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-emerald-400'
                }`}>
                  {JSON.stringify(filteredData, null, 2)}
                </pre>
              </div>
            </div>
          );
        })()}

        {/* TAB 2: CONNECTIONS & NAVIGATION */}
        {activeTab === 'connections' && (
          <div className="space-y-4">
            {/* Outgoing Connections */}
            <div>
              <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                <ArrowRight size={14} className="text-blue-500" /> Hedef Bağlantılar (Giden)
              </h4>
              {outgoingEdges.length === 0 ? (
                <p className={`text-xs italic p-3 rounded-lg border ${isLight ? 'bg-slate-100/60 border-slate-200 text-slate-500' : 'bg-slate-900/40 border-slate-800 text-slate-500'}`}>
                  Giden bağlantı bulunmuyor.
                </p>
              ) : (
                <div className="space-y-2">
                  {outgoingEdges.map((edge) => {
                    const targetNode = getConnectedNode(edge.target);
                    if (!targetNode) return null;
                    return (
                      <div
                        key={edge.id}
                        className={`p-3 rounded-xl border flex items-center justify-between transition-all group ${
                          isLight ? 'bg-slate-50 hover:bg-slate-100 border-slate-200' : 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="p-2 rounded-lg text-white shrink-0 shadow-sm"
                            style={{ backgroundColor: targetNode.data?.bgColor || '#3b82f6' }}
                          >
                            {getIconComponent(targetNode.data?.icon, { size: 16 })}
                          </div>
                          <div className="min-w-0">
                            <h5 className={`text-xs font-semibold truncate ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                              {targetNode.data?.label}
                            </h5>
                            <p className="text-[11px] text-blue-500 truncate font-medium">
                              İlişki: {edge.label || 'Bağlantılı'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => onFocusNode(targetNode.id)}
                          className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-500 hover:text-white text-xs font-medium transition-colors shrink-0 flex items-center gap-1"
                        >
                          Git <ArrowRight size={12} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Incoming Connections */}
            <div>
              <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                <ArrowLeft size={14} className="text-purple-500" /> Kaynak Bağlantılar (Gelen)
              </h4>
              {incomingEdges.length === 0 ? (
                <p className={`text-xs italic p-3 rounded-lg border ${isLight ? 'bg-slate-100/60 border-slate-200 text-slate-500' : 'bg-slate-900/40 border-slate-800 text-slate-500'}`}>
                  Gelen bağlantı bulunmuyor.
                </p>
              ) : (
                <div className="space-y-2">
                  {incomingEdges.map((edge) => {
                    const sourceNode = getConnectedNode(edge.source);
                    if (!sourceNode) return null;
                    return (
                      <div
                        key={edge.id}
                        className={`p-3 rounded-xl border flex items-center justify-between transition-all group ${
                          isLight ? 'bg-slate-50 hover:bg-slate-100 border-slate-200' : 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="p-2 rounded-lg text-white shrink-0 shadow-sm"
                            style={{ backgroundColor: sourceNode.data?.bgColor || '#8b5cf6' }}
                          >
                            {getIconComponent(sourceNode.data?.icon, { size: 16 })}
                          </div>
                          <div className="min-w-0">
                            <h5 className={`text-xs font-semibold truncate ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                              {sourceNode.data?.label}
                            </h5>
                            <p className="text-[11px] text-purple-500 truncate font-medium">
                              İlişki: {edge.label || 'Bağlantılı'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => onFocusNode(sourceNode.id)}
                          className="px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-500 hover:text-white text-xs font-medium transition-colors shrink-0 flex items-center gap-1"
                        >
                          Git <ArrowRight size={12} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMIZE / STYLING */}
        {activeTab === 'style' && (
          <div className="space-y-5">
            {/* Shape Selector */}
            <div>
              <label className={`block text-xs font-medium mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Düğüm Geometrik Şekli (Shape)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {SHAPE_OPTIONS.map((item) => {
                  const IconComp = item.icon;
                  const isSelected = (shape || 'rectangle') === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onUpdateNode(selectedNode.id, { shape: item.id })}
                      title={item.label}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                        isSelected
                          ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                          : isLight
                          ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <IconComp size={18} />
                      <span className="text-[10px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Label Input */}
            <div>
              <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Düğüm Etiketi (Başlık)
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => onUpdateNode(selectedNode.id, { label: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-blue-500 ${
                  isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                }`}
              />
            </div>

            {/* Subtitle Input */}
            <div>
              <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Alt Başlık / Açıklama
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => onUpdateNode(selectedNode.id, { subtitle: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-blue-500 ${
                  isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                }`}
              />
            </div>

            {/* Status Select */}
            <div>
              <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Çalışma Durumu
              </label>
              <select
                value={status}
                onChange={(e) => onUpdateNode(selectedNode.id, { status: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-blue-500 ${
                  isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                }`}
              >
                <option value="active">🟢 Aktif (Active)</option>
                <option value="warning">🟡 Uyarı (Warning)</option>
                <option value="error">🔴 Hata (Error)</option>
                <option value="inactive">⚪ Pasif (Inactive)</option>
              </select>
            </div>

            {/* Color Palette Picker */}
            <div>
              <label className={`block text-xs font-medium mb-2 flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <Palette size={14} className="text-blue-500" /> Arka Plan Rengi
              </label>
              <div className="grid grid-cols-5 gap-2">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    onClick={() => onUpdateNode(selectedNode.id, { bgColor: color })}
                    className={`h-8 rounded-lg transition-transform hover:scale-110 flex items-center justify-center border ${
                      bgColor === color ? 'ring-2 ring-blue-500 border-white scale-105' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Icon Picker Grid */}
            <div>
              <label className={`block text-xs font-medium mb-2 flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <Sparkles size={14} className="text-amber-500" /> İkon Seçimi
              </label>
              <div className={`grid grid-cols-5 gap-2 max-h-40 overflow-y-auto p-1.5 rounded-xl border ${
                isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'
              }`}>
                {ICON_LIST.map((item) => {
                  const IconComp = item.icon;
                  const isSelected = icon === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onUpdateNode(selectedNode.id, { icon: item.id })}
                      title={item.label}
                      className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md'
                          : isLight
                          ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <IconComp size={18} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NodeDetailDrawer;
