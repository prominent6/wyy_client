<template>
  <div class="recommendContainer">
    <div class="recommend">
      <!-- 轮播图 -->
      <div class="carousel">
        <el-carousel height="180px" :interval="2000" type="card">
          <el-carousel-item v-for="(item, index) in bannerData" :key="index">
            <img :src="item.pic" alt="lunbotu"
          /></el-carousel-item>
        </el-carousel>
      </div>
      <!-- 推荐歌单 -->
      <div class="recommendMusicList">
        <h3>
          推荐歌单
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-xiangyoujiantou"></use>
          </svg>
        </h3>
        <ListCard
          :listCardData="musicList"
          @clickListCardItem="clickListCardItem"
        ></ListCard>
      </div>
    </div>
  </div>
</template>

<script>
import ListCard from "@/components/show/ListCard.vue";

export default {
  name: "Recommend",
  components: {
    ListCard,
  },
  data() {
    return {
      bannerData: [], // 轮播图数据
      musicList: [], // 推荐歌单数据
    };
  },
  methods: {
    // 请求轮播图数据
    async getBannerData() {
      let result = await this.$request("/banner?type=2");
      console.log(result.data.banners);
      this.bannerData = result.data.banners;
    },
    // 请求推荐歌单数据的前十个
    async getMusicList() {
      let res = await this.$request("/personalized?limit=10");
      this.musicList = res.data.result;
    },
    // 点击歌单的回调
    clickListCardItem(id) {
      // console.log(id);
      this.$router.push({ name: "musicListDetail", params: { id } });
    },
  },
  created() {
    this.getBannerData();
    this.getMusicList();
  },
};
</script>

<style>
.icon {
  fill: #373737;
}
.carousel {
  width: 100%;
}
.el-carousel {
  margin: auto;
}
.el-carousel__item {
  border-radius: 10px;
}

.el-carousel__item img {
  height: 100%;
  width: 100%;
}
.recommendMusicList {
  margin: 20px 10px;
}
.recommendMusicList h3 {
  color: #373737;
}
</style>