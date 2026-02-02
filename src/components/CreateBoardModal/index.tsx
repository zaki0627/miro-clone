import { useEffect, useState } from "react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import "./CreateBoardModal.css";

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
}

export default function CreateBoardModal(props: CreateBoardModalProps) {
  const { isOpen, onClose, onSubmit } = props;
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(name);
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };
  useEffect(() => {
    setName("");
  }, [isOpen]);

  const footer = (
    <>
      <button
        className="btn btn-secondary"
        disabled={submitting}
        onClick={onClose}
      >
        キャンセル
      </button>
      <Button
        className="btn btn-primary"
        disabled={submitting || !name.trim()}
        onClick={handleSubmit}
        isLoading={submitting}
      >
        作成
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="新しいボードを作成"
      footer={footer}
    >
      <div className="create-board-field">
        <label className="create-board-label">ボード名</label>
        <input
          type="text"
          className="input-field"
          placeholder="ボード名を入力"
          defaultValue={name}
          autoFocus
          disabled={submitting}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
    </Modal>
  );
}
