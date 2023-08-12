<template>
  <div class="rankingContainer">排行榜页面</div>
</template>

<script>
export default {
  name: "Ranking",
  data() {
    return {
      officialListDetail: [],
      officialList: [],
      globalList: [],
    };
  },
  methods: {
    async getAllRankings() {
      let res = await this.$request("/toplist");
      // console.log(res);
      this.officialList = res.data.list.slice(0, 4);
      // console.log(this.officialList);
      this.globalList = res.data.list.slice(4);
      // console.log(this.globalList);
    },
  },
  created() {
    this.getAllRankings();
  },
};
</script>

<style>
</style>