import React, { useState, useRef } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileText,
  Upload,
  FileUp
} from 'lucide-react';
import { PRESETS } from '../utils/presets';

const JsonEditorModal = ({ isOpen, onClose, onApplyJson, theme = 'dark' }) => {
  const [jsonText, setJsonText] = useState(
    JSON.stringify(PRESETS[0].data, null, 2)
  );
  const [error, setError] = useState(null);
  const [activePreset, setActivePreset] = useState(PRESETS[0].id);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const isLight = document.body.classList.contains('light-theme') || theme === 'light';

  const handleSelectPreset = (preset) => {
    setActivePreset(preset.id);
    setJsonText(JSON.stringify(preset.data, null, 2));
    setError(null);
  };

  const handleTextChange = (text) => {
    setJsonText(text);
    try {
      JSON.parse(text);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFileRead = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      handleTextChange(content);
      setActivePreset(null);
    };
    reader.readAsText(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileRead(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileRead(file);
  };

  const handleSubmit = () => {
    try {
      const parsed = JSON.parse(jsonText);
      onApplyJson(parsed);
      onClose();
    } catch (err) {
      setError('Geçersiz JSON formatı: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'glass-modal border-slate-800 text-slate-100'
      }`}>
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-500 border border-blue-500/30">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold m-0">JSON Veri Yükle & Düzenle</h2>
              <p className={`text-xs m-0 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                JSON dosyanızı yükleyin, yazın veya hazır şablonlardan seçin
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

        {/* Preset Cards & Upload Button Bar */}
        <div className={`p-4 border-b space-y-3 ${
          isLight ? 'bg-slate-100/60 border-slate-200' : 'bg-slate-950/40 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <label className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}>
              <Sparkles size={14} className="text-amber-500" /> Hazır Şablonlar veya Dosya Seç
            </label>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-500 border border-indigo-500/30 text-xs font-medium transition-all flex items-center gap-1.5"
            >
              <FileUp size={14} /> Bilgisayardan JSON Yükle
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  activePreset === preset.id
                    ? 'bg-blue-600/20 border-blue-500/80 ring-1 ring-blue-500/50'
                    : isLight
                    ? 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm'
                    : 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800'
                }`}
              >
                <div>
                  <h3 className={`text-xs font-semibold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{preset.title}</h3>
                  <p className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {preset.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Textarea Code Editor + Drag & Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`p-4 flex-1 overflow-hidden flex flex-col relative transition-all ${
            isLight ? 'bg-slate-50' : 'bg-slate-950'
          } ${isDragging ? 'ring-2 ring-blue-500 ring-inset bg-blue-500/10' : ''}`}
        >
          {isDragging && (
            <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-sm z-20 flex flex-col items-center justify-center border-2 border-dashed border-blue-400 pointer-events-none">
              <Upload size={40} className="text-blue-500 animate-bounce mb-2" />
              <p className="text-sm font-semibold text-blue-600">JSON Dosyasını Buraya Bırakın</p>
            </div>
          )}

          <div className="flex items-center justify-between mb-2">
            <label className={`text-xs font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              JSON Kodu (Sürükle-Bırak Destekli):
            </label>
            {error ? (
              <span className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                <AlertCircle size={14} /> {error}
              </span>
            ) : (
              <span className="text-xs text-emerald-500 flex items-center gap-1 font-medium">
                <CheckCircle2 size={14} /> Geçerli JSON
              </span>
            )}
          </div>

          <textarea
            value={jsonText}
            onChange={(e) => handleTextChange(e.target.value)}
            spellCheck={false}
            className={`flex-1 w-full p-4 border rounded-xl font-mono text-xs focus:outline-none focus:border-blue-500 resize-none leading-relaxed shadow-inner ${
              isLight
                ? 'bg-white border-slate-300 text-slate-900'
                : 'bg-slate-900/90 border-slate-800 text-emerald-400'
            }`}
            rows={12}
          />
        </div>

        {/* Footer Actions */}
        <div className={`p-4 border-t flex items-center justify-end gap-3 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
              isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            İptal
          </button>
          <button
            onClick={handleSubmit}
            disabled={!!error}
            className={`px-5 py-2 rounded-xl text-xs font-medium transition-all shadow-lg ${
              error
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
            }`}
          >
            Grafa Dönüştür & Uygula
          </button>
        </div>
      </div>
    </div>
  );
};

export default JsonEditorModal;
