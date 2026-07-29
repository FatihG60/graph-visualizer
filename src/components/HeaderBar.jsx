import React, { useRef } from 'react';
import {
  GitGraph,
  Search,
  Plus,
  Code,
  RotateCcw,
  LayoutList,
  Compass,
  Grid,
  Circle,
  Network,
  Download,
  Image,
  Upload,
  Sun,
  Moon,
  Code2,
  Layers,
  FolderTree,
  Building,
  Tag
} from 'lucide-react';

const LAYOUT_OPTIONS = [
  { id: 'TB', label: 'Hiyerarşik (Dikey)', icon: LayoutList },
  { id: 'LR', label: 'Yatay (Soldan Sağa)', icon: Compass },
  { id: 'circular', label: 'Dairesel (Circular)', icon: Circle },
  { id: 'grid', label: 'Izgara (Grid)', icon: Grid },
  { id: 'organic', label: 'Organik (Force)', icon: Network },
];

const GROUP_OPTIONS = [
  { id: 'none', label: 'Gruplama Yok', icon: FolderTree },
  { id: 'dept', label: 'Departman (dept)', icon: Building },
  { id: 'category', label: 'Kategori', icon: Layers },
  { id: 'type', label: 'Tip (type)', icon: Tag },
];

const HeaderBar = ({
  currentLayout,
  onLayoutChange,
  groupByKey,
  onGroupByKeyChange,
  searchQuery,
  onSearchChange,
  onOpenJsonEditor,
  onOpenAddNode,
  onResetView,
  onExportJson,
  onExportPng,
  onExportSvg,
  onOpenDiagramModal,
  onFileUpload,
  theme,
  onToggleTheme,
  nodesCount,
  edgesCount
}) => {
  const headerFileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const isLight = theme === 'light';

  return (
    <header className={`h-16 px-5 glass-panel border-b flex items-center justify-between z-30 shrink-0 select-none transition-colors ${
      isLight ? 'border-slate-200 bg-white/90 text-slate-800' : 'border-slate-800 text-slate-100'
    }`}>
      {/* Brand Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 border border-white/20">
          <GitGraph size={22} />
        </div>
        <div>
          <h1 className={`text-base font-extrabold tracking-tight flex items-center gap-1.5 m-0 p-0 leading-tight ${
            isLight ? 'text-slate-900' : 'text-slate-100'
          }`}>
            Graph
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block shadow-sm shadow-emerald-400/80 ml-0.5"></span>
          </h1>
          <p className={`text-[11px] font-normal m-0 p-0 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {nodesCount} Düğüm • {edgesCount} İlişki Bağlantısı
          </p>
        </div>
      </div>

      {/* Layout Mode Selector Pills */}
      <div className={`hidden lg:flex items-center gap-1 p-1 rounded-xl border ${
        isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900/90 border-slate-800'
      }`}>
        {LAYOUT_OPTIONS.map((mode) => {
          const IconComp = mode.icon;
          const isActive = currentLayout === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onLayoutChange(mode.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              title={mode.label}
            >
              <IconComp size={14} />
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* Cluster / Grouping Selector Dropdown */}
      <div className={`hidden xl:flex items-center gap-1.5 px-2 py-1 rounded-xl border ${
        isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <span className={`text-[11px] font-semibold uppercase tracking-wider px-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          Grup Çerçevesi:
        </span>
        {GROUP_OPTIONS.map((grp) => {
          const isActive = groupByKey === grp.id;
          const IconComp = grp.icon;
          return (
            <button
              key={grp.id}
              onClick={() => onGroupByKeyChange(grp.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                isActive
                  ? 'bg-purple-600 text-white shadow-sm'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              title={grp.label}
            >
              <IconComp size={13} />
              <span>{grp.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Actions */}
      <div className="flex items-center gap-2 xl:gap-3">
        {/* Real-time Search Box */}
        <div className="relative w-32 xl:w-40">
          <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-slate-400'}`} />
          <input
            type="text"
            placeholder="Düğüm ara..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full pl-8 pr-3 py-1.5 border rounded-xl text-xs focus:outline-none focus:border-blue-500 transition-colors ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400'
                : 'bg-slate-900/90 border-slate-800 text-slate-100 placeholder-slate-500'
            }`}
          />
        </div>

        {/* Hidden Direct File Input */}
        <input
          type="file"
          ref={headerFileInputRef}
          accept=".json,application/json"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          title={isLight ? 'Karanlık Mod (Dark Theme)' : 'Aydınlık Mod (Light Theme)'}
          className={`p-2 rounded-xl border transition-all flex items-center justify-center ${
            isLight
              ? 'bg-amber-500/10 text-amber-600 border-amber-500/30 hover:bg-amber-500/20'
              : 'bg-slate-900 text-amber-400 border-slate-800 hover:bg-slate-800'
          }`}
        >
          {isLight ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* File Upload Button */}
        <button
          onClick={() => headerFileInputRef.current?.click()}
          title="Bilgisayardan JSON Yükle"
          className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 text-xs font-medium transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Upload size={14} /> Dosya
        </button>

        {/* JSON Editor Button */}
        <button
          onClick={onOpenJsonEditor}
          title="JSON Veri Editörü"
          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 shadow-sm ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
          }`}
        >
          <Code size={14} className="text-blue-500" /> Editör
        </button>

        {/* Add Node Button */}
        <button
          onClick={onOpenAddNode}
          title="Yeni Düğüm Ekle"
          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all flex items-center gap-1.5 shadow-lg shadow-blue-600/20"
        >
          <Plus size={14} /> Düğüm
        </button>

        {/* Mermaid / PlantUML Code Export Button */}
        <button
          onClick={onOpenDiagramModal}
          title="Mermaid.js / PlantUML Diyagram Kodu Al"
          className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 text-xs font-medium transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Code2 size={14} /> Diyagram
        </button>

        {/* Export JSON Button */}
        <button
          onClick={onExportJson}
          title="Grafı JSON Olarak İndir"
          className={`p-2 rounded-xl border transition-colors flex items-center gap-1 text-xs text-emerald-500 ${
            isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200' : 'bg-slate-900 hover:bg-slate-800 border-slate-800'
          }`}
        >
          <Download size={15} /> <span className="hidden xl:inline">JSON</span>
        </button>

        {/* Export PNG Button */}
        <button
          onClick={onExportPng}
          title="Grafı PNG Görsel Olarak İndir"
          className={`p-2 rounded-xl border transition-colors flex items-center gap-1 text-xs text-blue-500 ${
            isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200' : 'bg-slate-900 hover:bg-slate-800 border-slate-800'
          }`}
        >
          <Image size={15} /> <span className="hidden xl:inline">PNG</span>
        </button>

        {/* Export SVG Button */}
        <button
          onClick={onExportSvg}
          title="Grafı Vektörel SVG Olarak İndir"
          className={`p-2 rounded-xl border transition-colors flex items-center gap-1 text-xs text-pink-500 ${
            isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200' : 'bg-slate-900 hover:bg-slate-800 border-slate-800'
          }`}
        >
          <Layers size={15} /> <span className="hidden xl:inline">SVG</span>
        </button>

        {/* Reset View Button */}
        <button
          onClick={onResetView}
          title="Görünümü Ortala & Sıfırla"
          className={`p-2 rounded-xl border transition-colors ${
            isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600' : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <RotateCcw size={15} />
        </button>
      </div>
    </header>
  );
};

export default HeaderBar;
