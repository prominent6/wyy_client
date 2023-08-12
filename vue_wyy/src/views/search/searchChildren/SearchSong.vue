<template>
  <div class="SearchSong">
    <div class="tip">找到 {{ songCount }} 首单曲</div>
    <el-table
      :data="searchSongList"
      size="medium"
      style="width: 100%"
      highlight-current-row
      stripe
      @row-dblclick="clickRow"
    >
      <el-table-column label="" width="30" type="index" :index="handleIndex">
      </el-table-column>
      <el-table-column label="" width="59">
        <svg class="icon black" aria-hidden="true">
          <use xlink:href="#icon-aixin"></use>
        </svg>
        <svg class="icon black" aria-hidden="true">
          <use xlink:href="#icon-xiazai"></use>
        </svg>
      </el-table-column>
      <el-table-column prop="name" label="音乐标题" min-width="200">
      </el-table-column>
      <el-table-column prop="ar[0].name" label="歌手" min-width="100">
      </el-table-column>
      <el-table-column prop="al.name" label="专辑" min-width="170">
      </el-table-column>
      <el-table-column prop="dt" label="时长" min-width="60"> </el-table-column>
    </el-table>
    <div class="page" v-if="searchSongList.length != 0">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="songCount"
        small
        :page-size="30"
        :current-page="currentPage"
        @current-change="pageChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { handleMusicTime } from "plugins/utils";

export default {
  name: "SearchSong",
  data() {
    return {
      searchSongList: [],
      songCount: 0,
      currentPage: 1,
    };
  },
  methods: {
    // 请求搜索单曲
    async getSearchSong() {
      let res = await this.$request("/cloudsearch", {
        keywords: this.$route.params.id,
        offset: 30 * (this.currentPage - 1),
      });
      //   console.log(res);
      this.songCount = res.data.result.songCount;
      this.searchSongList = res.data.result.songs;
      // 对数据的音乐时长进行处理
      this.searchSongList.forEach((item, index) => {
        this.searchSongList[index].dt = handleMusicTime(item.dt);
      });
    },
    // 处理索引
    handleIndex(index) {
      // console.log(index);
      index = index + 1 + 30 * (this.currentPage - 1);
      if (index < 10) {
        return "0" + index;
      } else {
        return index;
      }
    },
    clickRow(row) {
      // 这里双击应该是要把当前双击的歌曲插入到当前的歌单中
      // 首先获取当前的歌单列表和歌曲索引
      let musicList = this.$store.state.musicList;
      let currentIndex = this.$store.state.currentIndex;
      // 先判断该歌曲是否已经在歌单中存在，避免重复点击导致歌单出现相同歌曲
      let isExist = musicList.find((item) => item.id == row.id);
      if (isExist) {
        // 如果已经存在 则只提交歌曲id并return出去
        this.$store.commit("updateMusicId", row.id);
        return;
      }
      this.$store.commit("changePlayState", false);
      // 将请求到的歌曲详情插入到歌单对应位置并提交至vuex
      musicList.splice(currentIndex + 1, 0, row);
      this.$store.commit("updateMusicId", row.id);
      this.$store.commit("updateMusicList", {
        musicList,
        musicListId: this.$store.state.musicListId,
      });
    },
    //分页
    pageChange(page) {
      this.currentPage = page;
      this.searchSongList = [];
      this.getSearchSong();
    },
  },
  created() {
    this.getSearchSong();
  },
};
</script>

<style scoped>
.black {
  fill: black;
  font-size: 18px;
  margin-right: 5px;
}
.SearchSong {
  padding: 0 15px 40px;
  height: 100%;
}

.tip {
  font-weight: bold;
  color: rgb(34, 34, 34);
  margin-bottom: 10px;
}

.page {
  width: 100%;
  text-align: center;
  padding-bottom: 60px;
  margin: 20px 0;
}
</style>