<template>
  <div class="img-container">
    <img :src="qrCodeImg" />
  </div>
</template>

<script>
import {
  getQrCodeKey,
  getQrCode,
  checkQrCode,
  getAccountInfo,
} from "../../servers";
import { getTimeStamp } from "@/plugins/utils";

export default {
  name: "qrCodeLogin",
  data() {
    return {
      key: "", //二维码key
      qrCodeImg: "",
      timer: null,
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      await this.getQrCodeKey();
      await this.getQrCode();
      await this.checkQrCode();
    },

    async getQrCodeKey() {
      const res = await getQrCodeKey({ timestamp: getTimeStamp() });
      // console.log(res);
      this.key = res.data.data.unikey;
    },

    async getQrCode() {
      const res = await getQrCode({
        key: this.key,
        qrimg: true,
        timestamp: getTimeStamp(),
      });
      this.qrCodeImg = res.data.data.qrimg;
    },

    //800 为二维码过期,
    //801 为等待扫码,
    //802 为待确认,
    //803 为授权登录成功(803 状态码下会返回 cookie)
    async checkQrCode() {
      this.timer = setInterval(async () => {
        // 定时器已被清空或已处于登录状态 则不向下执行
        if (!this.timer || this.$store.state.isLogin) return;

        const res = await checkQrCode({
          key: this.key,
          timestamp: getTimeStamp(),
        });

        if (res.data.code === 800) {
          // 二维码过期
          this.clearChecker();
          this.init();
        } else if (res.data.code === 803) {
          // 授权成功
          this.clearChecker();
          this.getAccountInfo();
        }
      }, 2000);
    },

    async getAccountInfo() {
      const res = await getAccountInfo();
      if (res.data.code == 200) {
        window.localStorage.setItem("userId", res.data.profile.userId);
        this.$emit("getUserInfo", res.data.profile);
        this.$message.success("登录成功!");
        this.$store.commit("updataLoginState", true);
      }
    },

    clearChecker() {
      clearInterval(this.timer);
      this.timer = null;
    },
  },
  beforeDestroy() {
    this.clearChecker();
  },
};
</script>

<style lang="less" scoped>
.img-container {
  text-align: center;

  img {
    height: 120px;
  }
}
</style>
