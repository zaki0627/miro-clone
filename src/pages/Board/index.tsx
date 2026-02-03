import { RiStickyNoteFill, RiText, RiImageFill } from "react-icons/ri";
import Header from "../../components/Header";
import Canvas from "../../components/Canvas";
import "./Board.css";
import { useCurrentUserStore } from "../../modules/auth/current-user.status";
import { Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { boardRepository } from "../../modules/boards/board.repository";
import { Board as BoardEntity } from "../../modules/boards/board.entity";
import {
  boardObjectRepository,
  type CreateParams,
} from "../../modules/board-objects/board-object.repository";
import type { BoardObject } from "../../modules/board-objects/board-object.entity";

export default function Board() {
  const { currentUser } = useCurrentUserStore();
  const { boardId } = useParams<{ boardId: string }>();
  const [board, setBoard] = useState<BoardEntity | null>(null);
  const [objects, setObjects] = useState<BoardObject[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchBoard();
    fetchObjects();
  }, []);
  const fetchBoard = async () => {
    try {
      const data = await boardRepository.getBoard(boardId!);
      setBoard(data);
    } catch (error) {
      console.log(error);
    }
  };

  const createObject = async (params: Omit<CreateParams, "x" | "y">) => {
    const x = 200 + (Math.random() - 0.5) * 50;
    const y = 200 + (Math.random() - 0.5) * 50;

    try {
      const newObject = await boardObjectRepository.create(boardId!, {
        x,
        y,
        ...params,
      });
      setObjects([...objects, newObject]);
      console.log(newObject);
    } catch (error) {
      console.log(error);
    }
  };

  const createSticky = async () => {
    await createObject({
      type: "sticky",
      content: "New Sticky Note",
      color: "#FEF3C7",
    });
  };
  const createText = async () => {
    await createObject({
      type: "text",
      content: "Double click to edit",
    });
  };

  const updateObject = async (id: string, data: Partial<BoardObject>) => {
    try {
      const updatedObject = await boardObjectRepository.update(id, data);
      setObjects(objects.map((obj) => (id === obj.id ? updatedObject : obj)));
    } catch (error) {
      console.log(error);
    }
  };
  const fetchObjects = async () => {
    try {
      const data = await boardObjectRepository.getAll(boardId!);
      setObjects(data);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteObjects = async (id: string) => {
    try {
      await boardObjectRepository.delete(id);
      setObjects(objects.filter((object) => object.id !== id));
      setSelectedId(null);
    } catch (error) {
      console.log(error);
    }
  };
  if (currentUser == null) return <Navigate to="/" />;
  if (!board) return <p>読み込み中</p>;

  return (
    <div className="board-page">
      <Header title={board?.name ?? ""} />

      <div className="board-page__content">
        <aside className="toolbar">
          <div className="toolbar__group">
            <button
              className="toolbar__button"
              title="Sticky Note"
              onClick={createSticky}
            >
              <RiStickyNoteFill className="toolbar__icon" />
            </button>
            <button
              className="toolbar__button"
              title="Text"
              onClick={createText}
            >
              <RiText className="toolbar__icon" />
            </button>
            <button className="toolbar__button" title="Image">
              <RiImageFill className="toolbar__icon" />
            </button>
            <input type="file" style={{ display: "none" }} accept="image/*" />
          </div>
        </aside>

        <main className="board-page__canvas-area">
          <Canvas
            objects={objects}
            onObjectUpdate={updateObject}
            selectedId={selectedId}
            onObjectSelect={setSelectedId}
            onBackGroundClick={() => setSelectedId(null)}
            onObjectDelete={(id: string) => deleteObjects(id)}
          />
        </main>
      </div>
    </div>
  );
}
