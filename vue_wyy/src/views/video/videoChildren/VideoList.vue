<template>
  <div class="videoList">
    <!-- 视频列表 -->
    <!-- 视频navbar -->
    <div class="musicListNavBar" v-if="tagList.length != 0">
      <!-- 左边部分 -->
      <div class="left">
        <SortBox
          :currentTag="currentTag"
          :tagList="tagList"
          @getSortList="getSortList"
          @clickSortBoxItem="clickSortBoxItem"
        ></SortBox>
      </div>
      <!-- 右边部分 -->
      <div class="right">
        <SecondNavBar
          :SecondNavBarData="showList"
          :itemWidth="0"
          :currentTag="currentTag"
          @clickSecondBarItem="clickSecondBarItem"
        ></SecondNavBar>
      </div>
    </div>
    <!-- <div>视频列表</div> -->
    <!-- 视频卡片列表 -->
    <VideoListCard
      :videoList="videoList"
      :isLoad="true"
      :videoType="'video'"
      class="cardList"
      @clickListCardItem="goToVideoDetail"
      @bottomLoad="bottomLoad"
    >
    </VideoListCard>

    <go-top scrollObj=".cardList"></go-top>
  </div>
</template>

<script>
import SecondNavBar from "components/show/SecondNavBar.vue";
import VideoListCard from "components/show/VideoListCard.vue";
import GoTop from "components/usual/GoTop.vue";
import SortBox from "components/show/SortBox.vue";
export default {
  components: { SecondNavBar, VideoListCard, GoTop, SortBox },
  name: "VideoList",
  data() {
    return {
      // 视频分类tag列表
      tagList: [],
      //右边展示tag列表
      showList: [],
      // 当前标签
      currentTag: {},
      // 视频列表数据
      videoList: [],
      // 当前视频页数
      videoPage: 1,
      // 是否还有更多视频数据
      hasMore: true,
    };
  },
  methods: {
    // 请求

    //获取分类下的视频
    async getVideoList(id) {
      let i = 2;
      while (i) {
        if (this.hasMore) {
          let res = await this.$request("/video/group", {
            id,
            offset: 8 * (this.videoPage - 1),
          });
          this.hasMore = res.data.hasmore;
          this.videoList.push(...res.data.datas);
          this.videoPage += 1;
          i--;
        } else {
          return;
        }
      }
      // console.log(this.videoList);
    },

    // 获取视频分类tag
    async getSortList() {
      let res = await this.$request("/video/group/list");
      // console.log(res);
      // console.log(res.data.data);
      this.tagList = res.data.data;
      this.currentTag = this.tagList[0];
      this.showList = this.tagList.slice(0, 8);
    },

    // 事件
    // 点击分类的回调
    clickSecondBarItem(index) {
      // console.log("clickSecondBarItem");
      this.videoPage = 1;
      this.videoList = [];
      this.currentTag = this.videoCategory[index];
      this.getVideoList(this.currentTag.id);
    },

    // 进入视频详情页面
    goToVideoDetail({ id }) {
      console.log(id);
      this.$router.push({
        name: "videoDetail",
        params: { id, type: "video" },
      });
    },
    // 上拉触底的回调
    bottomLoad() {
      // console.log("goToVideoDetail");
      if (this.hasMore) {
        this.getVideoList(this.currentTag.id);
      }
    },

    // 点击sortBoxItem的分类item的回调
    clickSortBoxItem(item) {
      this.currentTag = item;
      this.videoPage = 1;
      this.getVideoList(item.id);
    },
  },
  async created() {
    await this.getSortList();
    await this.getVideoList(this.currentTag.id);
  },
};
</script>

<style scoped>
.musicListNavBar {
  padding: 0px 25px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.page {
  width: 100%;
  text-align: center;
  padding-bottom: 20px;
}

.cardList {
  overflow-y: scroll;
}
</style>