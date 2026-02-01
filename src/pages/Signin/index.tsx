import { Link, Navigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import "./Signin.css";
import { useState } from "react";
import { authRepository } from "../../modules/auth/auth.repository";
import { useCurrentUserStore } from "../../modules/auth/current-user.status";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, setCurrentUser } = useCurrentUserStore();

  const signin = async () => {
    setIsLoading(true);

    try {
      const { user, token } = await authRepository.signin(email, password);
      localStorage.setItem("token", token);
      setCurrentUser(user);
      console.log(user, token);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  if (currentUser != null) return <Navigate to="/" />;
  return (
    <div className="signin-page">
      <Card className="signin-card">
        <h1 className="signin-title">Miro Clone</h1>

        <div className="signin-form">
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
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="button"
            className="signin-submit-button"
            onClick={signin}
            disabled={!email || !password}
            isLoading={isLoading}
          >
            ログイン
          </Button>
        </div>

        <div className="signin-footer">
          アカウントをお持ちでない方は
          <Link to="/signup" className="signin-link">
            新規登録
          </Link>
        </div>
      </Card>
    </div>
  );
}
