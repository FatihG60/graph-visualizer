import React, { useState, useEffect } from 'react';
import {
  X,
  Share2,
  Trash2,
  Palette,
  Sparkles,
  Zap,
  Tag,
  Activity,
  Sliders,
  Type
} from 'lucide-react';

const COLOR_PRESETS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#06b6d4', // cyan
  '#64748b', // slate
];

const EDGE_TYPES = [
  { id: 'default', label: 'Kavisli (Bezier)' },
  { id: 'smoothstep', label: 'Dik Açı (SmoothStep)' },
  { id: 'straight', label: 'Düz Çizgi (Straight)' },
  { id: 'step', label: 'Basamaklı (Step)' },
];

const EdgeDetailDrawer = ({
  selectedEdge,
  allNodes = [],
  onClose,
  onUpdateEdge,
  onDeleteEdge,
  theme = 'dark'
}) => {
  const [label, setLabel] = useState('');
  const [edgeType, setEdgeType] = useState('default');
  const [color, setColor] = useState('#3b82f6');
  const [animated, setAnimated] = useState(true);
  const [isDashed, setIsDashed] = useState(false);
  const [strokeWidth, setStrokeWidth] = useState(2.5);

  useEffect(() => {
    if (selectedEdge) {
      setLabel(selectedEdge.label || '');
      setEdgeType(selectedEdge.type || 'default');
      setColor(selectedEdge.style?.stroke || (theme === 'light' ? '#64748b' : '#3b82f6'));
      setAnimated(Boolean(selectedEdge.animated));
      setIsDashed(Boolean(selectedEdge.style?.strokeDasharray));
      setStrokeWidth(selectedEdge.style?.strokeWidth || 2.5);
    }
  }, [selectedEdge, theme]);

  if (!selectedEdge) return null;

  const isLight = theme === 'light';

  const sourceNode = allNodes.find((n) => n.id === selectedEdge.source);
  const targetNode = allNodes.find((n) => n.id === selectedEdge.target);

  const handleApplyChanges = (updates) => {
    const updatedStyle = {
      ...(selectedEdge.style || {}),
      stroke: updates.color !== undefined ? updates.color : color,
      strokeWidth: updates.strokeWidth !== undefined ? updates.strokeWidth : strokeWidth,
      strokeDasharray: updates.isDashed !== undefined ? (updates.isDashed ? '6,6' : undefined) : (isDashed ? '6,6' : undefined),
    };

    const updatedObj = {
      label: updates.label !== undefined ? updates.label : label,
      type: updates.type !== undefined ? updates.type : edgeType,
      animated: updates.animated !== undefined ? updates.animated : animated,
      style: updatedStyle,
      labelStyle: {
        fill: isLight ? '#0f172a' : '#f8fafc',
        fontWeight: 600,
        fontSize: '11px',
      },
      labelBgStyle: {
        fill: isLight ? '#ffffff' : '#0f172a',
        rx: 6,
        ry: 6,
      },
    };

    onUpdateEdge(selectedEdge.id, updatedObj);
  };

  return (
    <div className={`fixed top-16 right-0 bottom-0 w-80 z-40 border-l shadow-2xl flex flex-col backdrop-blur-md transition-transform duration-300 animate-in slide-in-from-right ${
      isLight ? 'bg-white/95 border-slate-200 text-slate-900' : 'glass-modal border-slate-800 text-slate-100'
    }`}>
      {/* Header */}
      <div className={`p-4 border-b flex items-center justify-between ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
      }`}>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-600/20 text-purple-500 border border-purple-500/30">
            <Share2 size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold m-0">İlişki / Çizgi Özelleştir</h3>
            <p className={`text-[11px] m-0 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              ID: {selectedEdge.id}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className={`p-1.5 rounded-xl transition-colors ${
            isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-200' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <X size={18} />
        </button>
      </div>

      {/* Connection Info Card */}
      <div className={`p-3 border-b text-xs flex items-center justify-between ${
        isLight ? 'bg-slate-100/60 border-slate-200' : 'bg-slate-950/40 border-slate-800'
      }`}>
        <div className="flex flex-col">
          <span className={`text-[10px] uppercase font-mono ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Kaynak</span>
          <span className="font-semibold">{sourceNode?.data?.label || selectedEdge.source}</span>
        </div>
        <span className="text-blue-500 font-bold">➔</span>
        <div className="flex flex-col text-right">
          <span className={`text-[10px] uppercase font-mono ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Hedef</span>
          <span className="font-semibold">{targetNode?.data?.label || selectedEdge.target}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Edge Label Input */}
        <div>
          <label className={`block text-xs font-medium mb-1.5 flex items-center gap-1.5 ${
            isLight ? 'text-slate-700' : 'text-slate-300'
          }`}>
            <Type size={14} className="text-blue-500" /> İlişki Etiketi (Metin)
          </label>
          <input
            type="text"
            placeholder="Örn: /api/v1/auth, Kafka Stream, HTTP GET"
            value={label}
            onChange={(e) => {
              setLabel(e.target.value);
              handleApplyChanges({ label: e.target.value });
            }}
            className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-blue-500 ${
              isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
            }`}
          />
        </div>

        {/* Edge Type Selector */}
        <div>
          <label className={`block text-xs font-medium mb-1.5 flex items-center gap-1.5 ${
            isLight ? 'text-slate-700' : 'text-slate-300'
          }`}>
            <Sliders size={14} className="text-purple-500" /> Çizgi Tipi
          </label>
          <div className="grid grid-cols-2 gap-2">
            {EDGE_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setEdgeType(t.id);
                  handleApplyChanges({ type: t.id });
                }}
                className={`p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                  edgeType === t.id
                    ? 'bg-purple-600/20 border-purple-500 text-purple-400 font-semibold'
                    : isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Color Palette */}
        <div>
          <label className={`block text-xs font-medium mb-2 flex items-center gap-1.5 ${
            isLight ? 'text-slate-700' : 'text-slate-300'
          }`}>
            <Palette size={14} className="text-amber-500" /> Çizgi Rengi
          </label>
          <div className="grid grid-cols-4 gap-2">
            {COLOR_PRESETS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setColor(c);
                  handleApplyChanges({ color: c });
                }}
                className={`h-8 rounded-xl border transition-all ${
                  color === c ? 'ring-2 ring-blue-500 scale-105 border-white' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Animation & Dash Options */}
        <div className={`p-3 rounded-xl border space-y-3 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium flex items-center gap-1.5 ${
              isLight ? 'text-slate-700' : 'text-slate-300'
            }`}>
              <Zap size={14} className="text-emerald-500" /> Animasyonlu Akış (Flowing)
            </span>
            <input
              type="checkbox"
              checked={animated}
              onChange={(e) => {
                setAnimated(e.target.checked);
                handleApplyChanges({ animated: e.target.checked });
              }}
              className="w-4 h-4 rounded text-blue-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between border-t pt-2 border-slate-700/30">
            <span className={`text-xs font-medium flex items-center gap-1.5 ${
              isLight ? 'text-slate-700' : 'text-slate-300'
            }`}>
              <Activity size={14} className="text-indigo-500" /> Kesikli Çizgi (Dashed)
            </span>
            <input
              type="checkbox"
              checked={isDashed}
              onChange={(e) => {
                setIsDashed(e.target.checked);
                handleApplyChanges({ isDashed: e.target.checked });
              }}
              className="w-4 h-4 rounded text-blue-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Stroke Width Slider */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className={`text-xs font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Çizgi Kalınlığı: <span className="font-bold text-blue-500">{strokeWidth}px</span>
            </label>
          </div>
          <input
            type="range"
            min="1"
            max="6"
            step="0.5"
            value={strokeWidth}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setStrokeWidth(val);
              handleApplyChanges({ strokeWidth: val });
            }}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Footer Delete Button */}
      <div className={`p-4 border-t flex items-center justify-between ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'
      }`}>
        <button
          onClick={() => onDeleteEdge(selectedEdge.id)}
          className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-500 border border-rose-500/30 text-xs font-medium transition-all flex items-center gap-1.5"
        >
          <Trash2 size={14} /> İlişkiyi Sil
        </button>

        <button
          onClick={onClose}
          className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-colors ${
            isLight ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          Kapat
        </button>
      </div>
    </div>
  );
};

export default EdgeDetailDrawer;
