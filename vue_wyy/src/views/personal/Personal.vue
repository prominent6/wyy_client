<template>
  <div class="Personal">
    <div class="userInfo" v-if="userInfo.avatarUrl">
      <div class="left">
        <img
          :src="userInfo.avatarUrl + '?param=400y400'"
          alt=""
          class="avatar"
        />
      </div>

      <div class="right">
        <div class="rightTop">
          <div class="username">
            <div>{{ userInfo.nickname }}</div>
          </div>
          <div class="tags">
            <div class="level">{{ "Lv" + userInfo.level }}</div>
            <div class="bianji">
              <svg class="icon black" aria-hidden="true">
                <use xlink:href="#icon-bianji"></use>
              </svg>
              <span @click="goToPersonalEdit">编辑个人信息</span>
            </div>
          </div>
        </div>

        <div class="rightBottom">
          <!-- 动态 关注 粉丝 -->
          <div class="dataNums">
            <div class="numItem">
              <div class="numItemTop">{{ userInfo.eventCount }}</div>
              <div class="numItemBottom">动态</div>
            </div>
            <div
              class="numItem"
              @click="
                $router.push({
                  name: 'follows',
                  params: { uid: $route.params.uid },
                })
              "
            >
              <div class="numItemTop">{{ userInfo.newFollows }}</div>
              <div class="numItemBottom">关注</div>
            </div>
            <div
              class="numItem"
              @click="
                $router.push({
                  name: 'followeds',
                  params: { uid: $route.params.uid },
                })
              "
            >
              <div class="numItemTop">{{ userInfo.followeds }}</div>
              <div class="numItemBottom">粉丝</div>
            </div>
          </div>

          <!-- 其它信息 -->
          <div class="otherInfo">
            <div class="otherInfoItem">
              <div class="otherInfoKey">用户id：</div>
              <div class="ptherInfoValue">{{ userInfo.userId }}</div>
            </div>
            <div class="otherInfoItem">
              <div class="otherInfoKey">所在地区：</div>
              <div class="ptherInfoValue">
                {{ userInfo.province + " " + userInfo.city }}
              </div>
            </div>
            <div class="otherInfoItem">
              <div class="otherInfoKey">个人介绍：</div>
              <div class="ptherInfoValue">
                {{ userInfo.signature == "" ? "暂无介绍" : userInfo.signature }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 歌单 -->
    <div class="musicList">
      <el-tabs v-model="activeName">
        <el-tab-pane label="创建的歌单" name="one">
          <list-card
            :listCardData="createdMusicList"
            @clickListCardItem="clickListCardItem"
            v-if="createdMusicList != null"
          ></list-card>
          <div v-else style="text-align: center; margin-top: 20px">暂无</div>
        </el-tab-pane>
        <el-tab-pane label="收藏的歌单" name="two">
          <list-card
            :listCardData="collectedMusicList"
            @clickListCardItem="clickListCardItem"
            v-if="collectedMusicList != null"
          ></list-card>
          <div v-else style="text-align: center; margin-top: 20px">暂无</div>
        </el-tab-pane>
        <el-tab-pane label="创作的音乐专栏" name="three">
          <div style="text-align: center; margin-top: 20px">暂无</div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import ListCard from "components/show/ListCard.vue";
// import NavBar from "@/components/usual/NavBar";

export default {
  components: { ListCard },
  name: "personal",
  data() {
    return {
      // 用户信息
      userInfo: {},
      // 创建的歌单
      createdMusicList: [],
      // 收藏的歌单
      collectedMusicList: [],
      // 该用户是否为当前用户
      // isCurrentUser: false,
      activeName: "one",
    };
  },
  methods: {
    // clickBarItem(path) {
    //   this.$router.push(path);
    // },
    // 请求
    // 获取用户信息
    async getUserInfo() {
      let res = await this.$request(
        `/user/detail?uid=${this.$route.params.uid}`
      );
      if (!res) {
        this.$message.error("获取用户信息失败!");
        return;
      }
      // console.log(res);
      res.data.profile["level"] = res.data.level;
      this.userInfo = res.data.profile;
    },

    // 请求用户歌单
    async getUserMusicList() {
      let timestamp = Date.parse(new Date());
      // 先从localStorage里面读取用户信息  如果登录成功是有存的
      let res = await this.$request("/user/playlist", {
        uid: this.$route.params.uid,
        timestamp,
      });
      console.log(res);
      // 对数据进行处理分类
      res = res.data.playlist;
      let index = res.findIndex((item) => item.subscribed == true);
      // res[0].name = `${this.userInfo.nickname}喜欢的音乐`;
      res[0].name = `我喜欢的音乐`;
      this.createdMusicList = res.slice(0, index);
      this.collectedMusicList = res.slice(index);
    },

    // 事件
    // 点击歌单的回调
    clickListCardItem(id) {
      this.$router.push({ name: "musicListDetail", params: { id } });
    },
    // 跳转至个人编辑页面
    goToPersonalEdit() {
      this.$router.push({
        name: "personaledit",
        params: { uid: this.$route.params.uid },
      });
    },
  },
  watch: {
    // "$store.state.isLogin"(current) {
    //   if (window.localStorage.getItem("userId") && current) {
    //     this.isCurrentUser =
    //       window.localStorage.getItem("userId") == this.$route.params.uid;
    //   }
    // },
  },
  async created() {
    await this.getUserInfo();
    this.getUserMusicList();
    // // 判断该用户是不是当前登录用户
    // if (window.localStorage.getItem("userId")) {
    //   this.isCurrentUser =
    //     window.localStorage.getItem("userId") == this.$route.params.uid;
    // }
  },
};
</script>

<style scoped>
.Personal {
  overflow-y: scroll;
  height: 700px;
}

.userInfo {
  margin: 30px 10px 0 10px;
  display: flex;
}

.avatar {
  margin-top: 5px;
  height: 150px;
  width: 150px;
  object-fit: cover;
  border-radius: 50%;
}

.right {
  margin-left: 20px;
  flex: 1;
}

.username {
  color: #373737;
  font-size: 22px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
}

.bianji {
  margin-right: 10px;
  color: #373737;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  cursor: pointer;
  font-weight: lighter;
  padding: 0 15px;
  border: 1px solid #ddd;
  transform: scale(0.9);
}

.bianji .icon {
  font-size: 18px;
  margin-right: 3px;
  fill: black;
}

.tags {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}

.level {
  font-size: 13px;
  transform: scale(0.8) translateX(-10%);
  background-color: #f0f0f0;
  padding: 6px 8px;
  border-radius: 10px;
  color: #373737;
}

.rightTop {
  width: 100%;
  border-bottom: 1px solid #ddd;
}

.dataNums {
  display: flex;
  margin: 10px 0 5px;
}

.numItem {
  border-left: 1px solid #eee;
  padding: 0 25px;
  text-align: center;
  cursor: pointer;
}

.numItem:nth-child(1) {
  border-left: none;
  padding-left: 3px;
}

.numItemTop {
  color: #373737;
  font-size: 20px;
}

.numItemBottom {
  font-size: 16px;
  transform: scale(0.8);
}

.otherInfo {
  font-size: 14px;
  transform: scale(0.9) translateX(-5%);
  user-select: text !important;
}

.otherInfoItem {
  display: flex;
  margin: 8px 0 0 0;
}

.otherInfoKey {
  color: #2e2e2e;
  font-size: 15px;
}

.otherInfoValue {
  width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.musicList {
  max-width: 1100px;
  margin: 0 auto;
  height: 100%;
  padding: 30px;
}

.musicListTitle {
  color: #373737;
  font-weight: bold;
  font-size: 14px;
}
</style>
