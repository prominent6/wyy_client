<template>
  <div class="video">
    <NavBar @clickBarItem="clickBarItem" :navBarItem="navBarData"></NavBar>
    <router-view class="videoList"></router-view>
  </div>
</template>

<script>
import NavBar from "components/usual/NavBar.vue";
export default {
  name: "Video",
  components: { NavBar },
  data() {
    return {
      navBarData: [
        { name: "视频", path: "/video/videolist" },
        { name: "MV", path: "/video/mvlist" },
      ],
    };
  },
  methods: {
    // 接收navbar传来的点击事件
    clickBarItem(path) {
      this.$router.push(path);
    },
  },
};
</script>

<style scoped>
.video {
  overflow-y: hidden;
  padding: 0 !important;
}
</style>