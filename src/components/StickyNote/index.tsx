import { useEffect, useRef, useState } from "react";
import type { BoardObject } from "../../modules/board-objects/board-object.entity";
import DraggableObject from "../DraggableObject";
import "./StickyNote.css";

interface StichyNoteProps {
  object: BoardObject;
  onUpdate: (data: Partial<BoardObject>) => void;
  onSelect: () => void;
  isSelected: boolean;
}
export default function StickyNote(props: StichyNoteProps) {
  const { object, onUpdate, onSelect, isSelected } = props;
  const { x, y, width, height, content, color } = object;
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const style: React.CSSProperties = {
    width: width || 200,
    height: height || 200,
    backgroundColor: color || "var(--sticky-yellow)",
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    onSelect();
  };

  const getContainerClassName = () => {
    let classes = "sticky-note sticky-note--draggable";
    if (isSelected) {
      classes += " sticky-note--selected";
    } else {
      classes += " sticky-note--default";
    }
    return classes;
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);
  const handleBlur = () => {
    setIsEditing(false);
    if (editText !== content) {
      onUpdate({ content: editText });
    }
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
        onBlur={handleBlur}
      >
        {isEditing ? (
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="sticky-note__textarea"
            ref={textareaRef}
          />
        ) : (
          <div style={{ pointerEvents: "none" }}>{content}</div>
        )}
      </div>
    </DraggableObject>
  );
}
