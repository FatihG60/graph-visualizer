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
 * @param {Object|Array|string} jsonInput
 * @param {string} matchKey - Optional key name to match nodes sharing the same value
 */
export function parseJsonToGraph(jsonInput, matchKey = '') {
  if (!jsonInput) return { nodes: [], edges: [] };

  let data;
  try {
    data = typeof jsonInput === 'string' ? JSON.parse(jsonInput) : jsonInput;
  } catch (err) {
    throw new Error('Geçersiz JSON Formatı: ' + err.message);
  }

  const cleanMatchKey = matchKey ? matchKey.trim().toLowerCase() : '';

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

    let edges = (data.edges || []).map((e, idx) => ({
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

    // If matchKey is specified, also build edges based on column value matching!
    if (cleanMatchKey) {
      const columnEdges = buildEdgesByColumnMatch(nodes, cleanMatchKey);
      edges = [...edges, ...columnEdges];
    }

    return { nodes, edges };
  }

  // Case 2: Array of items (e.g. list of objects)
  if (Array.isArray(data)) {
    const nodes = data.map((item, idx) => {
      const nodeId = String(item.id || item.ID || `node_${idx + 1}`);
      const label = item.name || item.label || item.title || item.isim || `Öğe ${idx + 1}`;
      const subtitle = item.type || item.category || item.dept || item.role || '';

      return {
        id: nodeId,
        type: 'customNode',
        position: { x: (idx % 4) * 230, y: Math.floor(idx / 4) * 160 },
        data: {
          label,
          subtitle,
          icon: 'box',
          bgColor: getRandomColor(idx),
          status: 'active',
          type: item.type || 'Öğe',
          shape: 'rectangle',
          details: item,
          rawJson: item
        }
      };
    });

    let edges = [];

    // If matchKey is provided, match items sharing the same column value or parentId link
    if (cleanMatchKey) {
      edges = buildEdgesByColumnMatch(nodes, cleanMatchKey);
    }

    return { nodes, edges };
  }

  // Case 3: Arbitrary Nested JSON Object (Tree Parser)
  const nodes = [];
  const edges = [];
  let nodeIdCounter = 1;

  function processValue(keyName, value, parentId = null, depth = 0) {
    const currentId = `n_${nodeIdCounter++}`;
    const color = getRandomColor(depth);

    if (value === null || typeof value !== 'object') {
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
        processValue(`[${index}]`, item, currentId, depth + 1);
      });
    } else {
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

    // Default tree hierarchy edge if no matchKey, OR parent-child link
    if (parentId && !cleanMatchKey) {
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

  if (cleanMatchKey) {
    const columnEdges = buildEdgesByColumnMatch(nodes, cleanMatchKey);
    return { nodes, edges: columnEdges };
  }

  return { nodes, edges };
}

/**
 * Builds edges by matching values of a specific column/key across nodes.
 */
function buildEdgesByColumnMatch(nodes, matchKey) {
  const edges = [];
  const groups = new Map(); // key = matching value, value = array of nodeIds
  let edgeCounter = 1;

  nodes.forEach((node) => {
    const details = node.data?.details || node.data?.rawJson || {};

    // Find the property value ignoring case
    let targetValue = null;
    Object.keys(details).forEach((k) => {
      if (k.toLowerCase() === matchKey) {
        targetValue = details[k];
      }
    });

    if (targetValue !== null && targetValue !== undefined && targetValue !== '') {
      const stringifiedVal = String(targetValue);

      // Check parent-child ID matching (e.g. if node.id === targetValue)
      const parentNode = nodes.find((n) => n.id === stringifiedVal);
      if (parentNode && parentNode.id !== node.id) {
        // Direct parent ID match!
        edges.push({
          id: `e_match_${edgeCounter++}`,
          source: parentNode.id,
          target: node.id,
          label: `${matchKey}: ${stringifiedVal}`,
          animated: true,
          style: { stroke: '#3b82f6', strokeWidth: 2 },
          labelStyle: DEFAULT_LABEL_STYLE,
          labelBgStyle: DEFAULT_LABEL_BG_STYLE,
          labelBgPadding: [6, 4],
          markerEnd: { type: 'arrowclosed', color: '#3b82f6' }
        });
      } else {
        // Group by value
        if (!groups.has(stringifiedVal)) {
          groups.set(stringifiedVal, []);
        }
        groups.get(stringifiedVal).push(node.id);
      }
    }
  });

  // Connect nodes sharing the same column value in a group
  groups.forEach((nodeIds, val) => {
    if (nodeIds.length > 1) {
      for (let i = 0; i < nodeIds.length - 1; i++) {
        const sourceId = nodeIds[i];
        const targetId = nodeIds[i + 1];
        edges.push({
          id: `e_match_grp_${edgeCounter++}`,
          source: sourceId,
          target: targetId,
          label: `${matchKey}: ${val}`,
          animated: true,
          style: { stroke: '#8b5cf6', strokeWidth: 2 },
          labelStyle: DEFAULT_LABEL_STYLE,
          labelBgStyle: DEFAULT_LABEL_BG_STYLE,
          labelBgPadding: [6, 4],
          markerEnd: { type: 'arrowclosed', color: '#8b5cf6' }
        });
      }
    }
  });

  return edges;
}
