import { Link, Navigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import "./Signup.css";
import { useState } from "react";
import { authRepository } from "../../modules/auth/auth.repository";
import { useCurrentUserStore } from "../../modules/auth/current-user.status";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, setCurrentUser } = useCurrentUserStore();

  const signup = async () => {
    setIsLoading(true);
    try {
      const { user, token } = await authRepository.signup(
        name,
        email,
        password,
      );
      localStorage.setItem("token", token);
      setCurrentUser(user);
      console.log(user, token);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  if (currentUser != null) return <Navigate to="/signin" />;

  return (
    <div className="signup-page">
      <Card className="signup-card">
        <h1 className="signup-title">Miro Clone</h1>

        <div className="signup-form">
          <Input
            id="username"
            type="text"
            label="ユーザー名"
            placeholder="山田太郎"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            id="email"
            type="email"
            label="メールアドレス"
            placeholder="example@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            id="password"
            type="password"
            label="パスワード"
            placeholder="8文字以上"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="button"
            className="signup-submit-button"
            onClick={signup}
            disabled={!name || !email || !password}
            isLoading={isLoading}
          >
            アカウント作成
          </Button>
        </div>

        <div className="signup-footer">
          既にアカウントをお持ちの方は
          <Link to="/signin" className="signup-link">
            ログイン
          </Link>
        </div>
      </Card>
    </div>
  );
}
