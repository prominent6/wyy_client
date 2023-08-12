<template>
  <div class="personalChild">
    111
    <!-- <NavBar :navBarItem="navBarData" @clickBarItem="clickBarItem"></NavBar>
    <router-view class="personal_child"></router-view> -->
  </div>
</template>

<script>
export default {
  name: "personalChild",
  data() {
    return {
      navBarData: [
        {
          name: "创建的歌单",
          path: "/personal/personalChild/createS",
        },
        { name: "收藏的歌单", path: "/personal/personalChild/collectS" },
        { name: "创建的音乐专栏", path: "/personal/personalChild/createA" },
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

<style>
</style>