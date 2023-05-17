<template>
  <div class="discoverContainer">
    <NavBar @clickBarItem="clickBarItem" :navBarItem="navBarData"></NavBar>

    <!-- 放其他的 -->
    <router-view class="discover"></router-view>
  </div>
</template>

<script>
import NavBar from "@/components/usual/NavBar";

export default {
  name: "Discover",
  components: {
    NavBar,
  },
  data() {
    return {
      navBarData: [
        { name: "个性推荐", path: "/discover/recommend" },
        { name: "专属订制", path: "/discover/special" },
        { name: "歌单", path: "/discover/musiclist" },
        { name: "排行榜", path: "/discover/ranking" },
        { name: "歌手", path: "/discover/singer" },
        { name: "最新音乐", path: "/discover/newest" },
      ],
    };
  },
  methods: {
    clickBarItem(path) {
      this.$router.push(path);
    },
  },
};
</script>

<style scoped>
.discoverContainer {
  overflow: hidden;
  padding: 0 !important;
}
.discover {
  /* max-width: 1000px; */
  margin: auto;
  overflow: scroll;
  height: 700px;
  padding: 0 15px;
}
</style>