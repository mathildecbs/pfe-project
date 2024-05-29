import { BrowserRouter } from "react-router-dom";
import AppSideMenu from "./AppSideMenu";
import AppRouter from "./AppRouter";
import styles from "../css/App.module.css";
import AppTopMenu from "./AppTopMenu";
import AppPostIconButton from "./AppPostIconButton";

function App() {
  return (
    <BrowserRouter>
      <AppTopMenu />
      <div className={styles.CenterContent}>
        <AppSideMenu />
        <div className={styles.MainContent}>
          <AppRouter />
        </div>
      </div>
    <AppPostIconButton />
    </BrowserRouter>
  );
}

export default App;
