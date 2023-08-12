<template>
  <el-container>
    <el-header>
      <TopNav :isImage="true" />
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          active-text-color="black"
          router
          :default-active="defaultActive"
        >
          <el-menu-item index="/discover">
            <span slot="title">发现音乐</span>
          </el-menu-item>
          <el-menu-item>
            <span slot="title">播客</span>
          </el-menu-item>
          <el-menu-item index="/video">
            <span slot="title">视频</span>
          </el-menu-item>
          <el-menu-item>
            <span slot="title">关注</span>
          </el-menu-item>
          <el-menu-item>
            <span slot="title">直播</span>
          </el-menu-item>
          <el-menu-item>
            <span slot="title">私人FM</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view class="routerView"></router-view>
      </el-main>
    </el-container>

    <Footer></Footer>
    <!-- 底部歌曲详情页 -->
    <MusicDetailCard class="musicDetailCard"></MusicDetailCard>
  </el-container>
</template>

<script>
import TopNav from "@/components/topnav/TopNav.vue";
import Footer from "@/components/footer/Footer.vue";
import MusicDetailCard from "views/footer/MusicDetailCard.vue";

export default {
  components: {
    TopNav,
    Footer,
    MusicDetailCard,
  },
  data() {
    return {
      defaultActive: "",
    };
  },
  created() {
    // if (this.$route.path.search("/musiclistdetail") == -1) {
    this.defaultActive = "/" + this.$route.path.split("/")[1];
    // } else {
    // this.defaultActive = this.$route.path;
    // }
  },
  watch: {
    "$router.path"(current) {
      // if (current.search("/musiclistdetail" == -1)) {
      this.defaultActive = "/" + current.split("/")[1];
      // } else {
      // this.defaultActive = current;
      // }
    },
  },
};
</script>

<style scoped>
.is-active {
  background-color: #f6f6f7;
  font-size: 14px;
  font-weight: 600;
}
/* 头部 */
.el-header {
  background-color: #ec4141;
  padding: 0;
  margin: 0;
  z-index: 100;
}
/* 侧边栏 */
.el-aside {
  border-right: 1px solid #ccc;
  height: calc(80vh - 105px);
}

.el-menu {
  border: none;
}
.el-menu-item:hover {
  background-color: #f5f5f6 !important;
}

.el-menu-item {
  font-size: 15px;
  padding: 0 0 0 10px !important;
  margin: 5px 0 !important;
  height: 30px;
  line-height: 30px;
}
</style>