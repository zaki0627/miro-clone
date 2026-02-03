import type { BoardObject } from "../../modules/board-objects/board-object.entity";
import DraggableObject from "../DraggableObject";
import "./ImageObject.css";

interface ImageObjectProps {
  object: BoardObject;
  onUpdate: (data: Partial<BoardObject>) => void;
  isSelected?: boolean;
  onSelect: () => void;
}

export default function ImageObject({
  object,
  onUpdate,
  isSelected,
  onSelect,
}: ImageObjectProps) {
  const { x, y, width, height, content } = object;

  const style: React.CSSProperties = {
    width: width || "auto",
    height: height || "auto",
  };

  const containerClassName = `image-object-container ${
    isSelected
      ? "image-object-container--selected"
      : "image-object-container--default"
  }`;

  return (
    <DraggableObject
      style={style}
      className={containerClassName}
      x={x}
      y={y}
      onDragEnd={(x, y) => onUpdate({ x, y })}
    >
      <div onClick={onSelect}>
        <img
          src={content}
          alt="Uploaded object"
          draggable={false}
          className="image-object-img"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </DraggableObject>
  );
}
