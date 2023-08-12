<template>
  <div class="topNav">
    <!-- 可以跳转回首页 -->
    <div class="left" @click="$router.push('/')">
      <img src="~assets/img/logo.png" alt="logo" v-show="isImage" />
    </div>
    <div class="center">
      <div class="buttons">
        <!-- 后退一个页面 -->
        <svg class="icon back" aria-hidden="true" @click="$router.go(-1)">
          <use xlink:href="#icon-xiangzuojiantou"></use>
        </svg>
        <!-- 前进一个页面 -->
        <svg class="icon forward" aria-hidden="true" @click="$router.go(1)">
          <use xlink:href="#icon-xiangyoujiantou"></use>
        </svg>
      </div>

      <!-- 搜索 -->
      <div class="search">
        <el-popover
          placement="bottom"
          width="300"
          trigger="focus"
          popper-class="searchPop"
          v-model="isSearchPopShow"
        >
          <el-input
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            size="mini"
            slot="reference"
            @input="inputSearch"
            v-model="searchKey"
            @keyup.enter.native="enterKey()"
          ></el-input>
          <div v-if="!searchSuggestList.songs">
            <!-- 历史搜索 -->
            <div class="search-history">
              <div class="bar">
                <div>搜索历史</div>
                <svg class="icon" aria-hidden="true" @click="delHistory">
                  <use xlink:href="#icon-lajitong"></use>
                </svg>
              </div>
              <div class="content">
                <!-- 点击历史记录也可以搜索 -->
                <span
                  v-for="item in keyWordList"
                  :key="item"
                  @click="search(item)"
                  >{{ item }}</span
                >
              </div>
            </div>

            <!-- 热搜榜 -->
            <div class="hotSearch">
              <div class="hotSearchTitle">热搜榜</div>
              <div
                class="hotSearchItem"
                v-for="(item, index) in hotSearchList"
                :key="index"
                @click="search(item.searchWord)"
              >
                <div
                  class="hotSearchIndex"
                  :class="index < 3 ? 'topThree' : ''"
                >
                  {{ index + 1 }}
                </div>
                <div class="hotSearchInfo">
                  <div
                    class="hotSearchWord"
                    :class="index < 3 ? 'hotSearchWordTopThree' : ''"
                  >
                    {{ item.searchWord }}
                  </div>
                  <div class="hotSearchContent">{{ item.content }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 搜索建议 -->
          <div class="searchSuggest">
            <div class="hotSearchTitle" v-if="searchSuggestList.songs">
              搜索建议
            </div>
            <!-- 单曲 -->
            <div
              class="searchSuggestItem"
              v-if="
                searchSuggestList.songs && searchSuggestList.songs.length != 0
              "
            >
              <div class="searchSuggestItemTitle">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-music-note"></use>
                </svg>
                单曲
              </div>
              <div
                class="suggestItemDetail"
                v-for="(item, index) in searchSuggestList.songs"
                :key="index"
                @click="clickSuggestSong(item.id)"
              >
                {{ item.name + " - " + item.artists[0].name }}
              </div>
            </div>
            <!-- 歌手 -->
            <div
              class="searchSuggestItem"
              v-if="
                searchSuggestList.artists &&
                searchSuggestList.artists.length != 0
              "
            >
              <div class="searchSuggestItemTitle">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-geshou"></use>
                </svg>
                歌手
              </div>
              <div
                class="suggestItemDetail"
                v-for="(item, index) in searchSuggestList.artists"
                :key="index"
                @click="clickSuggestSinger(item.id)"
              >
                {{ item.name }}
              </div>
            </div>
            <!-- 专辑 -->
            <div
              class="searchSuggestItem"
              v-if="
                searchSuggestList.albums && searchSuggestList.albums.length != 0
              "
            >
              <div class="searchSuggestItemTitle">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-zhuanji"></use>
                </svg>
                专辑
              </div>
              <div
                class="suggestItemDetail"
                v-for="(item, index) in searchSuggestList.albums"
                :key="index"
                @click="clickSuggestAlbum(item.id)"
              >
                {{ item.name + " - " + item.artist.name }}
              </div>
            </div>
            <!-- 歌单 -->
            <div
              class="searchSuggestItem"
              v-if="
                searchSuggestList.playlists &&
                searchSuggestList.playlists.length != 0
              "
            >
              <div class="searchSuggestItemTitle">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-gedan1"></use>
                </svg>
                歌单
              </div>
              <div
                class="suggestItemDetail"
                v-for="(item, index) in searchSuggestList.playlists"
                :key="index"
                @click="clickSuggestMusicList(item.id)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </el-popover>
      </div>

      <div class="right">
        <div class="user">
          <div class="avatar">
            <!-- 登录框 -->
            <el-popover
              placement="bottom"
              width="300"
              trigger="click"
              v-model="isPopoverShow"
              v-if="!userInfo.avatarUrl"
            >
              <login
                v-if="isPopoverShow"
                :isRegisteredShow.sync="isRegisteredShow"
                @getUserInfo="
                  (info) => {
                    userInfo = info;
                    isPopoverShow = false;
                  }
                "
              />
              <img src="~assets/img/test.jpg" alt="" slot="reference" />
            </el-popover>

            <img
              :src="userInfo.avatarUrl"
              alt=""
              slot="reference"
              v-else
              @click="goToPersonal"
            />
          </div>
          <!-- 用户名 -->
          <div class="userName" v-if="userInfo.nickname">
            {{ userInfo.nickname }}
          </div>
          <div class="userName" v-else>点击头像登录</div>
          <svg class="icon icon_bigger" aria-hidden="true" @click="userDrawer">
            <use xlink:href="#icon-zhankai"></use>
          </svg>
          <div class="user_drawer" v-if="$store.state.isDrawerShow">
            <div
              class="logout"
              @click="logout"
              v-if="this.$store.state.isLogin"
            >
              <svg class="icon black" aria-hidden="true">
                <use xlink:href="#icon-tuichudenglu"></use>
              </svg>
              <span>退出登录</span>
            </div>
          </div>
        </div>

        <!-- operation -->
        <ul class="operation">
          <li>
            <a href="#">
              <svg class="icon icon_bigger" aria-hidden="true">
                <use xlink:href="#icon-zhuti_yifu_o"></use>
              </svg>
            </a>
          </li>
          <li>
            <a href="#" title="设置">
              <svg class="icon icon_bigger" aria-hidden="true">
                <use xlink:href="#icon-shezhi"></use>
              </svg>
            </a>
          </li>
          <li>
            <a href="#">
              <svg class="icon icon_bigger" aria-hidden="true">
                <use xlink:href="#icon-duanxin"></use>
              </svg>
            </a>
          </li>

          <li class="line">|</li>
          <li>
            <a href="#" title="mini模式（Ctrl+M）">
              <svg class="icon icon_bigger" aria-hidden="true">
                <use xlink:href="#icon-zuixiaohua"></use>
              </svg>
            </a>
          </li>
          <li>
            <a href="#" title="最小化">
              <svg class="icon icon_bigger" aria-hidden="true">
                <use xlink:href="#icon-suoxiao"></use>
              </svg>
            </a>
          </li>
          <li>
            <a href="#" title="最大化">
              <svg class="icon icon_bigger" aria-hidden="true">
                <use xlink:href="#icon-zuidahua"></use>
              </svg>
            </a>
          </li>
          <li>
            <a href="#" title="关闭">
              <svg class="icon icon_bigger" aria-hidden="true">
                <use xlink:href="#icon-guanbi_o"></use>
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- 注册框组件 -->
    <Register
      :isDialogShow="isRegisteredShow"
      @closeRegistered="closeRegistered"
    ></Register>
  </div>
</template>

<script>
import Login from "@/components/login/Login.vue";
import Register from "components/register/Register.vue";
import { getTimeStamp } from "@/plugins/utils";

//定时器
let timer;

export default {
  name: "TopNav",
  components: { Login, Register },

  data() {
    return {
      isSearchPopShow: false, //popover是否显示
      searchKey: "", //需要搜索的内容
      searchSuggestList: {}, // 搜索建议列表

      keyWordList: [], //历史搜索
      hotSearchList: [], // 热搜列表数据

      userInfo: {}, //用户信息
      isPopoverShow: false, //登陆页面框
      isRegisteredShow: false, //注册页面框
    };
  },
  props: {
    isImage: {
      type: Boolean,
      default: "",
    },
    bgc: {
      type: String,
      default: "#e13e3e",
    },
  },
  mounted() {
    this.keyWordList = JSON.parse(localStorage.getItem("keyWordList")) || []; //空值处理
  },
  methods: {
    //根据id获取歌曲详情
    async getMusicInfo(ids) {
      let res = await this.$request("/song/detail", { ids });
      // console.log(res);
      // 处理时间
      // res.data.songs[0].dt = handleMusicTime(res.data.songs[0].dt);
      return res.data.songs[0];
    },

    // 在搜索框中输入的回调
    inputSearch(e) {
      // console.log(e);
      clearTimeout(timer);
      if (e != "") {
        timer = setTimeout(() => {
          this.getSearchSuggest(e);
        }, 500);
      } else {
        this.searchSuggestList = {};
        return;
      }
    },

    // 获取搜索建议
    async getSearchSuggest(keywords) {
      let res = await this.$request("/search/suggest", { keywords });
      this.searchSuggestList = res.data.result;
    },

    // 点击搜索建议中专辑的回调
    clickSuggestAlbum(id) {
      this.$router.push({ name: "album", params: { id } });
      this.isSearchPopShow = false;
    },
    // 点击搜索建议中歌手的回调
    clickSuggestSinger(id) {
      this.$router.push({ name: "singerDetail", params: { id } });
      this.isSearchPopShow = false;
    },
    // 点击搜索建议中歌单的回调
    clickSuggestMusicList(id) {
      this.$router.push({ name: "musicListDetail", params: { id } });
      this.isSearchPopShow = false;
    },
    // 点击搜索建议中单曲的回调
    async clickSuggestSong(id) {
      let row = await this.getMusicInfo(id);
      this.isSearchPopShow = false;
      // 首先获取当前的歌单列表和歌曲索引
      let musicList = this.$store.state.musicList;
      let currentIndex = this.$store.state.currentIndex;
      // 先判断该歌曲是否已经在歌单中存在，避免重复点击导致歌单出现相同歌曲
      let isExist = musicList.find((item) => item.id == row.id);
      if (isExist) {
        // 如果已经存在 则只提交歌曲id并return出去
        this.$store.commit("updateMusicId", row.id);
        return;
      }
      this.$store.commit("changePlayState", false);
      // 将请求到的歌曲详情插入到歌单对应位置并提交至vuex
      musicList.splice(currentIndex + 1, 0, row);
      this.$store.commit("updateMusicId", row.id);
      this.$store.commit("updateMusicList", {
        musicList,
        musicListId: this.$store.state.musicListId,
      });
    },

    //获得热搜列表
    async getHotData() {
      let res = await this.$request("/search/hot/detail");
      this.hotSearchList = res.data.data;
    },

    async enterKey() {
      //加入历史记录
      if (this.searchKey != "") {
        this.keyWordList.unshift(this.searchKey);
      }
      //去重
      this.keyWordList = [...new Set(this.keyWordList)];
      //限制长度
      if (this.keyWordList.length > 10) {
        this.keyWordList.pop();
      }
      //本地存储
      localStorage.setItem("keyWordList", JSON.stringify(this.keyWordList));
      this.$router.push({ name: "search", params: { id: this.searchKey } });

      //跳转页面
      this.isSearchPopShow = false;
      this.$router.push({ name: "search", params: { id: this.searchKey } });
    },

    //删除历史
    delHistory() {
      localStorage.removeItem("keyWordList");
      this.keyWordList = [];
    },

    // 点击历史记录、热搜榜也可以搜索
    search(item) {
      this.searchKey = item;
      this.isSearchPopShow = false;
      this.$router.push({ name: "search", params: { id: item } });
    },

    //获取当前用户信息
    async getCurrentUserInfo() {
      var timestamp = Date.parse(new Date());
      let res = await this.$request("/user/account", {
        timestamp,
      });
      // console.log(res);
      if (res.data.profile != null) {
        this.userInfo = res.data.profile;
        this.$store.commit("updateLoginState", true);
        window.localStorage.setItem("userId", res.data.profile.userId);
      } else {
        this.$store.commit("updateLoginState", false);
        if (window.localStorage.getItem("userId")) {
          window.localStorage.removeItem("userId");
        }
      }
    },

    // 关闭注册框
    closeRegistered() {
      this.isRegisteredShow = false;
    },

    // 跳转至个人页面
    goToPersonal() {
      if (this.$router.path != `/personal/${this.userInfo.userId}`) {
        this.$router.push({
          name: "personal",
          params: { uid: this.userInfo.userId },
        });
      }
    },

    userDrawer() {
      // 修改vuex中的状态
      this.$store.commit("updateDrawerState");
    },

    // 点击退出登录的回调
    async logout() {
      let res = await this.$request("/logout", { timestamp: getTimeStamp() });
      // console.log(res);

      if (res.data.code != 200) {
        this.$message("退出登录失败, 请稍后重试!");
        return;
      }

      // 清空data和localstorage中的数据，以及cookie
      // window.localStorage.setItem("userInfo", "");
      // this.clearAllCookie();
      // 删除localstoarge的userId
      window.localStorage.removeItem("userId");
      //   在vuex中更新登录状态
      this.$store.commit("updateLoginState", false);
      this.$message.success("退出成功!");
      // this.isCurrentUser = false;
    },
  },
  created() {
    this.getHotData();
    this.getCurrentUserInfo();
  },

  watch: {
    "$store.state.isLogin"(current) {
      //如果退出登录后数据还没清空，则清空数据
      if (!current && this.userInfo.nickname) {
        this.userInfo = {};
      }
    },
  },
};
</script>

<style scoped>
@import "./TopNav-element.css";
.icon {
  fill: white;
  cursor: pointer;
}
.line {
  color: white;
}
.topNav {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: bgc;
}
.left {
  width: 140px;
  margin: 0 50px 0 10px;
  cursor: pointer;
}
.left img {
  width: 100%;
}

.center {
  display: flex;
  align-content: center;
}
.buttons {
  color: rgb(235, 235, 235);
  display: flex;
  height: 22px;
  min-width: 20px;
  cursor: pointer;
}
.buttons .icon {
  background-color: bgc;
  transform: scale(0.8);
  padding: 5px;
  height: 28px;
  width: 28px;
  border-radius: 50%;
  margin: 0 3px;
}

/* 搜索历史 */
.search-history {
  margin-top: 10px;
  width: 100%;
}
.search-history .bar {
  margin: 10px 0 5px 10px;
  display: flex;
  justify-content: space-between;
}
.search-history .bar .icon {
  width: 28px;
  height: 28px;
  fill: black;
  cursor: pointer;
}
.search-history .content span {
  display: inline-block;
  padding: 0.1rem 0.2rem;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  margin: 5px;
  padding: 3px 9px;
  border: 1px solid #aaa;
  font-size: 12px;
  cursor: pointer;
}

/* 热搜榜 */
.hotSearchTitle {
  font-size: 15px;
  margin: 10px 0 5px 10px;
}
.hotSearchItem {
  display: flex;
  align-items: center;
  padding: 6.5px 15px;
  cursor: pointer;
}
.hotSearchItem:hover {
  background-color: #f2f2f2;
}
.hotSearchIndex {
  margin-right: 15px;
  color: #aaa;
}
.topThree {
  color: #e13e3e;
}
.hotSearchWord {
  font-size: 12px;
  color: rgb(51, 51, 51);
}
.hotSearchWordTopThree {
  font-weight: 600;
  color: black;
}
.hotSearchContent {
  font-size: 12px;
  transform: scale(0.9) translateX(-5%);
}

/* 搜索建议 */
searchSuggest {
  font-size: 12px;
}

.searchSuggestItemTitle {
  background-color: #f5f5f7;
  padding: 4px 8px;
}

.searchSuggestItemTitle i {
  font-size: 15px;
}

.searchSuggestItem {
  cursor: pointer;
}

.suggestItemDetail {
  padding: 4px 27px;
  font-size: 12px;
}

.suggestItemDetail:hover {
  background-color: #f2f2f2;
}

/* 右边部分 */
.right {
  display: flex;
  position: relative;
  /* position: absolute; */
  /* right: 50px; */
  /* top: 0; */
  /* line-height: 50px; */
}
.right .user {
  display: flex;
  align-items: center;
  margin-right: 25px;
}

.right .avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 7px;
  cursor: pointer;
  line-height: 30px;
}

.right .avatar img {
  width: 100%;
}

.right .userName {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  /* 单行文本溢出隐藏 */
  width: 76px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.right .operation {
  display: flex;
  align-items: center;
}
.right .operation li {
  margin: 0 8px;
}
.right .operation .line {
  margin: 0 6px;
  color: bgc;
}
.icon_bigger {
  font-size: 25px;
  line-height: 28px;
}

.user_drawer {
  position: absolute;
  background-color: white;
  top: 45px;
  left: 0px;
  border: 1px solid #ddd;
  width: 140px;
}

.logout {
  color: #373737;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: lighter;
  padding: 0 15px;
  transform: scale(0.9);
}

.logout:hover {
  background-color: #f2f2f2;
}

.logout .icon {
  font-size: 20px;
  margin-right: 5px;
  fill: black;
}

.logout span {
  font-size: 18px;
}
</style>