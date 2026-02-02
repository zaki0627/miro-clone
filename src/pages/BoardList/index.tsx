import { Link, Navigate } from "react-router-dom";
import { RiDashboardLine, RiAddLine, RiDeleteBinLine } from "react-icons/ri";
import CreateBoardModal from "../../components/CreateBoardModal";
import Header from "../../components/Header";
import "./BoardList.css";
import { useCurrentUserStore } from "../../modules/auth/current-user.status";
import { useEffect, useState } from "react";
import { boardRepository } from "../../modules/boards/board.repository";
import type { Board } from "../../modules/boards/board.entity";

export default function BoardList() {
  const { currentUser } = useCurrentUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const createBoard = async (name: string) => {
    const newBoard = await boardRepository.create(name);
    setBoards([...boards, newBoard]);
    console.log(newBoard);
  };
  const deleteBoard = async (e: React.MouseEvent, boardId: string) => {
    e.preventDefault();
    if (!window.confirm("このボードを削除しますか？")) {
      return;
    }
    setIsLoading(true);
    try {
      await boardRepository.delete(boardId);
      setBoards(boards.filter((board) => board.id !== boardId));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchBoards();
  }, []);
  const fetchBoards = async () => {
    setIsLoading(true);
    try {
      const data = await boardRepository.getAll();
      setBoards(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  if (currentUser == null) return <Navigate to="/signin" />;
  if (isLoading) return <p>読み込み中</p>;

  return (
    <div className="board-list-page">
      <Header title="ボード一覧" />

      <main className="board-list-main">
        <div className="action-bar">
          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <RiAddLine className="add-icon" />
            新しいボードを作成
          </button>
        </div>

        {boards.length === 0 ? (
          <div className="empty-state">
            <RiDashboardLine size={48} className="empty-icon" />
            <p className="empty-text">ボードがまだありません。</p>
            <p className="empty-subtext">
              「新しいボードを作成」ボタンから作成してください。
            </p>
          </div>
        ) : (
          <div className="board-grid">
            {boards.map((board) => (
              <Link
                key={board.id}
                className="board-card"
                to={`/boards/${board.id}`}
              >
                <button
                  className="board-delete-button"
                  title="ボードを削除"
                  onClick={(e) => deleteBoard(e, board.id)}
                >
                  <RiDeleteBinLine />
                </button>
                <div className="board-thumbnail">
                  <RiDashboardLine size={48} />
                </div>
                <div className="board-info">
                  <h3 className="board-title">{board.name}</h3>
                  <p className="board-meta">
                    更新:
                    {new Date(board.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <CreateBoardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={createBoard}
      />
    </div>
  );
}
