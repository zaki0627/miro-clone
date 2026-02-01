import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import BoardList from "./pages/BoardList";
import Board from "./pages/Board";
import { useEffect, useState } from "react";
import { useCurrentUserStore } from "./modules/auth/current-user.status";
import { authRepository } from "./modules/auth/auth.repository";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { setCurrentUser } = useCurrentUserStore();
  useEffect(() => {
    featchCurrentUser();
  }, []);
  const featchCurrentUser = async () => {
    try {
      const user = await authRepository.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.log("error");
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) return <div />;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="signin" element={<Signin />} />
        <Route path="signup" element={<Signup />} />
        <Route path="/" element={<BoardList />} />
        <Route path="/boards/:boardId" element={<Board />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
