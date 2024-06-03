import { Route, Routes } from "react-router-dom";
import AppHome from "./AppHome";
import AppError404 from "./AppError404";
import AppCommunity from "./AppCommunity";
import AppExplorer from "./AppExplorer";
import AppMyCollection from "./AppMyCollection";
import AppMyPage from "./AppMyPage";
import AppExploAlbums from "./AppExploAlbums";
import AppCollectionAlbums from "./AppCollectionAlbums";
import AppCollectionPhotocards from "./AppCollectionPhotocards";
import AppExploArtists from "./AppExploArtists";
import AppRegister from "./AppRegister";
import AppLogin from "./AppLogin";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<AppHome />} />
      <Route path="/register" element={<AppRegister />} />
      <Route path="/login" element={<AppLogin />} />
      <Route path="/community" element={<AppCommunity />} />
      <Route path="/explorer" element={<AppExplorer />} />
      <Route path="/exploArtists" element={<AppExploArtists />} />
      <Route path="/exploAlbums" element={<AppExploAlbums />} />
      <Route path="/myCollection" element={<AppMyCollection />} />
      <Route path="/collectionAlbums" element={<AppCollectionAlbums />} />
      <Route path="/collectionPhotocards" element={<AppCollectionPhotocards />} />
      <Route path="/myPage" element={<AppMyPage />} />
      <Route path="*" element={<AppError404 />} />
    </Routes>
  );
}

export default AppRouter;
