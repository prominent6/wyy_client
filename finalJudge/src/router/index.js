import Vue from "vue";
import VueRouter from "vue-router";

const Index = () => import("components/Index.vue");

// 发现音乐页面
const Discover = () => import("views/discover/Discover.vue");
// 发现音乐之个性推荐
const Recommend = () => import("views/discover/discoverChildren/Recommend.vue");
const Ranking = () => import("views/discover/discoverChildren/Ranking.vue");
const Singer = () => import("views/discover/discoverChildren/Singer.vue");
// 发现音乐之歌单
const MusicList = () => import("views/discover/discoverChildren/MusicList.vue");

//歌单
const MusicListIndex = () =>
  import(
    "views/discover/discoverChildren/musicListChildren/MusicListIndex.vue"
  );
const MusicListHighquality = () =>
  import(
    "views/discover/discoverChildren/musicListChildren/MusicListHighquality.vue"
  );

//推荐歌单点进去
const MusicListDetail = () => import("views/recommend/MusicListDetail.vue");

// 视频页面
const Video = () => import("views/video/Video.vue");
// 视频之视频页面
const VideoList = () => import("views/video/videoChildren/VideoList.vue");
// 视频之mv页面
const MvList = () => import("views/video/videoChildren/MvList.vue");
// mv界面的视频详情
const VideoDetail = () => import("views/videoDetail/VideoDetail.vue");

//歌手详情
const SingerDetail = () => import("views/singerDetail/SingerDetail.vue");

// const Album = () => import('views/album/Album.vue')

// 搜索结果
const Search = () => import("views/search/Search.vue");
// 搜索结果之单曲
const SearchSong = () => import("views/search/searchChildren/SearchSong.vue");
// 搜索结果之歌手
const SearchSinger = () =>
  import("views/search/searchChildren/SearchSinger.vue");
// 搜索结果之专辑
const SearchAlbum = () => import("views/search/searchChildren/SearchAlbum.vue");
// 搜索结果之视频
const SearchVideo = () => import("views/search/searchChildren/SearchVideo.vue");
// 搜索结果之歌单
const SearchMusicList = () =>
  import("views/search/searchChildren/SearchMusicList.vue");

//个人页面
const Personal = () => import("views/personal/Personal.vue");

// const Favorites = () => import('views/favorites/favorites.vue')
// const FavoriteAlbum = () => import('views/favorites/favoritesChildren/FavoriteAlbum.vue')
// const FavoriteVideo = () => import('views/favorites/favoritesChildren/FavoriteVideo.vue')
// const FavoriteSinger = () => import('views/favorites/favoritesChildren/FavoriteSinger.vue')
// const RecommendMusic = () => import('views/recommendMusic/RecommendMusic.vue')
// const Follows = () => import('views/personal/personalChildren/Follows.vue')
// const Followeds = () => import('views/personal/personalChildren/Followeds.vue')

Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: "/index" },
  {
    path: "/index",
    component: Index,
    redirect: "/discover",
    children: [
      // 发现音乐
      {
        path: "/discover",
        component: Discover,
        redirect: "/discover/recommend",
        children: [
          { path: "/discover/recommend", component: Recommend },
          {
            path: "/discover/musiclist",
            component: MusicList,
            redirect: "/discover/musiclist/musiclistindex",
            children: [
              {
                path: "/discover/musiclist/musiclistindex",
                component: MusicListIndex,
              },
              {
                path: "/discover/musiclist/musiclisthighquality",
                component: MusicListHighquality,
              },
            ],
          },
          { path: "/discover/ranking", component: Ranking },
          { path: "/discover/singer", component: Singer },
        ],
      },
      // 视频
      {
        path: "/video",
        component: Video,
        redirect: "/video/videolist",
        children: [
          { path: "/video/videolist", component: VideoList },
          { path: "/video/mvlist", component: MvList },
        ],
      },
      //mv页面的视频详情
      {
        path: "/videodetail/:id/:type",
        name: "videoDetail",
        component: VideoDetail,
      },
      //歌单点进去详情
      {
        path: "/musiclistdetail/:id",
        name: "musicListDetail",
        component: MusicListDetail,
      },
      //个人页面
      { path: "/personal/:uid", name: "personal", component: Personal },
      {
        path: "/singerdetail/:id",
        name: "singerDetail",
        component: SingerDetail,
      },
      //             { path: '/album/:id', name: 'album', component: Album },

      {
        path: "/search/:id",
        name: "search",
        component: Search,
        redirect: "/search/searchsong/:id",
        children: [
          {
            path: "/search/searchsong/:id",
            name: "searchSong",
            component: SearchSong,
          },
          {
            path: "/search/searchsinger/:id",
            name: "searchSinger",
            component: SearchSinger,
          },
          {
            path: "/search/searchalbum/:id",
            name: "searchAlbum",
            component: SearchAlbum,
          },
          {
            path: "/search/searchvideo/:id",
            name: "searchVideo",
            component: SearchVideo,
          },
          {
            path: "/search/searchmusiclist/:id",
            name: "searchMusicList",
            component: SearchMusicList,
          },
        ],
      },

      //             {
      //                 path: '/favorites', component: Favorites,
      //                 redirect: '/favorites/favoritealbum',
      //                 children: [
      //                     { path: '/favorites/favoritealbum', component: FavoriteAlbum },
      //                     { path: '/favorites/favoritesinger', component: FavoriteSinger },
      //                     { path: '/favorites/favoritevideo', component: FavoriteVideo },
      //                 ]
      //             },
      //             { path: '/recommendmusic', component: RecommendMusic },

      //             { path: '/personal/follows/:uid', name: 'follows', component: Follows },
      //             { path: '/personal/followeds/:uid', name: 'followeds', component: Followeds },
    ],
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

export default router;
