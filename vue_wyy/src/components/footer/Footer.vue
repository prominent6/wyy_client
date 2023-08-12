<template>
  <div class="footer">
    <audio :src="musicUrl" ref="audioPlayer" autoplay @timeupdate="timeupdate"  @play="changeState(true)"
      @pause="changeState(false)" @ended="changeMusic('next')"></audio>
    <div class="footer_left">
      <div class="avatar" @click="$store.commit('changeMusicDetailCardState')">
        <img :src="musicDetail.al.picUrl" alt="" v-if="musicDetail.al" :draggable="false" />
        <img src="~assets/img/test.jpg" alt="" v-else />
      </div>
      <div class="musicInfo">
        <div class="musicName name" v-if="musicDetail && musicDetail.name">
          {{ musicDetail.name }}
          <span>
            <svg
              class="icon"
              aria-hidden="true"
              :class="isUserLikeCurrentMusic ? 'like' : ''"
            >
              <use xlink:href="#icon-aixin"></use>
            </svg>
          </span>
        </div>
        <div
          class="singerName name"
          v-if="musicDetail && musicDetail.name"
         
        >
          {{ musicDetail.ar[0].name }}
        </div>
      </div>
    </div>
     <!-- 中间 -->
    <div class="footer_center">
      <div class="footer_buttons">
        <span @click="playType = playType == 'order' ? 'random' : 'order'"
          ><svg class="icon" aria-hidden="true" v-if="playType == 'order'">
            <use xlink:href="#icon-xunhuan"></use>
          </svg> <svg class="icon" aria-hidden="true" v-else>
            <use xlink:href="#icon-suijibofang"></use>
          </svg></i
        ></span>

        <!-- 上一首 -->
        <span @click="musicList.length != 0 ? changeMusic('pre') : ''"
          ><svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shangyishoushangyige"></use>
          </svg></span>

 <!-- 播放/暂停 -->
        <span @click="musicList.length != 0 ? changePlayState() : ''">
          <svg class="icon" aria-hidden="true" v-if="!this.$store.state.isPlay">
            <use xlink:href="#icon-bofang1"></use>
          </svg>
          <svg class="icon" aria-hidden="true" v-else>
            <use xlink:href="#icon-bofangzhong "></use>
          </svg>
        </span>
<!-- 下一首 -->
        <span @click="musicList.length != 0 ? changeMusic('next') : ''"
          ><svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-xiayigexiayishou"></use></svg
        ></span>
      </div>
      <!-- 进度条 -->
      <div class="progressBar">
        <span class="currentTime">{{ currentTime | handleMusicTime }}</span>
        <el-slider
          class="progressSlider"
          v-model="timeProgress"
          :show-tooltip="false"
          @change="changeProgress"
          :disabled="musicList.length == 0"
        ></el-slider>
        <span class="totalTime">{{ duration }}</span>
      </div>
    </div>
      <!-- 右边 -->
    <div class="footer_right">
      <div class="volumeControl">
         <svg class="icon" aria-hidden="true" v-if="volume!=0" @click="changeMutedState">
          <use xlink:href="#icon-24gl-volumeMiddle"></use>
        </svg>
        <svg class="icon" aria-hidden="true" @click="changeMutedState" v-else>
          <use xlink:href="#icon-caozuo-jingyin"></use>
        </svg>
        
        <el-slider
          class="volumeSlider"
          v-model="volume"
          @input="changeVolume"
          :show-tooltip="false"
        ></el-slider>
      </div>
     <div class="playList"  @click="openDrawer">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-24gl-playlist"></use>
        </svg>
      </div>
    </div>

    <el-drawer :visible.sync="drawer" :with-header="false" width="300">
      <div class="drawerHeader">总{{ musicList.length }}首</div>
      <el-table
        :data="musicList"
        stripe
        style="width: 100%"
        :show-header="false"
        
        highlight-current-row
        lazy
      >
        <el-table-column prop="name" width="150px"> </el-table-column>
        <el-table-column prop="ar[0].name" width="80px"> </el-table-column>
        <el-table-column prop="dt" width="70px"> </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script>
import { handleMusicTime, returnSecond } from "plugins/utils";
let lastSecond = 0;
let durationNum = 0;
let volumeSave = 0;

export default {
  name: "Footer",
  data() {
    return {
      musicDetail: {},
      musicUrl: "",
      musicList: [],
      currentMusicIndex: 0,
      playType: "order", // 播放模式（顺序播放，随机播放）

      currentTime: 0,
      timeProgress: 0,
      duration: "00:00",

      volume: 30,
      isMuted: false,
      drawer: false,
      hasDrawerOpend: false,
    };
  },
  methods: {
    changeState(state) {
      this.$store.commit("changePlayState", state);
    },
    async getMusicUrl(id) {
      this.$store.commit("updateMusicLoadState", true);

      let result = await this.$request("/song/url", { id });

      if (result.data.data[0].url == null) {
        this.$message.error("该歌曲暂无版权，将为您播放下一首歌曲");
        this.changeMusic("next");
        return;
      }
      this.musicUrl = result.data.data[0].url;
      this.$store.commit("updateMusicLoadState", false);
    },
    getMusicDetail() {
      let index = this.musicList.findIndex(
        (item) => item.id == this.$router.musicId
      );
      if (index != -1) {
        this.currentMusicIndex = index;
      } else {
        this.currentMusicIndex = 0;
      }
      // console.log(index);
      // if (index != -1) {
      this.$store.commit("updateCurrentIndex", index);
      this.musicDetail = this.musicList[index];
      this.duration = this.musicList[index].dt;
      console.log(duration);
      // }
    },
    changePlayState() {
      !this.$store.state.isPlay ? this.playMusic() : this.pauseMusic();
    },
    // 播放音乐的函数
    playMusic() {
      this.$refs.audioPlayer.play();
    },
    // 暂停音乐的函数
    pauseMusic() {
      this.$refs.audioPlayer.pause();
    },
    changeMusic(type, id) {
      if (type == "next") {
        let currentMusicIndex = this.currentMusicIndex;
        let nextIndex;
        if (this.playType == "order") {
          nextIndex =
            currentMusicIndex + 1 == this.musicList.length
              ? 0
              : currentMusicIndex + 1;
        } else if (this.playType == "random") {
          if (this.musicList.length == 1) {
            nextIndex = currentMusicIndex;
          } else {
            // Math.floor(Math.random()*10); 可均衡获取0到9的随机整数。
            nextIndex = currentMusicIndex;
            while (nextIndex == currentMusicIndex) {
              nextIndex = Math.floor(Math.random() * this.musicList.length);
            }
            this.$store.commit("updateMusicId", this.musicList[nextIndex].id);
          }
        }
        this.$store.commit("updateMusicId", this.musicList[nextIndex].id);
      } else if (type == "pre") {
        let currentMusicIndex = this.currentMusicIndex;
        let preIndex;
        if (this.playType == "order") {
          preIndex =
            currentMusicIndex - 1 < 0
              ? this.musicList.length - 1
              : currentMusicIndex + 1;
        } else if (this.playType == "random") {
          if (this.musicList.length == 1) {
            preIndex = currentMusicIndex;
          } else {
            // Math.floor(Math.random()*10); 可均衡获取0到9的随机整数。
            preIndex = currentMusicIndex;
            while (preIndex == currentMusicIndex) {
              preIndex = Math.floor(Math.random() * this.musicList.length);
            }
          }
        }
        this.$store.commit("updateMusicId", this.musicList[preIndex].id);
      }
    },
    timeupdate() {
      let time = this.$refs.audioPlayer.currentTime;
      this.$store.commit("updateCurrentTime", time);
      if (time != lastSecond) {
        lastSecond = time;
        this.currentTime = time;
        this.timeProgress = Math.floor((time / durationNum) * 100);
      }
    },
    changeProgress(e) {
      this.currentTime = Math.floor((e / 100) * durationNum);
      this.$refs.audioPlayer.currentTime = this.currentTime;
    },
    changeMutedState() {
      if (this.isMuted) {
        this.volume = volumeSave;
      } else {
        volumeSave = this.volume;
        this.volume = 0;
      }
      console.log(volumeSave, this.isMuted);
      this.isMuted = !this.isMuted;
    },
    changeVolume(e) {
      this.$refs.audioPlayer.volume = e / 100;
      if (this.isMuted && e > 0) {
        this.isMuted = false;
      } else if (e == 0 && this.isMuted == false) {
        this.isMuted = true;
      }
    },
    openDrawer() {
      this.drawer = !this.drawer;
      this.hasDrawerOpend = true;
    },
  },
  watch: {
    "$store.state.musicId"(id) {
      this.musicList = this.$store.state.musicList;
      this.getMusicDetail();
      this.getMusicUrl(id);
      durationNum = returnSecond(this.duration);
    },
  },
  filters: {
    handleMusicTime,
  },
};
</script>

<style scoped>
.like {
  color: #ec4141 !important;
}
.icon {
  fill: rgb(89, 89, 89);
  font-size: 20px;
  cursor: pointer;
}

.footer {
  border-top: 1px solid #ddd;
  width: 100%;
  height: 72px;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  padding: 6px 10px;
  z-index: 10000;
  background-color: #fff;
}

.footer_left {
  display: flex;
  align-items: center;
  /* width: 123px; */
}

.footer_left .avatar {
  width: 48px;
  height: 48px;
  border-radius: 5px;
  overflow: hidden;
  margin-right: 10px;
  cursor: pointer;
}

.footer_left .avatar img {
  width: 100%;
}

/* 左边歌曲信息部分 */
.musicInfo {
  color: rgb(37, 37, 37);
  font-size: 12px;
}
.musicName {
  /* text-align: center; */
}
.singerName {
  transform: scale(0.9);
  margin-left: -3px;
}

.musicInfo .name {
  width: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

/* 中间部分 */
.footer_center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.footer_buttons {
  display: flex;
  align-items: center;
  height: 12px;
}

.footer_buttons .icon {
  font-size: 25px;
  color: #313131;
}
.footer_buttons span {
  display: inline-block;
  width: 50px;
  box-sizing: border-box;
  text-align: center;
}

.footer_buttons span:nth-child(3) .icon {
  font-size: 35px;
}

.progressSlider {
  width: 300px;
}

.progressBar {
  display: flex;
  align-items: center;
}
.progressBar {
  height: 10px;
  margin-top: 12px;
  overflow: hidden;
}

.currentTime,
.totalTime {
  font-size: 12px;
  transform: scale(0.85);
  color: #aaa;
  margin: 0 5px;
  width: 30px;
  text-align: center;
}

/* 右边 */
.footer_right {
  display: flex;
  align-items: center;
  position: relative;
}

.volumeControl {
  display: flex;
  align-items: center;
  margin-right: 15px;
}
.volumeControl .icon {
  font-size: 18px;
  margin-right: 10px;
}

.volumeSlider {
  width: 55px;
}

.drawerHeader {
  font-size: 12px;
  transform: scale(0.9);
  color: #aaa;
  padding: 15px 0;
}
</style>