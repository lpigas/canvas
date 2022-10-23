export const getcordinates = ({ lines, steps  }) => {
    const xmin = lines.xStart > lines.xEnd ? lines.xEnd : lines.xStart;
    const ymin = lines.yStart > lines.yEnd ? lines.yEnd : lines.yStart;
    const xmax = lines.xStart < lines.xEnd ? lines.xEnd : lines.xStart;
    const ymax = lines.yStart < lines.yEnd ? lines.yEnd : lines.yStart;
    let x = lines.xStart;
    let y = lines.yStart;
    let x1 = lines.xEnd;
    let y1 = lines.yEnd;
    const xStep = (xmax - xmin) / (300 - 2 * steps);
    const yStep = (ymax - ymin) / (300 - 2 * steps);
    x = lines.xStart < lines.xEnd ? x + xStep : x - xStep;
    y = lines.yStart < lines.yEnd ? y + yStep : y - yStep;
    x1 = lines.xStart > lines.xEnd ? x1 + xStep : x1 - xStep;
    y1 = lines.yStart > lines.yEnd ? y1 + yStep : y1 - yStep;
    return { xStart: x, yStart: y, xEnd: x1, yEnd: y1 };
  }; 