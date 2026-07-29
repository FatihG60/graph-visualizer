import React, { useState } from 'react';
import { X, Copy, Check, Download, Code2, FileCode } from 'lucide-react';
import { generateMermaidCode, generatePlantUmlCode } from '../utils/diagramUtils';

const DiagramModal = ({ isOpen, onClose, nodes = [], edges = [], theme = 'dark' }) => {
  const [activeFormat, setActiveFormat] = useState('mermaid'); // 'mermaid' | 'plantuml'
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isLight = document.body.classList.contains('light-theme') || theme === 'light';

  const mermaidCode = generateMermaidCode(nodes, edges);
  const plantUmlCode = generatePlantUmlCode(nodes, edges);

  const currentCode = activeFormat === 'mermaid' ? mermaidCode : plantUmlCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = activeFormat === 'mermaid' ? 'mmd' : 'puml';
    const filename = `graf-diyagram.${ext}`;
    const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'glass-modal border-slate-800 text-slate-100'
      }`}>
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-500 border border-purple-500/30">
              <Code2 size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold m-0">Diyagram Kodu Dışa Aktar</h2>
              <p className={`text-xs m-0 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Grafik yapısını Mermaid.js veya PlantUML diyagram koduna dönüştürün
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

        {/* Format Selector Tabs */}
        <div className={`p-3 border-b flex items-center justify-between ${
          isLight ? 'bg-slate-100/60 border-slate-200' : 'bg-slate-950/40 border-slate-800'
        }`}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFormat('mermaid')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeFormat === 'mermaid'
                  ? 'bg-purple-600 text-white shadow-md'
                  : isLight
                  ? 'text-slate-600 hover:bg-slate-200'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <FileCode size={14} /> Mermaid.js
            </button>
            <button
              onClick={() => setActiveFormat('plantuml')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeFormat === 'plantuml'
                  ? 'bg-purple-600 text-white shadow-md'
                  : isLight
                  ? 'text-slate-600 hover:bg-slate-200'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <FileCode size={14} /> PlantUML
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : isLight
                  ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
            >
              {copied ? <Check size={14} className="text-white" /> : <Copy size={14} />}
              {copied ? 'Kopyalandı!' : 'Kodu Kopyala'}
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-all flex items-center gap-1.5 shadow-md shadow-purple-600/20"
            >
              <Download size={14} /> Kodu İndir (.{activeFormat === 'mermaid' ? 'mmd' : 'puml'})
            </button>
          </div>
        </div>

        {/* Code View Area */}
        <div className={`p-4 flex-1 overflow-hidden flex flex-col ${isLight ? 'bg-slate-50' : 'bg-slate-950'}`}>
          <pre className={`flex-1 w-full p-4 border rounded-xl font-mono text-xs overflow-y-auto leading-relaxed shadow-inner ${
            isLight
              ? 'bg-white border-slate-300 text-slate-900'
              : 'bg-slate-900/90 border-slate-800 text-purple-300'
          }`}>
            {currentCode}
          </pre>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex items-center justify-between ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'
        }`}>
          <p className={`text-xs m-0 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            💡 İpucu: Kopyaladığınız kodu <strong>mermaid.live</strong> veya <strong>plantuml.com</strong> üzerinde yapıştırıp doğrudan çalıştırabilirsiniz.
          </p>
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
    </div>
  );
};

export default DiagramModal;
