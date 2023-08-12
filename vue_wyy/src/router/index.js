import Vue from "vue";
import VueRouter from "vue-router";
const Index = () => import("components/Index.vue");

const Search = () => import("views/search/Search.vue");
const SearchSong = () => import("views/search/searchChildren/SearchSong.vue");
const SearchSinger = () =>
  import("views/search/searchChildren/SearchSinger.vue");
  const SearchAlbum = () => import("views/search/searchChildren/SearchAlbum.vue");
  const SearchVideo = () => import("views/search/searchChildren/SearchVideo.vue");
  const SearchMusicList = () =>
  import("views/search/searchChildren/SearchMusicList.vue");
const Discover = () => import("views/discover/Discover.vue");
const Recommend = () => import("views/discover/discoverChildren/Recommend.vue");
const Ranking = () => import("views/discover/discoverChildren/Ranking.vue");
const Singer = () => import("views/discover/discoverChildren/Singer.vue");
const MusicList = () => import("views/discover/discoverChildren/MusicList.vue");
const Special = () => import("views/discover/discoverChildren/Special.vue");
const Newest = () => import("views/discover/discoverChildren/Newest.vue");

const Personal = () => import("views/personal/Personal.vue");
// const PersonalChild=()=>import("views/personal/personalChildren/personalChild.vue");
// const CreateA=()=>import("views/personal/personalChildren/personalCC/CreateA.vue");
// const CreateS=()=>import("views/personal/personalChildren/personalCC/CreateS.vue");
// const CollectS=()=>import("views/personal/personalChildren/personalCC/CollectS.vue");
const PersonalEdit = () => import("views/personalEdit/PersonalEdit.vue");


const MusicListDetail = () => import("views/detail/MusicListDetail.vue");



const Video = () => import("views/video/Video.vue");
const VideoList = () => import("views/video/videoChildren/VideoList.vue");
const MvList = () => import("views/video/videoChildren/MvList.vue");
const VideoDetail = () => import('views/videoDetail/VideoDetail.vue')


Vue.use(VueRouter);
const routes = [
  { path: "/", redirect: "/index" },
  {
    path: "/index",
    component: Index,
    redirect:"/discover",
    children:[
      {
        path: "/discover",
        component: Discover,
        redirect: "/discover/recommend",
        children: [
          { path: "/discover/recommend", component: Recommend },
          {path: "/discover/musiclist",component: MusicList},
          { path: "/discover/ranking", component: Ranking },
          { path: "/discover/singer", component: Singer },
          { path: "/discover/special", component: Special },
          { path: "/discover/newest", component: Newest },

        ]
      },
      // { path: "/personal/:uid",
      //  name: "personal", 
      //  component: Personal,
      //  redirect:"/personal/personalChild",
      //  children:[
      //   { path: "/personal/personalChild", component: PersonalChild,
      //     redirect:"/personal/personalChild/createS",
      //     children:[
      //       { path: "/personal/personalChild/createS", component: CreateS },
      //       { path: "/personal/personalChild/createA", component: CreateA },
      //       { path: "/personal/personalChild/CollectS", component: CollectS },
      //      ]
      //   }
      //  ]
      // },
      { path: '/personal/:uid', name: 'personal', component: Personal },
      { path: '/personaledit/:uid', name: 'personaledit', component: PersonalEdit },
      {
        path: "/musiclistdetail/:id",
        name: "musicListDetail",
        component: MusicListDetail,
      },
      {
        path: "/video",
        component: Video,
        redirect: "/video/videolist",
        children: [
          { path: "/video/videolist", component: VideoList },
          { path: "/video/mvlist", component: MvList },
        ],
      },
      { path: '/videodetail/:id/:type', name: 'videoDetail', component: VideoDetail },
      {
        path:"/search/:id",
        name:"search",
        component:Search,
        redirect:"/search/searchsong/:id",
        children:[
          {
            path:"/search/searchsong/:id",
            name:"searchSong",
            component:SearchSong,
          },{
            path: "/search/searchsinger/:id",
            name: "searchSinger",
            component: SearchSinger,
          },{
            path: "/search/searchalbum/:id",
            name: "searchAlbum",
            component: SearchAlbum,
          },{
            path: "/search/searchvideo/:id",
            name: "searchVideo",
            component: SearchVideo,
          },{
            path: "/search/searchmusiclist/:id",
            name: "searchMusicList",
            component: SearchMusicList,
          },
        ]
      }
    ]
  }
]
const router=new VueRouter({
  routes,
  mode:"history"
})
export default router