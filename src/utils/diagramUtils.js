/**
 * Generates Mermaid.js flowchart diagram code from nodes and edges.
 */
export function generateMermaidCode(nodes = [], edges = []) {
  if (nodes.length === 0) return '%% Graf boş %%';

  let lines = ['flowchart TD'];

  // Add Nodes
  nodes.forEach((node) => {
    const label = (node.data?.label || node.id).replace(/"/g, "'");
    const shape = node.data?.shape || 'rectangle';

    // Mermaid shape formatting
    let nodeStr = '';
    if (shape === 'circle') {
      nodeStr = `    ${node.id}(("${label}"))`;
    } else if (shape === 'pill') {
      nodeStr = `    ${node.id}(["${label}"])`;
    } else if (shape === 'diamond') {
      nodeStr = `    ${node.id}{"${label}"}`;
    } else if (shape === 'triangle') {
      nodeStr = `    ${node.id}>"${label}"]`;
    } else {
      nodeStr = `    ${node.id}["${label}"]`;
    }
    lines.push(nodeStr);
  });

  lines.push(''); // blank line

  // Add Edges
  edges.forEach((edge) => {
    const label = edge.label ? `|"${edge.label.replace(/"/g, "'")}"|` : '';
    lines.push(`    ${edge.source} -->${label} ${edge.target}`);
  });

  return lines.join('\n');
}

/**
 * Generates PlantUML object diagram code from nodes and edges.
 */
export function generatePlantUmlCode(nodes = [], edges = []) {
  if (nodes.length === 0) return "' Graf boş";

  let lines = ['@startuml', 'skinparam backgroundColor #0b0f19', 'skinparam defaultFontColor #f8fafc', ''];

  // Add Nodes as Objects
  nodes.forEach((node) => {
    const label = (node.data?.label || node.id).replace(/"/g, "'");
    const subtitle = (node.data?.subtitle || '').replace(/"/g, "'");
    const type = (node.data?.type || 'Node').replace(/"/g, "'");

    lines.push(`object "${label}" as ${node.id} {`);
    if (type) lines.push(`  type = "${type}"`);
    if (subtitle) lines.push(`  desc = "${subtitle}"`);
    lines.push('}');
  });

  lines.push('');

  // Add Edges
  edges.forEach((edge) => {
    const label = edge.label ? ` : "${edge.label.replace(/"/g, "'")}"` : '';
    lines.push(`${edge.source} --> ${edge.target}${label}`);
  });

  lines.push('', '@enduml');

  return lines.join('\n');
}
