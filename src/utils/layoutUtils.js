import dagre from 'dagre';

const nodeWidth = 220;
const nodeHeight = 90;

/**
 * Calculates hierarchical Dagre layout (Vertical, Horizontal, etc.)
 */
export function getDagreLayout(nodes, edges, direction = 'TB') {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === 'LR' || direction === 'RL';
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: isHorizontal ? 60 : 80,
    ranksep: isHorizontal ? 120 : 100
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2
      }
    };
  });

  return { nodes: layoutedNodes, edges };
}

/**
 * Calculates Circular / Radial Layout
 */
export function getCircularLayout(nodes, edges) {
  const count = nodes.length;
  if (count === 0) return { nodes, edges };

  const radius = Math.max(250, count * 35);
  const centerX = radius + 100;
  const centerY = radius + 100;

  const layoutedNodes = nodes.map((node, index) => {
    const angle = (index / count) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle) - nodeWidth / 2;
    const y = centerY + radius * Math.sin(angle) - nodeHeight / 2;

    return {
      ...node,
      position: { x, y }
    };
  });

  return { nodes: layoutedNodes, edges };
}

/**
 * Calculates Grid Matrix Layout
 */
export function getGridLayout(nodes, edges) {
  const count = nodes.length;
  if (count === 0) return { nodes, edges };

  const cols = Math.ceil(Math.sqrt(count));
  const spacingX = 260;
  const spacingY = 160;

  const layoutedNodes = nodes.map((node, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);

    return {
      ...node,
      position: {
        x: col * spacingX,
        y: row * spacingY
      }
    };
  });

  return { nodes: layoutedNodes, edges };
}

/**
 * Calculates Organic / Spaced Force-like Layout
 */
export function getOrganicLayout(nodes, edges) {
  const count = nodes.length;
  if (count === 0) return { nodes, edges };

  const cols = Math.ceil(Math.sqrt(count * 1.5));
  const spacingX = 280;
  const spacingY = 180;

  const layoutedNodes = nodes.map((node, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    // Add jitter offset for dynamic visual feel
    const offsetX = (index % 2 === 0 ? 30 : -30);
    const offsetY = (index % 3 === 0 ? 25 : -25);

    return {
      ...node,
      position: {
        x: col * spacingX + offsetX,
        y: row * spacingY + offsetY
      }
    };
  });

  return { nodes: layoutedNodes, edges };
}
