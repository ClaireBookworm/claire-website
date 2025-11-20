// Helper function to get random colors for books
export function getBookColor(index) {
  const colors = [
    '#8B4513', '#A0522D', '#CD853F', '#DEB887', '#F4A460', // Browns
    '#2F4F4F', '#708090', '#778899', '#B0C4DE', '#D3D3D3', // Grays
    '#8B0000', '#DC143C', '#B22222', '#CD5C5C', '#F08080', // Reds
    '#000080', '#4169E1', '#6495ED', '#87CEEB', '#B0E0E6', // Blues
    '#006400', '#228B22', '#32CD32', '#90EE90', '#98FB98', // Greens
    '#4B0082', '#8A2BE2', '#9370DB', '#BA55D3', '#DDA0DD', // Purples
    '#FF8C00', '#FFA500', '#FFD700', '#FFFFE0', '#F0E68C'  // Oranges/Yellows
  ];
  return colors[index % colors.length];
}

// Helper function to get book dimensions
export function getBookDimensions(index) {
  const variations = [
    { width: 0.8, height: 1.2, depth: 0.15 },
    { width: 0.7, height: 1.1, depth: 0.12 },
    { width: 0.9, height: 1.3, depth: 0.18 },
    { width: 0.75, height: 1.15, depth: 0.14 },
    { width: 0.85, height: 1.25, depth: 0.16 }
  ];
  return variations[index % variations.length];
}
