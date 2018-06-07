function createSectionColors(sectionCount) {
  colors = [];
  for (var section = 0; section < sectionCount; section++) {
    colors.push(BUS_COLORS[section % BUS_COLORS.length]['section'])
  }
  return colors;
}

function createDirectionColors(sectionCount, directionCounts) {
  colors = [];
  for (var section = 0; section < sectionCount; section++) {
    colors.push([]);
    for (var direction = 0; direction < directionCounts[section]; direction++) {
      colors[section].push(
        BUS_COLORS[section % BUS_COLORS.length]['direction'][direction % BUS_COLORS[section]['direction'].length]
      );
    }
  }
  return colors;
}