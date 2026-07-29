import React, { useState } from 'react';
import { X, Plus, Palette, Sparkles, Link2, Square, Circle, Triangle, Diamond, Pill } from 'lucide-react';
import { ICON_LIST } from '../utils/iconMap';

const COLOR_PRESETS = [
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#10b981',
  '#f59e0b',
  '#06b6d4',
  '#6366f1',
  '#f43f5e',
];

const SHAPE_OPTIONS = [
  { id: 'rectangle', label: 'Dikdörtgen', icon: Square },
  { id: 'circle', label: 'Daire', icon: Circle },
  { id: 'pill', label: 'Kapsül', icon: Pill },
  { id: 'diamond', label: 'Elmas', icon: Diamond },
  { id: 'triangle', label: 'Üçgen', icon: Triangle },
];

const AddNodeModal = ({ isOpen, onClose, existingNodes, onAddNode, theme = 'dark' }) => {
  const [label, setLabel] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [type, setType] = useState('Service');
  const [bgColor, setBgColor] = useState('#3b82f6');
  const [icon, setIcon] = useState('server');
  const [shape, setShape] = useState('rectangle');
  const [connectToNodeId, setConnectToNodeId] = useState('');

  if (!isOpen) return null;

  const isLight = document.body.classList.contains('light-theme') || theme === 'light';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!label.trim()) return;

    onAddNode({
      label: label.trim(),
      subtitle: subtitle.trim(),
      type: type.trim(),
      bgColor,
      icon,
      shape,
      connectToNodeId: connectToNodeId || null
    });

    // Reset fields
    setLabel('');
    setSubtitle('');
    setConnectToNodeId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden flex flex-col ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'glass-modal border-slate-800 text-slate-100'
      }`}>
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-500 border border-blue-500/30">
              <Plus size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold m-0">Yeni Düğüm (Node) Ekle</h2>
              <p className={`text-xs m-0 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Graf tuvaline yeni bir veri düğümü ekleyin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-200' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Düğüm Adı (Zorunlu)
            </label>
            <input
              type="text"
              required
              placeholder="Örn: Payment Gateway"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-blue-500 ${
                isLight ? 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Alt Başlık / Açıklama
              </label>
              <input
                type="text"
                placeholder="Örn: Port 9000"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-blue-500 ${
                  isLight ? 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Kategori / Tip
              </label>
              <input
                type="text"
                placeholder="Örn: Microservice, Database"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-blue-500 ${
                  isLight ? 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
                }`}
              />
            </div>
          </div>

          {/* Node Shape Selector */}
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Düğüm Şekli (Geometri)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {SHAPE_OPTIONS.map((item) => {
                const IconComp = item.icon;
                const isSelected = shape === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setShape(item.id)}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                        : isLight
                        ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <IconComp size={16} />
                    <span className="text-[10px]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Connect to existing node */}
          <div>
            <label className={`block text-xs font-medium mb-1 flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              <Link2 size={14} className="text-blue-500" /> Mevcut Düğüme Bağla (Opsiyonel)
            </label>
            <select
              value={connectToNodeId}
              onChange={(e) => setConnectToNodeId(e.target.value)}
              className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-blue-500 ${
                isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
              }`}
            >
              <option value="">Bağlantı Yok (Serbest Düğüm)</option>
              {existingNodes.map((n) => (
                <option key={n.id} value={n.id}>
                  ➡️ {n.data?.label || n.id} ({n.data?.type || 'Node'})
                </option>
              ))}
            </select>
          </div>

          {/* Color Presets */}
          <div>
            <label className={`block text-xs font-medium mb-2 flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              <Palette size={14} className="text-blue-500" /> Arka Plan Rengi
            </label>
            <div className="flex items-center gap-2">
              {COLOR_PRESETS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setBgColor(c)}
                  className={`h-7 w-7 rounded-lg transition-transform hover:scale-110 flex items-center justify-center border ${
                    bgColor === c ? 'ring-2 ring-blue-500 border-white scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Icon Selector Grid */}
          <div>
            <label className={`block text-xs font-medium mb-2 flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              <Sparkles size={14} className="text-amber-500" /> İkon Seçimi
            </label>
            <div className={`grid grid-cols-6 gap-2 max-h-40 overflow-y-auto p-2 rounded-xl border ${
              isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'
            }`}>
              {ICON_LIST.map((item) => {
                const IconComp = item.icon;
                const isSelected = icon === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setIcon(item.id)}
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

          {/* Footer Actions */}
          <div className={`pt-3 border-t flex items-center justify-end gap-3 ${
            isLight ? 'border-slate-200' : 'border-slate-800'
          }`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
                isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all shadow-lg shadow-blue-600/20"
            >
              Düğüm Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNodeModal;
