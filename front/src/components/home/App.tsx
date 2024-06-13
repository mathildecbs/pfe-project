import { BrowserRouter } from "react-router-dom";
import AppSideMenu from "../menu/AppSideMenu";
import AppRouter from "../routes/AppRouter";
import styles from "../../css/App.module.css";
import AppTopMenu from "../menu/AppTopMenu";
import AppPostIconButton from "../community/AppPostIconButton";
import { useAuth } from "../../contexts/AuthProvider";
import { PostsProvider } from "../../contexts/PostsProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { user } = useAuth();

  return (
    <PostsProvider>
      <BrowserRouter>
        <AppTopMenu />
        <div className={styles.CenterContent}>
          {user && <AppSideMenu />}
          <div className={styles.Content}>
            <div className={styles.MainContent}>
              <AppRouter />
              <ToastContainer />
            </div>
          </div>
        </div>
        {user && <AppPostIconButton />}
      </BrowserRouter>
    </PostsProvider>
  );
}

export default App;
