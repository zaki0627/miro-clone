import { useEffect, useRef, useState } from "react";
import { BoardObject } from "../../modules/board-objects/board-object.entity";
import DraggableObject from "../DraggableObject";
import "./TextObject.css";
interface TextObjectProps {
  object: BoardObject;
  onUpdate: (data: Partial<BoardObject>) => void;
  isSelected?: boolean;
  onSelect: () => void;
}

export default function TextObject({
  object,
  onUpdate,
  isSelected,
  onSelect,
}: TextObjectProps) {
  const { x, y, width, content } = object;
  const style: React.CSSProperties = {
    width: width || 200,
  };
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getContainerClassName = () => {
    let classes = "text-object";
    if (isSelected) {
      classes += " text-object--selected";
    } else if (isEditing) {
      classes += " text-object__edit-container";
    } else {
      classes += " text-object--default";
    }
    return classes;
  };
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    onSelect();
  };
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);
  const handleBlur = () => {
    if (editText !== content) {
      onUpdate({ content: editText });
    }
    setIsEditing(false);
  };
  return (
    <DraggableObject
      x={x}
      y={y}
      className="board-object"
      onDragEnd={(x, y) => onUpdate({ x, y })}
    >
      <div
        style={style}
        className={getContainerClassName()}
        onClick={onSelect}
        onDoubleClick={handleDoubleClick}
      >
        {isEditing ? (
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="text-object__textarea"
            ref={textareaRef}
            onBlur={handleBlur}
          />
        ) : (
          <div className="text-object__content-text">{content}</div>
        )}
      </div>
    </DraggableObject>
  );
}
