import { useState } from "react";
import "./DraggableObject.css";
import { useDrag } from "@use-gesture/react";

interface DraggableObjectProps {
  x: number;
  y: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onDragEnd: (x: number, y: number) => void;
}

export default function DraggableObject({
  x,
  y,
  children,
  style,
  className,
  onDragEnd,
}: DraggableObjectProps) {
  const [position, setPosition] = useState({ x, y });
  const bind = useDrag(
    ({ movement, last, memo, event }) => {
      event.stopPropagation();
      const initialX = memo ? memo.x : x;
      const initialY = memo ? memo.y : y;
      const newX = initialX + movement[0];
      const newY = initialY + movement[1];
      if (last) {
        onDragEnd(newX, newY);
      } else {
        setPosition({ x: newX, y: newY });
      }
      return memo || { x: initialX, y: initialY };
    },
    {
      pointer: { keys: false },
      filterTaps: true,
      enabled: true,
    },
  );
  const containerStyle = { left: position!.x, top: position!.y, ...style };

  return (
    <div
      style={containerStyle}
      className={`draggable-object-container ${className || ""}`}
      {...bind()}
    >
      {children}
    </div>
  );
}
