<template>
  <div class="navBar">
    <div
      class="barItem"
      :class="index == activeNum ? 'active' : ''"
      v-for="(item, index) in SecondNavBarData"
      :key="index"
      @click="clickSecondBarItem(index)"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<script>
export default {
  name: "SecondNavBar",
  data() {
    return {
      activeNum: 0,
    };
  },
  props: {
    SecondNavBarData: {
      type: Array,
      default() {
        return [];
      },
    },
    currentTag: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    clickSecondBarItem(index) {
      if (this.activeNum == index) return;
      this.activeNum = index;
      this.$emit("clickSecondBarItem", index);
    },
  },
  watch: {
    currentTag(current) {
      this.activeNum = this.SecondNavBarData.findIndex(
        (item) => item.name == current.name
      );
    },
  },
};
</script>

<style scoped>
.navBar {
  display: flex;
  flex-wrap: wrap;
}

.barItem {
  padding: 6px 10px;
  font-size: 14px;
  /* width: 40px; */
  text-align: center;
  box-sizing: content-box;
  transform: scale(0.9, 0.9);
  cursor: pointer;
}

.active {
  background-color: #fdf5f5;
  color: #ec4747;
  border-radius: 11px;
}
</style>