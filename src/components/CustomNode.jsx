import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { getIconComponent } from '../utils/iconMap';

const STATUS_COLORS = {
  active: 'bg-emerald-500 shadow-emerald-500/50',
  warning: 'bg-amber-500 shadow-amber-500/50',
  error: 'bg-rose-500 shadow-rose-500/50',
  inactive: 'bg-slate-500 shadow-slate-500/50',
};

const CustomNode = ({ data, selected }) => {
  const {
    label = 'Düğüm',
    subtitle = '',
    icon = 'box',
    bgColor = '#3b82f6',
    status = 'active',
    type = '',
    shape = 'rectangle', // 'rectangle' | 'circle' | 'diamond' | 'triangle' | 'pill'
    isHighlighted = false,
    theme = 'dark'
  } = data;

  const isLight = theme === 'light';
  const statusColor = STATUS_COLORS[status] || STATUS_COLORS.active;

  // Base selection class
  const selectionBorderClass = selected
    ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900 border-blue-500 scale-[1.03] z-20 shadow-blue-500/20 shadow-2xl'
    : isHighlighted
    ? 'ring-2 ring-amber-400 border-amber-400 node-highlighted'
    : isLight
    ? 'border-slate-300/90 hover:border-slate-400 hover:scale-[1.01] shadow-slate-300/50'
    : 'border-slate-700/70 hover:border-slate-500 hover:scale-[1.01]';

  const cardBgStyle = isLight
    ? { background: `linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(241, 245, 249, 0.98))` }
    : { background: `linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))` };

  const handleClass = isLight
    ? '!bg-blue-600 !w-3 !h-3 !border-2 !border-white'
    : '!bg-blue-500 !w-3 !h-3 !border-2 !border-slate-900';

  const textTitleClass = isLight ? 'text-slate-900 font-bold' : 'text-slate-100 font-semibold';
  const textSubClass = isLight ? 'text-slate-600' : 'text-slate-400';
  const tagClass = isLight
    ? 'bg-slate-200/90 text-slate-700 border-slate-300'
    : 'bg-slate-800/90 text-slate-300 border-slate-700';

  // 1. CIRCLE SHAPE
  if (shape === 'circle') {
    return (
      <div
        className={`relative w-32 h-32 rounded-full p-3 flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer shadow-lg select-none backdrop-blur-md border ${selectionBorderClass}`}
        style={{
          background: isLight
            ? `radial-gradient(circle at 30% 30%, ${bgColor}25, rgba(255, 255, 255, 0.98))`
            : `radial-gradient(circle at 30% 30%, ${bgColor}33, rgba(15, 23, 42, 0.98))`,
        }}
      >
        <Handle type="target" position={Position.Top} id="top" className={handleClass} />
        <Handle type="target" position={Position.Left} id="left" className={handleClass} />
        <Handle type="source" position={Position.Bottom} id="bottom" className={handleClass} />
        <Handle type="source" position={Position.Right} id="right" className={handleClass} />

        <div
          className="p-2 rounded-full text-white shadow-md mb-1.5 flex items-center justify-center shrink-0"
          style={{ backgroundColor: bgColor }}
        >
          {getIconComponent(icon, { size: 18 })}
        </div>
        <h3 className={`text-xs truncate max-w-[100px] tracking-tight ${textTitleClass}`}>
          {label}
        </h3>
        {subtitle && <p className={`text-[10px] truncate max-w-[90px] ${textSubClass}`}>{subtitle}</p>}
      </div>
    );
  }

  // 2. PILL SHAPE
  if (shape === 'pill') {
    return (
      <div
        className={`relative min-w-[180px] max-w-[240px] rounded-full px-4 py-2.5 flex items-center gap-3 transition-all duration-200 cursor-pointer shadow-lg select-none backdrop-blur-md border ${selectionBorderClass}`}
        style={{
          background: isLight
            ? `linear-gradient(135deg, ${bgColor}18, rgba(255, 255, 255, 0.98))`
            : `linear-gradient(135deg, ${bgColor}25, rgba(15, 23, 42, 0.98))`,
        }}
      >
        <Handle type="target" position={Position.Top} id="top" className={handleClass} />
        <Handle type="target" position={Position.Left} id="left" className={handleClass} />
        <Handle type="source" position={Position.Bottom} id="bottom" className={handleClass} />
        <Handle type="source" position={Position.Right} id="right" className={handleClass} />

        <div
          className="p-2 rounded-full text-white shadow-md flex items-center justify-center shrink-0"
          style={{ backgroundColor: bgColor }}
        >
          {getIconComponent(icon, { size: 16 })}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className={`text-xs truncate ${textTitleClass}`}>{label}</h3>
          {subtitle && <p className={`text-[10px] truncate ${textSubClass}`}>{subtitle}</p>}
        </div>
      </div>
    );
  }

  // 3. DIAMOND SHAPE
  if (shape === 'diamond') {
    return (
      <div
        className={`relative w-36 h-36 flex items-center justify-center transition-all duration-200 cursor-pointer select-none ${
          selected ? 'scale-[1.05] z-20' : 'hover:scale-[1.02]'
        }`}
      >
        <Handle type="target" position={Position.Top} id="top" className={handleClass} />
        <Handle type="target" position={Position.Left} id="left" className={handleClass} />
        <Handle type="source" position={Position.Bottom} id="bottom" className={handleClass} />
        <Handle type="source" position={Position.Right} id="right" className={handleClass} />

        <div
          className={`absolute inset-2 rotate-45 rounded-xl border transition-all shadow-xl backdrop-blur-md ${
            selected
              ? 'border-blue-500 ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900'
              : isLight
              ? 'border-slate-300 bg-white/95'
              : 'border-slate-700/80 bg-slate-900/95'
          }`}
          style={{
            background: isLight
              ? `linear-gradient(135deg, ${bgColor}20, rgba(255, 255, 255, 0.98))`
              : `linear-gradient(135deg, ${bgColor}33, rgba(15, 23, 42, 0.98))`,
          }}
        />

        <div className="relative z-10 text-center p-2 flex flex-col items-center justify-center max-w-[90px]">
          <div
            className="p-1.5 rounded-lg text-white shadow-md mb-1"
            style={{ backgroundColor: bgColor }}
          >
            {getIconComponent(icon, { size: 16 })}
          </div>
          <h3 className={`text-[11px] truncate w-full ${textTitleClass}`}>{label}</h3>
          {subtitle && <p className={`text-[9px] truncate w-full ${textSubClass}`}>{subtitle}</p>}
        </div>
      </div>
    );
  }

  // 4. TRIANGLE SHAPE
  if (shape === 'triangle') {
    return (
      <div
        className={`relative w-36 h-32 flex flex-col items-center justify-end pb-3 transition-all duration-200 cursor-pointer select-none ${
          selected ? 'scale-[1.05] z-20' : 'hover:scale-[1.02]'
        }`}
      >
        <Handle type="target" position={Position.Top} id="top" className={handleClass} />
        <Handle type="target" position={Position.Left} id="left" className={handleClass} />
        <Handle type="source" position={Position.Bottom} id="bottom" className={handleClass} />
        <Handle type="source" position={Position.Right} id="right" className={handleClass} />

        <svg className="absolute inset-0 w-full h-full drop-shadow-xl" viewBox="0 0 100 90">
          <polygon
            points="50,5 95,85 5,85"
            fill={isLight ? 'rgba(255, 255, 255, 0.98)' : 'rgba(15, 23, 42, 0.95)'}
            stroke={selected ? '#3b82f6' : isLight ? '#cbd5e1' : bgColor}
            strokeWidth={selected ? '3' : '2'}
          />
        </svg>

        <div className="relative z-10 text-center flex flex-col items-center justify-center max-w-[85px]">
          <div
            className="p-1.5 rounded-full text-white shadow-md mb-0.5"
            style={{ backgroundColor: bgColor }}
          >
            {getIconComponent(icon, { size: 14 })}
          </div>
          <h3 className={`text-[10px] truncate w-full ${textTitleClass}`}>{label}</h3>
        </div>
      </div>
    );
  }

  // 5. STANDARD RECTANGLE SHAPE (Default)
  return (
    <div
      className={`relative min-w-[210px] max-w-[280px] rounded-xl p-3.5 transition-all duration-200 cursor-pointer shadow-lg select-none backdrop-blur-md border ${selectionBorderClass}`}
      style={cardBgStyle}
    >
      <Handle type="target" position={Position.Top} id="top" className={handleClass} />
      <Handle type="target" position={Position.Left} id="left" className={handleClass} />
      <Handle type="source" position={Position.Bottom} id="bottom" className={handleClass} />
      <Handle type="source" position={Position.Right} id="right" className={handleClass} />

      {/* Top Accent Line */}
      <div
        className="absolute top-0 left-3 right-3 h-[3px] rounded-full opacity-80"
        style={{ backgroundColor: bgColor }}
      />

      <div className="flex items-start gap-3 mt-1">
        <div
          className="relative p-2.5 rounded-lg text-white shadow-md flex items-center justify-center shrink-0"
          style={{ backgroundColor: bgColor }}
        >
          {getIconComponent(icon, { size: 20 })}
          <span
            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 ${
              isLight ? 'border-white' : 'border-slate-900'
            } shadow-sm ${statusColor}`}
            title={`Durum: ${status}`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <h3 className={`text-sm truncate tracking-tight ${textTitleClass}`}>
              {label}
            </h3>
          </div>

          {subtitle && (
            <p className={`text-xs truncate leading-tight ${textSubClass}`}>
              {subtitle}
            </p>
          )}

          {type && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${tagClass}`}>
                {type}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(CustomNode);
