import { BrowserRouter } from "react-router-dom";
import AppSideMenu from "./AppSideMenu";
import AppRouter from "./AppRouter";
import styles from "../css/App.module.css";
import AppTopMenu from "./AppTopMenu";
import AppPostIconButton from "./AppPostIconButton";
import { AuthProvider, useAuth } from "../contexts/AuthProvider";
import { PostsProvider } from "../contexts/PostsProvider";

function App() {
  const { user } = useAuth();

  return (
    <AuthProvider>
      <PostsProvider>
        <BrowserRouter>
          <AppTopMenu />
          <div className={styles.CenterContent}>
            {user && <AppSideMenu />}
            <div className={styles.Content}>
              <div className={styles.MainContent}>
                <AppRouter />
              </div>
            </div>
          </div>
          {user && <AppPostIconButton />}
        </BrowserRouter>
      </PostsProvider>
    </AuthProvider>
  );
}

export default App;
