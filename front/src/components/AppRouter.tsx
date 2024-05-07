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

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<AppHome />} />
      <Route path="/community" element={<AppCommunity />} />
      <Route path="/explorer" element={<AppExplorer />} />
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
