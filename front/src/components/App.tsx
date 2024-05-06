import { BrowserRouter } from "react-router-dom";
import AppSideMenu from "./AppSideMenu";
import AppRouter from "./AppRouter";
import styles from "../css/App.module.css"

function App() {
  return (
      <BrowserRouter>
        <AppSideMenu/>
        <div className={styles.MainContent}>
          <AppRouter />
        </div>
      </BrowserRouter>
  );
}

export default App;
