// Color palette generator for automatic styling
const AUTO_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#10b981', // emerald
  '#f59e0b', // amber
  '#06b6d4', // cyan
  '#6366f1', // indigo
  '#f43f5e', // rose
  '#14b8a6', // teal
];

const getRandomColor = (index) => AUTO_COLORS[index % AUTO_COLORS.length];

const DEFAULT_LABEL_STYLE = { fill: '#f8fafc', fontWeight: 600, fontSize: '11px' };
const DEFAULT_LABEL_BG_STYLE = { fill: '#0f172a', rx: 6, ry: 6 };

/**
 * Converts arbitrary JSON into nodes and edges for React Flow.
 */
export function parseJsonToGraph(jsonInput) {
  if (!jsonInput) return { nodes: [], edges: [] };

  let data;
  try {
    data = typeof jsonInput === 'string' ? JSON.parse(jsonInput) : jsonInput;
  } catch (err) {
    throw new Error('Geçersiz JSON Formatı: ' + err.message);
  }

  // Case 1: Standard Graph Object with explicit { nodes: [...], edges: [...] }
  if (data && Array.isArray(data.nodes)) {
    const nodes = data.nodes.map((n, idx) => ({
      id: String(n.id || `node_${idx}`),
      type: 'customNode',
      position: n.position || { x: (idx % 4) * 220, y: Math.floor(idx / 4) * 150 },
      data: {
        label: n.label || n.name || n.title || `Node ${n.id}`,
        subtitle: n.subtitle || n.type || n.category || '',
        icon: n.icon || 'box',
        bgColor: n.bgColor || getRandomColor(idx),
        status: n.status || 'active',
        type: n.type || 'Standard',
        shape: n.shape || 'rectangle',
        details: n.details || n.data || n,
        rawJson: n
      }
    }));

    const edges = (data.edges || []).map((e, idx) => ({
      id: String(e.id || `edge_${idx}`),
      source: String(e.source),
      target: String(e.target),
      label: e.label || e.type || e.relationship || '',
      animated: e.animated !== undefined ? e.animated : true,
      style: { stroke: e.color || '#475569', strokeWidth: 2 },
      labelStyle: DEFAULT_LABEL_STYLE,
      labelBgStyle: DEFAULT_LABEL_BG_STYLE,
      labelBgPadding: [6, 4],
      markerEnd: { type: 'arrowclosed', color: e.color || '#475569' }
    }));

    return { nodes, edges };
  }

  // Case 2: Arbitrary Nested JSON Object / Array Parser (Tree to Graph Converter)
  const nodes = [];
  const edges = [];
  let nodeIdCounter = 1;

  function processValue(keyName, value, parentId = null, depth = 0) {
    const currentId = `n_${nodeIdCounter++}`;
    const color = getRandomColor(depth);

    if (value === null || typeof value !== 'object') {
      // Primitive value node
      nodes.push({
        id: currentId,
        type: 'customNode',
        position: { x: 0, y: 0 },
        data: {
          label: keyName,
          subtitle: String(value),
          icon: typeof value === 'number' ? 'zap' : 'file',
          bgColor: color,
          status: 'active',
          type: typeof value,
          details: { key: keyName, value: value },
          rawJson: { [keyName]: value }
        }
      });
    } else if (Array.isArray(value)) {
      // Array node
      nodes.push({
        id: currentId,
        type: 'customNode',
        position: { x: 0, y: 0 },
        data: {
          label: keyName,
          subtitle: `[${value.length} elemanlı dizi]`,
          icon: 'layers',
          bgColor: color,
          status: 'active',
          type: 'Array',
          details: { count: value.length, items: value },
          rawJson: value
        }
      });

      value.forEach((item, index) => {
        const childId = processValue(`[${index}]`, item, currentId, depth + 1);
      });
    } else {
      // Object node
      const keysCount = Object.keys(value).length;
      nodes.push({
        id: currentId,
        type: 'customNode',
        position: { x: 0, y: 0 },
        data: {
          label: keyName,
          subtitle: `{${keysCount} anahtar}`,
          icon: depth === 0 ? 'globe' : 'folder',
          bgColor: color,
          status: 'active',
          type: 'Object',
          details: value,
          rawJson: value
        }
      });

      Object.entries(value).forEach(([k, v]) => {
        processValue(k, v, currentId, depth + 1);
      });
    }

    if (parentId) {
      edges.push({
        id: `e_${parentId}_${currentId}`,
        source: parentId,
        target: currentId,
        label: keyName,
        animated: true,
        style: { stroke: '#475569', strokeWidth: 2 },
        labelStyle: DEFAULT_LABEL_STYLE,
        labelBgStyle: DEFAULT_LABEL_BG_STYLE,
        labelBgPadding: [6, 4],
        markerEnd: { type: 'arrowclosed', color: '#475569' }
      });
    }

    return currentId;
  }

  processValue('Kök (Root)', data, null, 0);
  return { nodes, edges };
}
