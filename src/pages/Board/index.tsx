import { RiStickyNoteFill, RiText, RiImageFill } from "react-icons/ri";
import Header from "../../components/Header";
import Canvas from "../../components/Canvas";
import "./Board.css";
import { useCurrentUserStore } from "../../modules/auth/current-user.status";
import { Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { boardRepository } from "../../modules/boards/board.repository";
import { Board as BoardEntity } from "../../modules/boards/board.entity";

export default function Board() {
  const { currentUser } = useCurrentUserStore();
  const { boardId } = useParams<{ boardId: string }>();
  const [board, setBoard] = useState<BoardEntity | null>(null);
  // const [isLoaidng, setIsLoading] = useState(false);

  useEffect(() => {
    fetchBoard();
  }, [boardId]);
  const fetchBoard = async () => {
    // setIsLoading(true);
    try {
      const data = await boardRepository.getBoard(boardId!);
      setBoard(data);
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
            <button className="toolbar__button" title="Sticky Note">
              <RiStickyNoteFill className="toolbar__icon" />
            </button>
            <button className="toolbar__button" title="Text">
              <RiText className="toolbar__icon" />
            </button>
            <button className="toolbar__button" title="Image">
              <RiImageFill className="toolbar__icon" />
            </button>
            <input type="file" style={{ display: "none" }} accept="image/*" />
          </div>
        </aside>

        <main className="board-page__canvas-area">
          <Canvas />
        </main>
      </div>
    </div>
  );
}
