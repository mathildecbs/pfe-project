import { AppBar, Toolbar, Typography, InputBase, alpha, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styles from "../css/AppTopMenu.module.css";
import { Search } from '@mui/icons-material';

export default function AppTopMenu() {
  return (
    <AppBar className={styles.TopMenu}>
      <Toolbar>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          Kollection
        </Typography>
        <div>
          <InputBase
            className={styles.SearchBar}
            placeholder="Rechercher…"
          />
          <IconButton type="submit" aria-label="search">
            <Search/>
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
}
