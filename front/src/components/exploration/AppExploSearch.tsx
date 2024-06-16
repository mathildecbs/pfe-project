import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Paper, Tabs, Tab, Typography } from "@mui/material";
import styles from "../../css/AppExploSearch.module.css";
import AppPost from "../community/AppPost";
import postService from "../../services/PostService";
import ToastUtils from "../../utils/ToastUtils";
import { User } from "../../types/UserType";
import { Post } from "../../types/PostType";
import { Tag } from "../../types/TagType";
import { Inclusion } from "../../types/InclusionType";
import { Album } from "../../types/AlbumType";
import { Artist } from "../../types/ArtistType";
import { Group } from "../../types/GroupType";
import { useAuth } from "../../contexts/AuthProvider";
import userService from "../../services/UserService";
import tagService from "../../services/TagService";
import groupService from "../../services/GroupService";
import artistService from "../../services/ArtistService";
import albumService from "../../services/AlbumService";
import inclusionService from "../../services/InclusionService";
import AppShortProfile from "../user/AppShortProfile";
import AppCollectionAlbumDisplay from "../collection/AppCollectionAlbumDisplay";
import AppCollectionInclusionDisplay from "../collection/AppCollectionInclusionDisplay";

export default function AppExploSearch() {
  const { searchQuery } = useParams<{ searchQuery: string }>();
  const [selectedTab, setSelectedTab] = useState(0);
  const [resUsers, setResUsers] = useState<User[]>([]);
  const [resPosts, setResPosts] = useState<Post[]>([]);
  const [resTags, setResTags] = useState<Tag[]>([]);
  const [resGroups, setResGroups] = useState<Group[]>([]);
  const [resArtists, setResArtists] = useState<Artist[]>([]);
  const [resAlbums, setResAlbums] = useState<Album[]>([]);
  const [resInclusions, setResInclusions] = useState<Inclusion[]>([]);
  const { authToken, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSearchResults();
  }, [searchQuery, selectedTab]);

  async function fetchSearchResults() {
    try {
      if (authToken && searchQuery) {
        switch (selectedTab) {
          case 0:
            const users = await userService.getSearchUsers(
              searchQuery,
              authToken
            );
            setResUsers(users);
            break;
          case 1:
            const posts = await postService.getSearchPosts(
              searchQuery,
              authToken
            );
            setResPosts(posts);
            break;
          case 2:
            const tags = await tagService.getSearchTags(searchQuery, authToken);
            setResTags(tags);
            break;
          case 3:
            const groups = await groupService.getSearchGroups(
              searchQuery,
              authToken
            );
            setResGroups(groups);
            break;
          case 4:
            const artists = await artistService.getSearchArtists(
              searchQuery,
              authToken
            );
            setResArtists(artists);
            break;
          case 5:
            const albums = await albumService.getSearchAlbums(
              searchQuery,
              authToken
            );
            setResAlbums(albums);
            break;
          case 6:
            const inclusions = await inclusionService.getSearchInclusions(
              searchQuery,
              authToken
            );
            setResInclusions(inclusions);
            break;
          default:
            break;
        }
      }
    } catch (error) {
      ToastUtils.error(
        error,
        "Erreur lors de la récupération des résultats de recherche"
      );
    }
  }

  function handleTabChange(event: React.ChangeEvent<{}>, newValue: number) {
    setSelectedTab(newValue);
  }

  function navigateTo(root: string, specification?: string) {
    if (specification) {
      navigate(`/${root}/${specification}`);
      return;
    }
    navigate(`/${root}`);
  }

  return (
    <div className={styles.Container}>
      <Paper className={styles.Tabs}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Personnes" className={styles.Tab} />
          <Tab label="Posts" className={styles.Tab} />
          <Tab label="Tags" className={styles.Tab} />
          <Tab label="Groupes" className={styles.Tab} />
          <Tab label="Artistes" className={styles.Tab} />
          <Tab label="Albums" className={styles.Tab} />
          <Tab label="Inclusions" className={styles.Tab} />
        </Tabs>
      </Paper>
      <div className={styles.ResultsContainer}>
        <Typography variant="h6" className={styles.Result}>
          Résultats pour la recherche "{searchQuery}"
        </Typography>
        {selectedTab === 0 &&
          resUsers.length > 0 &&
          user &&
          resUsers.map((resUser) => (
            <AppShortProfile userProfile={resUser} currentUser={user} />
          ))}
        {selectedTab === 1 &&
          resPosts.length > 0 &&
          resPosts.map((post) => (
            <AppPost key={post.id} post={post} repost={false} />
          ))}
        {selectedTab === 2 &&
          resTags.length > 0 &&
          resTags.map((tag) => (
            <Typography
              key={tag.id}
              className={styles.ResultItem}
              onClick={() => navigateTo("tagPage", tag.name)}
            >
              #{tag.name}
            </Typography>
          ))}
        {selectedTab === 3 &&
          resGroups.length > 0 &&
          resGroups.map((group) => (
            <Typography
              key={group.id}
              className={styles.ResultItem}
              onClick={() => navigateTo("exploOneGroup", group.id)}
            >
              {group.name}
            </Typography>
          ))}
        {selectedTab === 4 &&
          resArtists.length > 0 &&
          resArtists.map((artist) => (
            <Typography
              key={artist.id}
              className={styles.ResultItem}
              onClick={() => navigateTo("exploOneArtist", artist.id)}
            >
              {artist.name}
            </Typography>
          ))}
        {selectedTab === 5 && resAlbums.length > 0 && (
          <AppCollectionAlbumDisplay albumsToDisplay={resAlbums} />
        )}
        {selectedTab === 6 && resInclusions.length > 0 && (
          <AppCollectionInclusionDisplay inclusionsToDisplay={resInclusions} />
        )}
        {((selectedTab === 0 && resUsers.length === 0) ||
          (selectedTab === 1 && resPosts.length === 0) ||
          (selectedTab === 2 && resTags.length === 0) ||
          (selectedTab === 3 && resGroups.length === 0) ||
          (selectedTab === 4 && resArtists.length === 0) ||
          (selectedTab === 5 && resAlbums.length === 0) ||
          (selectedTab === 6 && resInclusions.length === 0)) && (
          <Typography variant="h6" className={styles.Unavailable}>
            Aucun résultat trouvé.
          </Typography>
        )}
      </div>
    </div>
  );
}
