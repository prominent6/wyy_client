import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const state={
    isLogin: false, // 是否登录
    isMusicLoad: false,  // 音乐是否在加载中
    musicId: "",
    musicList: [
      //设置默认值
    //  { al: {
    //     id: 146203803,
    //     name: "可",
    //     pic: 109951167527804380,
    //     picUrl:
    //       "https://p1.music.126.net/71lWKKX2Lv2PTFJpy2mVUg==/109951167527804392.jpg",
    //     pic_str: "109951167527804392",
    //   },
    //   id: 1954420092,
    //   name: "可",
    //   ar: [
    //     {
    //       name: "薛之谦 张靓颖",
    //     },
    //   ],
    // }
    ], // 当前播放的歌单
    musicListId: "",
    isMusicDetailCardShow: false, // 音乐详情卡片的显隐
    currentIndex: -1,// 当前播放音乐的索引
    isPlay: false, // 音乐的播放状态
    currentTime: 0,
    isDrawerShow:false, //用户退出的地方

}
const store=new Vuex.Store({
    state,
    mutations:{
      updateDrawerState() {
        state.isDrawerShow = !state.isDrawerShow;
      },
      //更新登录状态
      updateLoginState(state, flag = false) {
        state.isLogin = flag;
      },
      // 更新音乐的加载状态
      updateMusicLoadState(state, isLoad) {
          state.isMusicLoad = isLoad;
      },
      updateMusicId(state, musicId) {
          state.musicId = musicId;
          // console.log('updateMusicId');
        },
        // 切换音乐详情卡片的显隐
      changeMusicDetailCardState(state) {
          state.isMusicDetailCardShow = !state.isMusicDetailCardShow;
        },
      updateCurrentIndex(state, index) { 
        state.currentIndex = index;
      },
      updateCurrentTime(state, currentTime) {
        state.currentTime = currentTime;
      },
      changePlayState(state, isPlay) {  // 修改播放状态
        state.isPlay = isPlay;
      },
      updateMusicList(state, payload) {
        if (payload.musicListId != state.musicListId) {
          state.musicListId = payload.musicListId;
          state.currentIndex = -1;
        }
        let musicList = payload.musicList.slice(0);
        console.log(musicList);
        state.musicList = musicList;
      }
    }
})
export default store;
