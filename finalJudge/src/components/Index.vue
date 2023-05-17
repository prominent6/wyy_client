<template>
  <el-container>
    <el-header>
      <!-- 头部 -->
      <TopNav :isImage="true" />
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
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
          <!-- <el-menu-item index="/favorites">
            <span slot="title">收藏</span>
          </el-menu-item>
          <el-menu-item index="/recommendmusic">
            <span slot="title">每日推荐</span>
          </el-menu-item>
          <el-menu-item-group v-if="createdMusicList.length != 0">
            <template slot="title" class="groupTitle">创建的歌单</template>
            <el-menu-item
              v-for="(item, index) in createdMusicList"
              :key="index"
              :index="'/musiclistdetail/' + item.id"
            >
              <i class="iconfont icon-gedan"></i>{{ item.name }}</el-menu-item
            >
          </el-menu-item-group>

          <el-menu-item-group v-if="collectedMusicList.length != 0">
            <template slot="title" class="groupTitle">收藏的歌单</template>
            <el-menu-item
              v-for="(item, index) in collectedMusicList"
              :key="index"
              :index="'/musiclistdetail/' + item.id"
            >
              <i class="iconfont icon-gedan"></i>{{ item.name }}</el-menu-item
            >
          </el-menu-item-group> -->
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 推荐页面 -->
        <router-view class="routerView" :key="$route.fullPath"></router-view>
      </el-main>
    </el-container>

    <!-- 底部组件 -->
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
      defaultActive: "", //激活样式
    };
  },
  created() {
    if (this.$route.path.search("/musiclistdetail") == -1) {
      this.defaultActive = "/" + this.$route.path.split("/")[1];
    } else {
      this.defaultActive = this.$route.path;
    }
  },
  watch: {
    "$router.path"(current) {
      if (current.search("/musiclistdetail" == -1)) {
        this.defaultActive = "/" + current.split("/")[1];
      } else {
        this.defaultActive = current;
      }
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

element.style {
  height: 66px;
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

/* 主要内容 */
.el-main {
  padding: 0;
}
</style>