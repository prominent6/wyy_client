<template>
  <div class="listCard">
    <div
      class="listCardItem"
      v-for="(item, index) in listCardData"
      :key="index"
      @click="clickListCardItem(item.id)"
    >
      <div class="image">
        <img
          :src="(item.picUrl || item.coverImgUrl) + '?param=400y400'"
          alt="gedan"
        />
        <div class="title">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ListCard",
  props: {
    listCardData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    clickListCardItem(id) {
      this.$emit("clickListCardItem", id);
    },
  },
};
</script>

<style>
.listCard {
  display: flex;
  flex-wrap: wrap;
  margin: 10px 0;
}
.listCardItem {
  width: 18.4%;
  margin: 0 2% 20px 0;
  overflow: hidden;
  cursor: pointer;
}
.listCardItem:nth-child(5n) {
  margin-right: 0;
}

.image img {
  width: 100%;
  border-radius: 10px;
}

.title {
  margin-top: 8px;
  padding: 0 2px;
  font-size: 12px;
  color: black;
  line-height: 17px;
  /* 两行溢出 */
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>