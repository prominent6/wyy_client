<template>
  <div class="musicList">
    <!-- 精选歌单入口展示 -->
    <div class="highqualityEntry">
      <img
        :src="theFirstOfHighquality.coverImgUrl"
        alt=""
        class="backgroundImg"
      />
      <div class="cover">
        <img :src="theFirstOfHighquality.coverImgUrl" alt="" />
      </div>
      <div class="EntryInfo">
        <div class="tag"><i class="iconfont icon-good"></i> 精品歌单</div>
        <div class="name">{{ theFirstOfHighquality.name }}</div>
        <div class="desc">{{ theFirstOfHighquality.copywriter }}</div>
      </div>
    </div>
    <!-- 歌单列表 -->
    <div class="musicListNavBar">
      <div class="left">
        <SortBox
          @getSortList="getSortList"
          :currentTag="currentTag"
          :sortList="sortList"
          @clickSortBoxItem="clickSortBoxItem"
        ></SortBox>
      </div>
      <div class="right">
        <SecondNavBar
          :SecondNavBarData="hotTags"
          :currentTag="currentTag"
          @clickSecondBarItem="clickSecondBarItem"
        >
        </SecondNavBar>
      </div>
    </div>
    <!-- 展示歌单列表 -->
    <list-card
      :listCardData="musicList.playlists"
      @clickListCardItem="clickListCardItem"
    ></list-card>
    <!-- 分页 -->
    <div class="page" v-if="musicList.playlists">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="musicList.total"
        :page-size="50"
        small
        :current-page="currentPage"
        @current-change="pageChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import SortBox from "components/show/SortBox.vue";
import SecondNavBar from "components/show/SecondNavBar.vue";
import ListCard from "components/show/ListCard.vue";

export default {
  name: "musicList",
  data() {
    return {
      theFirstOfHighquality: {},
      sortList: [], // 分类数据
      currentTag: {}, //当前标签
      hotTags: [], //热门标签数据
      musicList: {}, //当前标签下音乐列表
      currentPage: 1,
    };
  },
  components: {
    SortBox,
    SecondNavBar,
    ListCard,
  },
  methods: {
    // 获取高质量歌单的第一条数据
    async getTheFirstOfHighquality() {
      let result = await this.$request("/top/playlist/highquality", {
        limit: 1,
      });
      this.theFirstOfHighquality = result.data.playlists[0];
    },
    // 获取歌单分类数据
    async getSortList() {
      let res = await this.$request("/playlist/catlist");
      // console.log(res);
      this.sortList = res.data.sub;
    },
    // 获取热门歌单tag数据
    async getHotTag() {
      let result = await this.$request("/playlist/hot");
      this.currentTag = result.data.tags[0];
      this.hotTags = result.data.tags;
    },
    // 根据歌名请求歌单列表
    async getMusicList() {
      this.musicList = {};
      let result = await this.$request("/top/playlist", {
        cat: this.currentTag.name,
        offset: 50 * (this.currentPage - 1),
      });
      this.musicList = result.data;
    },
    //选择的回调
    clickSortBoxItem(item) {
      this.currentTag = item;
      this.currentPage = 1;
      this.getMusicList();
    },
    clickSecondBarItem(index) {
      this.currentTag = this.hotTags[index];
      this.currentPage = 1;
      this.getMusicList();
    },

    // 点击歌单的回调
    clickListCardItem(id) {
      // console.log(id);
      this.$router.push({ name: "musicListDetail", params: { id } });
    },
    pageChange(page) {
      // page是当前页数
      // console.log(e);
      this.currentPage = page;
      this.getMusicList();
    },
  },
  created() {
    this.getTheFirstOfHighquality();
    this.getHotTag();
    this.getSortList();
    this.getMusicList();
  },
};
</script>

<style scoped>
.highqualityEntry {
  position: relative;
  width: 100%;
  height: 140px;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
}
.backgroundImg {
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  width: 100%;
  transform: translateY(-80px);
  filter: blur(30px) brightness(70%);
}

.cover {
  width: 120px;
  height: 120px;
  margin: 10px;
}

.cover img {
  border-radius: 10px;
  width: 100%;
}

.tag {
  color: #d59e54;
  border: 1px solid #d59e54;
  padding: 5px 10px;
  width: 88px;
  font-size: 12px;
  margin: 20px 10px 15px;
  border-radius: 15px;
}

.tag i {
  font-size: 14px;
}

.name {
  color: white;
  font-size: 14px;
  margin: 10px 0;
}

.desc {
  color: rgba(255, 255, 255, 0.5);
  /* 字体直接写小于12没有效果 */
  font-size: 12px;
  transform: scale(0.9, 0.9);
}
.musicListNavBar {
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}
.page {
  width: 100%;
  text-align: center;
  padding-bottom: 60px;
}
</style>