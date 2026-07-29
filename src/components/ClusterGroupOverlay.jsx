import React, { useMemo } from 'react';
import { useViewport } from '@xyflow/react';
import { Folder, Layers, Building, Tag } from 'lucide-react';

const CLUSTER_COLORS = [
  { bg: 'rgba(59, 130, 246, 0.08)', border: 'rgba(59, 130, 246, 0.4)', text: '#60a5fa', headerBg: 'rgba(59, 130, 246, 0.2)' },
  { bg: 'rgba(168, 85, 247, 0.08)', border: 'rgba(168, 85, 247, 0.4)', text: '#c084fc', headerBg: 'rgba(168, 85, 247, 0.2)' },
  { bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.4)', text: '#34d399', headerBg: 'rgba(16, 185, 129, 0.2)' },
  { bg: 'rgba(244, 63, 94, 0.08)', border: 'rgba(244, 63, 94, 0.4)', text: '#fb7185', headerBg: 'rgba(244, 63, 94, 0.2)' },
  { bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.4)', text: '#fbbf24', headerBg: 'rgba(245, 158, 11, 0.2)' },
  { bg: 'rgba(6, 182, 212, 0.08)', border: 'rgba(6, 182, 212, 0.4)', text: '#22d3ee', headerBg: 'rgba(6, 182, 212, 0.2)' },
  { bg: 'rgba(236, 72, 153, 0.08)', border: 'rgba(236, 72, 153, 0.4)', text: '#f472b6', headerBg: 'rgba(236, 72, 153, 0.2)' },
];

const ClusterGroupOverlay = ({ nodes = [], groupByKey = 'none', theme = 'dark' }) => {
  const { x: viewportX, y: viewportY, zoom } = useViewport();

  const isLight = theme === 'light';

  // Calculate clusters based on group key
  const clusters = useMemo(() => {
    if (!groupByKey || groupByKey === 'none' || nodes.length === 0) return [];

    const groupMap = {};

    nodes.forEach((node) => {
      let keyVal = null;
      if (groupByKey === 'dept') {
        keyVal = node.data?.dept || node.data?.details?.dept || node.data?.rawJson?.dept;
      } else if (groupByKey === 'category') {
        keyVal = node.data?.category || node.data?.details?.category || node.data?.rawJson?.category;
      } else if (groupByKey === 'type') {
        keyVal = node.data?.type || node.data?.details?.type || node.data?.rawJson?.type;
      }

      if (!keyVal) return;

      const groupName = String(keyVal).trim();
      if (!groupMap[groupName]) {
        groupMap[groupName] = [];
      }
      groupMap[groupName].push(node);
    });

    const NODE_WIDTH = 210;
    const NODE_HEIGHT = 80;
    const PADDING_X = 24;
    const PADDING_Y = 36;
    const HEADER_HEIGHT = 28;

    return Object.entries(groupMap)
      .filter(([_, groupNodes]) => groupNodes.length > 0)
      .map(([name, groupNodes], index) => {
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        groupNodes.forEach((n) => {
          const nx = n.position.x;
          const ny = n.position.y;
          if (nx < minX) minX = nx;
          if (ny < minY) minY = ny;
          if (nx + NODE_WIDTH > maxX) maxX = nx + NODE_WIDTH;
          if (ny + NODE_HEIGHT > maxY) maxY = ny + NODE_HEIGHT;
        });

        const colorStyle = CLUSTER_COLORS[index % CLUSTER_COLORS.length];

        return {
          id: `cluster-${name}`,
          name,
          count: groupNodes.length,
          bounds: {
            x: minX - PADDING_X,
            y: minY - PADDING_Y - HEADER_HEIGHT,
            width: maxX - minX + PADDING_X * 2,
            height: maxY - minY + PADDING_Y * 2 + HEADER_HEIGHT,
          },
          colorStyle,
        };
      });
  }, [nodes, groupByKey]);

  if (clusters.length === 0) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-0 overflow-visible"
      style={{
        transform: `translate(${viewportX}px, ${viewportY}px) scale(${zoom})`,
        transformOrigin: '0 0',
      }}
    >
      {clusters.map((cluster) => (
        <div
          key={cluster.id}
          className="absolute rounded-2xl transition-all duration-300 border-2 border-dashed shadow-sm flex flex-col pointer-events-none"
          style={{
            left: `${cluster.bounds.x}px`,
            top: `${cluster.bounds.y}px`,
            width: `${cluster.bounds.width}px`,
            height: `${cluster.bounds.height}px`,
            backgroundColor: isLight ? 'rgba(241, 245, 249, 0.6)' : cluster.colorStyle.bg,
            borderColor: cluster.colorStyle.border,
          }}
        >
          {/* Cluster Header Badge */}
          <div
            className="px-3 py-1 text-[11px] font-bold rounded-t-[14px] flex items-center justify-between border-b"
            style={{
              backgroundColor: cluster.colorStyle.headerBg,
              borderColor: cluster.colorStyle.border,
              color: isLight ? '#1e293b' : cluster.colorStyle.text,
            }}
          >
            <div className="flex items-center gap-1.5 font-mono uppercase tracking-wider">
              {groupByKey === 'dept' && <Building size={13} />}
              {groupByKey === 'category' && <Layers size={13} />}
              {groupByKey === 'type' && <Tag size={13} />}
              <span>{cluster.name}</span>
            </div>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{
                backgroundColor: isLight ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.3)',
                color: isLight ? '#0f172a' : '#ffffff',
              }}
            >
              {cluster.count} Düğüm
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClusterGroupOverlay;
