import { Route, Routes } from "react-router-dom";
import AppHome from "../home/AppHome";
import AppError404 from "../home/AppError404";
import AppCommunity from "../community/AppCommunity";
import AppExplorer from "../exploration/AppExplorer";
import AppMyCollection from "../collection/AppMyCollection";
import AppMyPage from "../community/AppMyPage";
import AppExploAlbums from "../exploration/AppExploAlbums";
import AppCollectionAlbums from "../collection/AppCollectionAlbums";
import AppCollectionInclusions from "../collection/AppCollectionInclusions";
import AppExploArtists from "../exploration/AppExploArtists";
import AppRegister from "../home/AppRegister";
import AppLogin from "../home/AppLogin";
import AppRoutesPrivate from "./AppRoutesPrivate";
import AppRoutesNotConnected from "./AppRoutesNotConnected";
import AppPostPage from "../community/AppPostPage";
import AppExploOneArtist from "../exploration/AppExploOneArtist";
import AppExploOneAlbum from "../exploration/AppExploOneAlbum";
import AppExploGroups from "../exploration/AppExploGroups";
import AppExploOneGroup from "../exploration/AppExploOneGroup";
import AppUserPage from "../community/AppUserPage";
import AppCreateNew from "../create/AppCreateNew";
import AppTagPage from "../community/AppTagPage";
import AppExploOneInclusion from "../exploration/AppExploOneInclusion";
import AppRoutesAdmin from "./AppRoutesAdmin";

function AppRouter() {
  return (
    <Routes>
      <Route element={<AppRoutesNotConnected />}>
        <Route path="/register" element={<AppRegister />} />
        <Route path="/login" element={<AppLogin />} />
      </Route>
      <Route element={<AppRoutesPrivate />}>
        <Route path="/" element={<AppHome />} />
        <Route path="/community" element={<AppCommunity />} />
        <Route path="/post/:idPost" element={<AppPostPage />} />
        <Route path="/explorer" element={<AppExplorer />} />
        <Route path="/exploArtists" element={<AppExploArtists />} />
        <Route
          path="/exploOneArtist/:idArtist"
          element={<AppExploOneArtist />}
        />
        <Route path="/exploGroups" element={<AppExploGroups />} />
        <Route path="/exploOneGroup/:idGroup" element={<AppExploOneGroup />} />
        <Route path="/exploAlbums" element={<AppExploAlbums />} />
        <Route path="/exploOneAlbum/:idAlbum" element={<AppExploOneAlbum />} />
        <Route
          path="/exploOneInclusion/:idInclusion"
          element={<AppExploOneInclusion />}
        />
        <Route path="/myCollection" element={<AppMyCollection />} />
        <Route path="/tagPage/:tagName" element={<AppTagPage />} />
        <Route path="/collectionAlbums" element={<AppCollectionAlbums />} />
        <Route
          path="/collectionInclusions"
          element={<AppCollectionInclusions />}
        />
        <Route path="/myPage" element={<AppMyPage />} />
        <Route path="/user/:username" element={<AppUserPage />} />
        <Route element={<AppRoutesAdmin/>}>
          <Route path="/createNew" element={<AppCreateNew />} />
        </Route>
      </Route>
      <Route path="*" element={<AppError404 />} />
    </Routes>
  );
}

export default AppRouter;
