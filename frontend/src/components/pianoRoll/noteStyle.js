// 核心计算逻辑解耦
export const useNoteStyle = (gridSize = { cellWidth: 25, cellHeight: 20 }) => {
  // 基础尺寸计算
  const calcPosition = (row, col) => ({
    left: col * gridSize.cellWidth,
    top: row * gridSize.cellHeight + 1,
  });

  const calcDimensions = (duration) => ({
    width: duration * gridSize.cellWidth - 1,
    height: gridSize.cellHeight - 2,
  });

  // 主计算函数
  const noteStyle = (row, col, duration) => ({
    ...calcPosition(row, col),
    ...calcDimensions(duration),
  });

  return { noteStyle };
};
