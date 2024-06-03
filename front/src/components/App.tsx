import { BrowserRouter } from "react-router-dom";
import AppSideMenu from "./AppSideMenu";
import AppRouter from "./AppRouter";
import styles from "../css/App.module.css";
import AppTopMenu from "./AppTopMenu";
import AppPostIconButton from "./AppPostIconButton";
import { AuthProvider } from "../auth/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppTopMenu />
        <div className={styles.CenterContent}>
          <AppSideMenu />
          <div className={styles.Content}>
            <div className={styles.MainContent}>
              <AppRouter />
            </div>
          </div>
        </div>
        <AppPostIconButton />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
