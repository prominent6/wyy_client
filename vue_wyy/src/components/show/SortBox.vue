<template>
  <div class="SortBoxContainer">
    <el-popover
      placement="bottom-start"
      width="350"
      popper-class="sortPop"
      trigger="click"
      v-model="isSortPopShow"
      @show="showSortPop"
    >
      <div class="SortBox" slot="reference">
        {{ currentTag.name
        }}<svg class="icon black" aria-hidden="true">
          <use xlink:href="#icon-xiangyoujiantou"></use>
        </svg>
      </div>
      <!-- 提示 -->
      <div class="tips" v-if="sortList.length == 0">正在加载分类数据...</div>
      <!-- 展示 -->
      <div class="sortList" v-else>
        <div
          class="tagItem"
          :class="currentTag.name == item.name ? 'currentItem' : ''"
          v-for="(item, index) in sortList"
          :key="index"
          @click="clickItem(item)"
        >
          {{ item.name }}
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: "SortBox",
  data() {
    return {
      isSortPopShow: false, // 是否显示分类选择框
    };
  },
  props: {
    currentTag: {
      type: Object,
      default() {
        return {};
      },
    },
    sortList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    // pop框展示时的回调
    showSortPop() {
      // 判断是否有sortList数据
      if (this.sortList.length == 0) {
        this.$emit("getSortList");
      }
    },
    // 点击分类item的回调
    clickItem(item) {
      this.$emit("clickSortBoxItem", item);
      this.isSortPopShow = false;
    },
  },
};
</script>

<style>
.black {
  fill: black;
  margin-left: 5px;
}
.SortBox {
  padding: 8px 18px;
  border: 1px solid #ddd;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
}

.tips {
  width: 100%;
  text-align: center;
  font-size: 15px;
  padding: 20px 0;
  color: rgb(145, 145, 145);
}

.sortList {
  display: flex;
  flex-wrap: wrap;
}

.tagItem {
  font-size: 15px;
  width: 32%;
  text-align: center;
  color: rgb(85, 85, 85);
  padding: 5px 0;
  margin: 5px 0;
  cursor: pointer;
  border-radius: 30px;
  transform: scale(0.9);
}

.currentItem {
  color: #eb4f4f;
  background-color: #fcebeb;
}
</style>