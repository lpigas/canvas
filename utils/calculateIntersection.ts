import { IIntersections } from "../types/types";
type IProps = {
  p1: IIntersections;
  p2: IIntersections;
  p3: IIntersections;
  p4: IIntersections;
};

export function calculateIntersection({ p1, p2, p3, p4 }: IProps) {
  var c2x = p3.x - p4.x;
  var c3x = p1.x - p2.x;
  var c2y = p3.y - p4.y;
  var c3y = p1.y - p2.y;

  var d = c3x * c2y - c3y * c2x;

  if (d == 0) {
    return;
  }
  var u1 = p1.x * p2.y - p1.y * p2.x;
  var u4 = p3.x * p4.y - p3.y * p4.x;

  var px = (u1 * c2x - c3x * u4) / d;
  var py = (u1 * c2y - c3y * u4) / d;

  var p = { x: px, y: py };

  return p;
}
