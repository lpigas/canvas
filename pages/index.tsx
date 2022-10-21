import React, { useState, useRef, useEffect } from "react";
import { checkIsValid } from "../utils/checkIsValid";
import { calculateIntersection } from "../utils/calculateIntersection";
import styles from "../styles/home.module.css";
import { ICordinates, IIntersections } from "../types/types";

export default function Home() {
  const [fromX, setFromX] = useState<number>();
  const [fromY, setFromY] = useState<number>();
  const [cordinates, setCordinates] = useState<ICordinates[]>([]);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [intersections, setIntersections] = useState<IIntersections[]>([]);
  const [tempIntersections, setTempIntersections] = useState<IIntersections[]>(
    []
  );
  const ref = useRef<HTMLCanvasElement>(null);
  const reft = useRef<HTMLCanvasElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isClicked) {
      setIsClicked(false);
      setIntersections([...intersections, ...tempIntersections]);
      setTempIntersections([]);
      return;
    }
    var rect = e.currentTarget.getBoundingClientRect();
    const xEl = e.clientX - rect.left;
    const yEl = e.clientY - rect.top;
    setFromX(xEl);
    setFromY(yEl);
    setIsClicked(true);
    setCordinates([
      ...cordinates,
      { xStart: xEl, xEnd: xEl, yStart: yEl, yEnd: yEl },
    ]);
  };

  const onMove = (e: React.MouseEvent) => {
    if (!isClicked) return;
    var rect = e.currentTarget.getBoundingClientRect();
    const xEl = e.clientX - rect.left;
    const yEl = e.clientY - rect.top;
    const coordinatesPopped = [...cordinates];
    coordinatesPopped.pop();
    const cordinatesNew = [
      ...coordinatesPopped,
      { xStart: fromX, yStart: fromY, xEnd: xEl, yEnd: yEl },
    ];
    setCordinates(cordinatesNew);
    const points = [];
    const myLine = { xStart: fromX, yStart: fromY, xEnd: xEl, yEnd: yEl };
    coordinatesPopped.forEach((line) => {
      var p1 = { x: fromX, y: fromY };
      var p2 = { x: xEl, y: yEl };
      var p3 = { x: line.xStart, y: line.yStart };
      var p4 = { x: line.xEnd, y: line.yEnd };

      var p = calculateIntersection({ p1, p2, p3, p4 });

      if (checkIsValid({ myLine, line, p })) {
        points.push(p);
      }
    });
    setTempIntersections(points);
  };

  useEffect(() => {
    if (!ref || !ref.current) return;

    const ctx = ref.current.getContext("2d");
    ctx.clearRect(0, 0, 300, 300);
    cordinates.forEach((line) => {
      ctx.beginPath();
      ctx.moveTo(line.xStart, line.yStart);
      ctx.lineTo(line.xEnd, line.yEnd);
      ctx.stroke();
    });
    tempIntersections.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
      ctx.stroke();
    });
    intersections.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.stroke();
    });
  }, [cordinates, tempIntersections, intersections]);

  const testDelete = async () => {
    let steps = 0;
    const getcordinates = ({ lines }) => {
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
    let initCordinates = [...cordinates];
    const ctx = ref.current.getContext("2d");
    function timeout(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    while (steps < 150) {
      await timeout(20);
      const cordinatestoDraw = initCordinates.map((lines) =>
        getcordinates({ lines })
      );

      const intersectionsToDraw = [];

      const checkIsUnique = (point: any) => {
        const index = intersectionsToDraw.findIndex(
          (item) => item.x === point.x && item.y === point.y
        );
        return index === -1;
      };

      cordinatestoDraw.forEach((lines, index) => {
        const { xStart, yStart, xEnd, yEnd } = lines;
        const filteredCoordinates = cordinatestoDraw.filter(
          (item, i) => index !== i
        );
        const myLine = {
          xStart: xStart,
          yStart: yStart,
          xEnd: xEnd,
          yEnd: yEnd,
        };
        filteredCoordinates.forEach((line) => {
          var p1 = { x: xStart, y: yStart };
          var p2 = { x: xEnd, y: yEnd };
          var p3 = { x: line.xStart, y: line.yStart };
          var p4 = { x: line.xEnd, y: line.yEnd };

          var p = calculateIntersection({ p1, p2, p3, p4 });

          if (checkIsValid({ myLine, line, p }) && checkIsUnique(p)) {
            intersectionsToDraw.push(p);
          }
        });
      });
      console.log(intersectionsToDraw);
      ctx.clearRect(0, 0, 300, 300);
      cordinatestoDraw.forEach((line) => {
        ctx.beginPath();
        ctx.moveTo(line.xStart, line.yStart);
        ctx.lineTo(line.xEnd, line.yEnd);
        ctx.stroke();
      });
      intersectionsToDraw.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.stroke();
      });
      initCordinates = [...cordinatestoDraw];
      steps++;
    }
  };
  const handleCollapse = async () => {
    await testDelete();
    setCordinates([]);
    setIntersections([]);
    setTempIntersections([]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.canvas} onClick={handleClick} onMouseMove={onMove}>
        <canvas ref={ref} width={300} height={300} className={styles.lines} />
      </div>
      <button onClick={handleCollapse}>Collapse lines</button>
    </div>
  );
}
