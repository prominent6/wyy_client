<template>
  <div class="musicDetailCard" :class="isMusicDetailCardShow ? '' : 'hide'">
    <TopNav :isImage="false" />
    <div class="closeCard" @click="closeCard">
      <svg class="icon black" aria-hidden="true">
        <use xlink:href="#icon-xiajiantou"></use>
      </svg>
    </div>
    <div class="musicDetailCardContainer" v-if="musicInfo.name">
      <div class="top">
        <div class="left">
          <div class="discContainer">
            <div
              class="needle"
              :class="$store.state.isPlay ? 'needleRotate' : ''"
              ref="needle"
            >
              <img src="~assets/img/MusicDetailCard/needle.png" alt="" />
            </div>
            <div
              class="disc"
              :class="[
                $store.state.isPlay ? '' : 'pause',
                $store.state.isMusicLoad ? '' : 'discAnimation',
              ]"
              ref="disc"
            >
              <img src="~assets/img/MusicDetailCard/disc.png" alt="" />
              <img
                src="~assets/img/test.jpg"
                alt=""
                class="musicAvatar"
                v-if="!musicInfo.al"
              />
              <img
                :src="musicInfo.al.picUrl"
                alt=""
                class="musicAvatar"
                v-else
              />
            </div>
          </div>
        </div>
        <div class="right">
          <div class="title">
            <div class="musicName">{{ musicInfo.name }}</div>
            <div class="album">
              {{ musicInfo.al.name }}
            </div>
            <div class="singer">
              {{ musicInfo.ar[0].name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="tip">暂无播放音乐</div>
  </div>
</template>

<script>
import TopNav from "components/topnav/TopNav.vue";

export default {
  name: "MusicDetailCard",
  components: {
    TopNav,
  },
  data() {
    return {
      isMusicDetailCardShow: false, // 是否显示歌曲详情卡片
      musicInfo: {},
    };
  },
  methods: {
    closeCard() {
      this.$store.commit("changeMusicDetailCardState");
    },
  },
  watch: {
    "$store.state.isMusicDetailCardShow"(isMusicDetailCardShow) {
      // console.log(this.isMusicDetailCardShow);
      this.isMusicDetailCardShow = isMusicDetailCardShow;
    },
    "$store.state.musicId"(musicId) {
      // 更新当前歌曲信息
      this.musicInfo =
        this.$store.state.musicList[this.$store.state.currentIndex];
      console.log(musicInfo);
    },
  },
};
</script>

<style scoped lang="less">
.black {
  fill: black;
  font-size: 25px;
}
.hide {
  display: none;
}
.musicDetailCard {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background-color: white;
  background-image: linear-gradient(to bottom, #e3e2e3, white);
}
.closeCard .icon {
  position: absolute;
  top: 15px;
  left: 35px;
  font-size: 21px !important;
  cursor: pointer;
}
.musicDetailCardContainer {
  height: 100%;
  overflow-y: scroll;
}

.top {
  display: flex;
  justify-content: center;
  width: 100%;
}

.left {
  // width: 220px;
  margin: 0 30px 0 -40px;
}

.discContainer {
  margin-top: 60px;
  // width: 220px;
  position: relative;
}

.needle {
  position: relative;
  left: 50%;
  width: 88px;
  height: 72px;
  z-index: 10000;
  transition: all 1s;
  transform-origin: 5.3px 5.3px;
}

.needle img {
  width: 100%;
}
.needleRotate {
  transform-origin: 5.3px 5.3px;
  transform: rotate(22deg);
}

.disc {
  width: 220px;
  height: 220px;
  position: relative;
  top: -12px;
}

.disc img:nth-child(1) {
  width: 100%;
}

.disc .musicAvatar {
  position: absolute;
  top: 35px;
  left: 35px;
  width: 150px;
  z-index: -1;
}
/* 碟子设置旋转动画 */
.discAnimation {
  /* infinite动画无限循环 */
  animation: disc 25s linear infinite;
  /* 动画延迟一秒 */
  animation-delay: 0.8s;
}
@keyframes disc {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.pause {
  animation-play-state: paused;
  -webkit-animation-play-state: paused;
}
</style>