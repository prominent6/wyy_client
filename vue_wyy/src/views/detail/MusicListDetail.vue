<template>
  <div class="musicListDetail" v-if="musicListDetail">
    <!-- 歌单信息 -->
    <div class="listInfo">
      <!-- 歌单封面 -->
      <div class="listAvatar">
        <img :src="musicListDetail.coverImgUrl" alt="fengmian" />
      </div>
      <div class="right">
        <!-- 标题 -->
        <div class="title">
          <div class="titleTag">歌单</div>
          <div class="titleContent">{{ musicListDetail.name }}</div>
        </div>
        <!-- 用户信息 -->
        <div class="user">
          <div class="userAvatar">
            <img :src="musicListDetail.creator.avatarUrl" alt="touxiang" />
          </div>
          <div class="userName">
            {{ musicListDetail.creator.nickname }}
          </div>
          <div class="createTime">
            {{ musicListDetail.createTime | showDate }}创建
          </div>
        </div>
        <!-- 操作按钮 -->
        <div class="buttons">
          <div class="buttonItem playAll" @click="playAll">
            <svg class="icon playAll" aria-hidden="true">
              <use xlink:href="#icon-bofangqi-bofang"></use>
            </svg>
            <span>播放全部</span>
          </div>
          <div class="buttonItem">
            <svg
              class="icon black"
              aria-hidden="true"
              :class="isSub ? 'red' : ''"
            >
              <use xlink:href="#icon-aixin"></use>
            </svg>
            <span>{{ isSub ? "已收藏" : "收藏" }}</span>
          </div>

          <div class="buttonItem">
            <svg class="icon black" aria-hidden="true">
              <use xlink:href="#icon-zhuanfaxing"></use>
            </svg>
            <span>分享</span>
          </div>
        </div>
        <!-- 标签 -->
        <div class="tags">
          标签：
          <div
            class="tagItem"
            v-for="(item, index) in musicListDetail.tags"
            :key="index"
          >
            {{ item }}
          </div>
          <div v-if="musicListDetail.tags.length == 0">暂无标签</div>
        </div>
        <!-- 歌曲列表的歌曲数量和播放量 -->
        <div class="otherInfo">
          <div class="musicNum">
            歌曲 : {{ musicListDetail.trackCount | handleNum }}
          </div>
          <div class="playCount">
            播放 : {{ musicListDetail.playCount | handleNum }}
          </div>
        </div>
        -->
        <div class="desc">
          简介 :
          {{
            musicListDetail.description
              ? musicListDetail.description
              : "暂无简介"
          }}
        </div>
      </div>
    </div>

    <!-- 歌曲列表 -->
    <div class="musicList">
      <el-tabs value="first" @tab-click="clickTab">
        <el-tab-pane label="歌曲列表" name="first">
          <el-table
            :data="musicListDetail.tracks"
            style="width: 100%"
            highlight-current-row
            stripe
            lazy
            @row-dblclick="clickRow"
          >
            <el-table-column
              label=""
              type="index"
              :index="handleIndex"
              width="33"
            ></el-table-column>
            <el-table-column label="操作" width="70">
              <!-- 收藏按钮 -->
              <svg class="icon black" aria-hidden="true">
                <use xlink:href="#icon-aixin"></use>
              </svg>
              <!-- 下载按钮 -->
              <svg class="icon black" aria-hidden="true">
                <use xlink:href="#icon-xiazai"></use>
              </svg>
            </el-table-column>
            <el-table-column prop="name" label="标题" min-width="200">
            </el-table-column>
            <el-table-column
              prop="ar[0].name"
              label="歌手"
              min-width="99"
            ></el-table-column>
            <el-table-column prop="al.name" label="专辑" min-width="99">
            </el-table-column>
            <el-table-column prop="dt" label="时间" min-width="100">
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="评论" name="second">
          <div
            class="commentList"
            v-if="comments.comments"
            v-loading="isCommentLoading"
          >
            <!-- 精彩评论 -->
            <Comment
              v-if="comments.hotComments"
              ref="hotComments"
              :commentType="'musicList'"
              :commentId="musicListDetail.id + ''"
              @getComment="getMusicListComment"
              @scrollToComment="scrollToComment"
              :comments="comments.hotComments"
              ><div slot="title">精彩评论</div></Comment
            >
            <!-- 最新评论 -->
            <Comment
              :isHotComment="comments.hotComments ? false : true"
              :comments="comments.comments"
              :commentType="'musicList'"
              :commentId="musicListDetail.id + ''"
              @getComment="getMusicListComment"
              @scrollToComment="scrollToComment"
              ><div slot="title">最新评论</div></Comment
            >
          </div>
          <!-- 分页 -->
          <div
            class="page"
            v-show="comments.comments && comments.comments.length != 0"
          >
            <el-pagination
              background
              layout="prev, pager, next"
              :total="comments.total"
              small
              :page-size="50"
              :current-page="currentCommentPage"
              @current-change="commentPageChange"
            >
            </el-pagination>
          </div>
        </el-tab-pane>

        <el-tab-pane label="收藏者" name="third">
          <UserListCard
            :userList="followedsListData.followedsList"
          ></UserListCard>
          <div class="tips" v-if="followedsListData.followedsList.length == 0">
            暂无收藏者
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { formatDate, handleNum, handleMusicTime } from "plugins/utils";
import Comment from "components/comment/Comment";
import UserListCard from "components/show/UserListCard.vue";

export default {
  name: "musicListDetail",
  components: {
    Comment,
    UserListCard,
  },
  data() {
    return {
      musicListDetail: null, //歌单详情
      comments: {}, //评论
      isCommentLoading: false, // 评论是否在加载
      currentCommentPage: 1, // 当前评论页数
      isSub: false, // 用户是否收藏了当前歌单
      followedsListData: {
        // 收藏者列表的变量
        currentPage: 1, // 当前页数

        followedsList: [], // 列表
      },
    };
  },
  watch: {
    "$store.state.musicId"() {
      this.getMusicListDetail();
    },
  },
  methods: {
    // 根据传来的 id 查询歌单
    async getMusicListDetail() {
      var timestamp = Date.parse(new Date());
      let result = await this.$request("/playlist/detail", {
        id: this.$route.params.id,
        timestamp,
      });
      this.musicListDetail = result.data.playlist;
      //   console.log(this.musicListDetail);

      // 处理播放时间
      this.musicListDetail.tracks.forEach((item, index) => {
        this.musicListDetail.tracks[index].dt = handleMusicTime(item.dt);
      });
    },

    // 获取歌单收藏者
    async getMusicListFolloweds() {
      let res = await this.$request("/playlist/subscribers", {
        id: this.$route.params.id,
        offset: (this.followedsListData.currentPage - 1) * 20,
      });
      //   console.log(res);
      this.followedsListData.followedsList.push(...res.data.subscribers);
      //   console.log(this.followedsListData);
    },
    scrollToComment() {
      let musicListDetail = document.querySelector(".musicListDetail");
      let listInfo = document.querySelector(".listInfo");
      // console.log("执行了这里 滚动到精彩评论", [listInfo]);
      musicListDetail.scrollTo({
        behavior: "smooth",
        top: listInfo.clientHeight - 20,
      });
    },
    // 点击详情页导航栏时的回调
    clickTab(e) {
      if (e.index == 1 && !this.comments.comments) this.getMusicListComment();
      else if (e.index == 2) this.getMusicListFolloweds();
    },
    // 序号格式化
    handleIndex(index) {
      // console.log(index);
      index += 1;
      if (index < 10) {
        return "0" + index;
      } else {
        return index;
      }
    },
    // 获取歌单评论
    async getMusicListComment(type) {
      var timestamp = Date.parse(new Date());
      this.isCommentLoading = true;

      if (type == "changePage") {
        this.scrollToComment();
      }
      let res = await this.$request("/comment/playlist", {
        id: this.$route.params.id,
        limit: 50,
        offset: (this.currentCommentPage - 1) * 50,
        timestamp,
      });
      if (res.data.code !== 200) {
        this.$message.error("获取评论失败,请稍后重试!");
      }
      this.comments = res.data;
      //   console.log(this.comments);
      this.isCommentLoading = false;
    },

    commentPageChange(page) {
      this.currentCommentPage = page;
      this.getMusicListComment("changePage");
    },
    // 点击播放全部按钮的回调
    playAll() {
      this.$store.commit("updateMusicId", this.musicListDetail.tracks[0].id);

      //   console.log(this.musicListDetail.tracks);
      if (this.musicListDetail.id != this.$store.state.musicListId) {
        // 将歌单传到vuex
        this.$store.commit("updateMusicList", {
          musicList: this.musicListDetail.tracks,
          musicListId: this.musicListDetail.id,
        });
      }

    },
    clickRow(row) {
      // 这里双击应该是要把当前双击的歌曲插入到当前的歌单中
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
  },
  filters: {
    showDate(value) {
      const date = new Date(value);
      return formatDate(date, "yyyy-mm-dd");
    },
    handleNum,
  },
  created() {
    this.getMusicListDetail();
  },
};
</script>

<style scoped>
.black {
  fill: black;
  font-size: 18px;
  margin-right: 5px;
}
.musicListDetail {
  overflow-y: scroll;
}

.listInfo {
  display: flex;
  padding: 25px 15px;
  align-items: center;
}

.listAvatar {
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 10px;
  margin-right: 15px;
  /* position: relative; */
}

/* .listAvatar::after {
  content: "";
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  background: url("~assets/img/imgLoading.png") no-repeat;
  background-size: contain;
  z-index: -1;
} */

.listAvatar img {
  width: 100%;
}

.right {
  width: calc(100% - 200px);
}

.title {
  display: flex;
  align-items: center;
}

.titleTag {
  font-size: 12px;
  color: #ec4141;
  border: 1px solid #ec4141;
  padding: 1px 2px;
  border-radius: 2px;
  margin-right: 5px;
  transform: scale(0.8);
}

.titleContent {
  font-size: 20px;
  font-weight: 600;
  color: #373737;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 90%;
}

.user {
  display: flex;
  align-items: center;
  margin-top: 8px;
  font-size: 12px;
}

.userAvatar {
  height: 25px;
  width: 25px;
  margin-right: 8px;
}

.userAvatar img {
  width: 100%;
  border-radius: 50%;
}

.userName {
  color: #6191c2;
  margin-right: 8px;
  cursor: pointer;
}

.createTime {
  transform: scale(0.9);
}

.buttons {
  margin: 8px 0 0 -5px;
  display: flex;
}

.buttonItem {
  font-size: 12px;
  padding: 8px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  transform: scale(0.9);
  display: flex;
  align-items: center;
}

.buttonItem .icon {
  font-size: 20px;
  margin-right: 3px;
  transform: scale(0.9);
}

.playAll {
  background-color: #ec4141;
  color: white;
}

.tags {
  margin: 8px 0 0 -30px;
  display: flex;
  font-size: 12px;
  transform: scale(0.9);
}

.tagItem {
  color: #6191c2;
  margin-right: 5px;
}

.otherInfo {
  margin: 5px 0 0 -30px;
  display: flex;
  font-size: 12px;
  transform: scale(0.9);
}

.musicNum {
  margin-right: 13px;
}

.desc {
  margin: 5px 0 0 -30px;
  font-size: 12px;
  transform: scale(0.9);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.musicList {
  margin: -15px 15px 0;
}

.page {
  width: 100%;
  text-align: center;
  padding-bottom: 60px;
}

.placeholder {
  width: 100%;
  height: 50px;
}

.loadMore {
  width: 100%;
  height: 50px;
  font-size: 12px;
  color: #aaa;
  text-align: center;
  line-height: 50px;
  transform: scale(0.9);
}

.red {
  color: #ec4141;
}

.commentList /deep/ .el-loading-spinner {
  top: 40px;
}

.tips {
  font-size: 14px;
  margin: 30px 0;
  text-align: center;
}
</style>