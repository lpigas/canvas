import { ICordinates, IIntersections } from "../types/types";
type IProps = {
  myLine: ICordinates;
  line: ICordinates;
  p: IIntersections;
};

export const checkIsValid = ({ myLine, line, p }: IProps) => {
  const maxX = myLine.xStart > myLine.xEnd ? myLine.xStart : myLine.xEnd;
  const minX = myLine.xStart < myLine.xEnd ? myLine.xStart : myLine.xEnd;
  const maxY = myLine.yStart > myLine.yEnd ? myLine.yStart : myLine.yEnd;
  const minY = myLine.yStart < myLine.yEnd ? myLine.yStart : myLine.yEnd;

  const linemaxX = line.xStart > line.xEnd ? line.xStart : line.xEnd;
  const lineminX = line.xStart < line.xEnd ? line.xStart : line.xEnd;
  const linemaxY = line.yStart > line.yEnd ? line.yStart : line.yEnd;
  const lineminY = line.yStart < line.yEnd ? line.yStart : line.yEnd;

  const isValid =
    p &&
    p.x < maxX &&
    p.x > minX &&
    p.y < maxY &&
    p.y > minY &&
    p.x < linemaxX &&
    p.x > lineminX &&
    p.y < linemaxY &&
    p.y > lineminY;
  return isValid;
};
