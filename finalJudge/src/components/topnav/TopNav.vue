<template>
  <div class="topNav">
    <!-- 可以跳转回首页 -->
    <div class="left" @click="$router.push('./recommend')">
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
      <div class="search">
        <el-popover
          placement="bottom"
          width="300"
          v-model="isSearchPopShow"
          popper-class="searchPop"
          trigger="focus"
        >
          <el-input
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            size="mini"
            slot="reference"
            @keyup.enter.native="enterKey()"
            v-model="searchKey"
          >
          </el-input>

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
              <div class="hotSearchIndex" :class="index < 3 ? 'topThree' : ''">
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
        </el-popover>
      </div>
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

//节流定时器
// let timer = null;

export default {
  name: "TopNav",
  components: { Login, Register },
  data() {
    return {
      userInfo: {},
      //是否显示...
      isSearchPopShow: false, //搜索框
      searchKey: "", //需要搜索的内容
      keyWordList: [], //历史搜索
      // 热搜列表数据
      hotSearchList: [],
      isPopoverShow: false, //登陆页面框
      isRegisteredShow: false, //注册页面框
    };
  },
  props: {
    isImage: {
      type: String,
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
    //获得热搜列表
    async getHotData() {
      let res = await this.$request("/search/hot/detail");
      // console.log(result);
      this.hotSearchList = res.data.data;
    },

    //确定输入
    enterKey: async function () {
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

      // //获取搜索信息
      // let res = await getSearchMusic(this.searchKey);
      // this.searchList = res.data.result.songs;
      // // console.log(this.searchList);

      //跳转页面
      // this.isSearchPopShow = false;
      this.$router.push({ name: "search", params: { id: this.searchKey } });
    },

    //删除历史
    delHistory: function () {
      localStorage.removeItem("keyWordList");
      this.keyWordList = [];
    },

    // 点击历史记录、热搜榜也可以搜索
    search: async function (item) {
      // this.isSearchPopShow = false;
      this.$router.push({ name: "search", params: { id: item } });
    },

    // 获取当前用户信息
    getCurrentUserInfo: async function () {
      var timestamp = Date.parse(new Date());
      let res = await this.$request("/user/account", {
        timestamp,
      });
      // console.log(res);
      if (res.data.profile != null) {
        this.userInfo = res.data.profile;
        // 更新登录状态
        this.$store.commit("updataLoginState", true);
        // 更新当前用户id
        // this.$store.commit("updateCurrentUserId", res.data.profile.userId);
        // 将请求到的用户id存入localstorage
        window.localStorage.setItem("userId", res.data.profile.userId);
      } else {
        // 未登录
        this.$store.commit("updataLoginState", false);
        // 如果localstorage存有userId就清除
        if (window.localStorage.getItem("userId")) {
          window.localStorage.removeItem("userId");
        }
      }
    },

    // 跳转至个人页面
    goToPersonal() {
      if (this.$route.path != `/personal/${this.userInfo.userId}`)
        this.$router.push({
          name: "personal",
          params: { uid: this.userInfo.userId },
        });
      // console.log(this.$route);
    },

    // 关闭注册框
    closeRegistered() {
      this.isRegisteredShow = false;
    },
  },
  created() {
    this.getHotData();
    this.getCurrentUserInfo();
  },
};
</script>

<style scoped>
@import "./TopNav-element.css";

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

.right {
  display: flex;
  /* position: absolute; */
  /* right: 50px; */
  /* top: 0; */
  /* line-height: 50px; */
}
.right .user {
  display: flex;
  align-items: center;
  margin-right: 10px;
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
  width: 80px;
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
</style>