import { toPng, toSvg } from 'html-to-image';

/**
 * Downloads current nodes and edges as a JSON file.
 */
export function exportToJson(nodes, edges, filename = 'graf-verisi.json') {
  const exportData = {
    exportDate: new Date().toISOString(),
    nodes: nodes.map((n) => ({
      id: n.id,
      label: n.data?.label,
      subtitle: n.data?.subtitle,
      icon: n.data?.icon,
      bgColor: n.data?.bgColor,
      status: n.data?.status,
      type: n.data?.type,
      shape: n.data?.shape || 'rectangle',
      position: n.position,
      details: n.data?.details || {},
      rawJson: n.data?.rawJson || {}
    })),
    edges: edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      animated: e.animated
    }))
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Downloads the React Flow canvas viewport as a crisp, high-resolution PNG image.
 */
export async function exportToPng(
  elementSelector = '.react-flow',
  filename = 'graf-gorseli.png',
  bgColor = '#0b0f19'
) {
  const node = document.querySelector(elementSelector);
  if (!node) return;

  try {
    const dataUrl = await toPng(node, {
      backgroundColor: bgColor,
      pixelRatio: 2, // 2x HD Resolution to remove pixelation and blur
      quality: 1.0,
      cacheBust: true,
      filter: (domNode) => {
        if (
          domNode.classList &&
          (domNode.classList.contains('react-flow__controls') ||
            domNode.classList.contains('react-flow__minimap'))
        ) {
          return false;
        }
        return true;
      }
    });

    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataUrl);
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  } catch (err) {
    console.error('PNG dışa aktarma hatası:', err);
  }
}

/**
 * Downloads the React Flow canvas viewport as a vector SVG file.
 */
export async function exportToSvg(
  elementSelector = '.react-flow',
  filename = 'graf-vektorel.svg',
  bgColor = '#0b0f19'
) {
  const node = document.querySelector(elementSelector);
  if (!node) return;

  try {
    const dataUrl = await toSvg(node, {
      backgroundColor: bgColor,
      filter: (domNode) => {
        if (
          domNode.classList &&
          (domNode.classList.contains('react-flow__controls') ||
            domNode.classList.contains('react-flow__minimap'))
        ) {
          return false;
        }
        return true;
      }
    });

    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataUrl);
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  } catch (err) {
    console.error('SVG dışa aktarma hatası:', err);
  }
}
