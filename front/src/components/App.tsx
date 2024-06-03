import { BrowserRouter } from "react-router-dom";
import AppSideMenu from "./AppSideMenu";
import AppRouter from "./AppRouter";
import styles from "../css/App.module.css";
import AppTopMenu from "./AppTopMenu";
import AppPostIconButton from "./AppPostIconButton";
import { AuthProvider, useAuth } from "../auth/AuthProvider";

function App() {
  const { user } = useAuth();

  return (
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
  );
}

export default App;
