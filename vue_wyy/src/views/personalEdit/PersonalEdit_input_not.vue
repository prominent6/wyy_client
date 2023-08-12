<template>
  <div class="personaledit">
    <div class="all">
      <h2>编辑个人信息</h2>
      <div class="center">
        <div class="left">
          <div class="item">
            <span>昵称: </span>
            <el-input v-model="userInfo.nickname" />
          </div>
          <div class="item">
            <span>介绍: </span>
            <el-input
              v-model="userInfo.signature"
              :rows="2"
              type="textarea"
              maxlength="288"
              :show-word-limit="true"
              resize="none"
            />
          </div>
          <div class="item">
            <span>性别: </span>
            <el-radio-group v-model="userInfo.gender">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </div>
          <div class="item">
            <span>生日: </span>
            <el-date-picker
              v-model="userInfo.birthday"
              type="date" 
              format="yyyy-MM-dd"
              value-format="timestamp"
            />
            </el-date-picker>
          </div>
          <div class="item">
            <span>地区id: </span>
            <el-select v-model="userInfo.province" placeholder="请选择省份">
              <el-option
                v-for="item in areaList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="userInfo.city" placeholder="请选择城市" >
              <el-option
                v-for="item in areaList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <!-- <el-input v-model="userInfo.address" /> -->
            <!-- <el-cascader
              v-model="value"
              :options="options"
              @change="handleChange"
            ></el-cascader> -->
          </div>
          <div class="save-canle">
            <button class="user-btn save-btn" @click="handelSave">保存</button>
            <button class="user-btn" @click="handelCanle">取消</button>
          </div>
        </div>
        <div class="right">
          <div class="img">
            <img
              :src="userInfo.avatarUrl + '?param=400y400'"
              alt="avatar"
              class="avatar"
            />
            <!-- <img :src="userInfo.avarUrl" alt="404" /> -->
          </div>
          <button class="user-btn" @click="handelAvatar">修改头像</button>
          <input
            type="file"
            name="avatar"
            accept="image/gif,image/jpeg,image/jpg,image/png"
            style="display: none"
            @change="changeImage"
            ref="avatarInput" id="update_img"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  // const avatarInput = ref(),
  data() {
    return {
      // 用户信息
      userInfo: {},
      areaList: [], //全部省份数据
      cookie: localStorage.getItem("cookie"),
      // avatarInput: {},
    };
  },
  methods: {
    handelCanle() {
      router.back();
    },
    // 获取用户信息
    async getUserInfo() {
      let res = await this.$request(
        `/user/detail?uid=${this.$route.params.uid}`
      );
      if (!res) {
        this.$message.error("获取用户信息失败!");
        return;
      }
      console.log(res);
      // res.data.profile["level"] = res.data.level;
      // res.data.profile["address"] =
      //   String(res.data.profile.province) + " " + String(res.data.profile.city);
      res.data.profile.birthday = String(res.data.profile.birthday);
      this.userInfo = res.data.profile;
      // console.log(this.userInfo.address);
    },

    //更新头像 报404
    upAvatar(file) {
      var formData = new FormData();
      formData.append("imgFile", file);
      // console.log(formData);
      // this.updateAvatar(formData);
      axios
        .post("http://localhost:3000/avatar/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res);
        });
    },

    // changeImage
    changeImage(e) {
      // console.log(e);
      const file = e.target.files[0]; //得到图片地址
      // console.log(file);
      this.upAvatar(file);
    },

    handelAvatar() {
      document.getElementById("update_img").click(); //dom节点
    },

    //更新用户信息
    async updateUserInfo(obj) {
      let res = await this.$request("/user/update", obj);
      if (res.code === 200) {
        Message("修改成功", "success");
      }
      this.getUserInfo();
    },
    // 保存更改
    handelSave() {
      const { gender, birthday, nickname, signature, province, city, address } =
        this.userInfo;
      const obj = {
        gender,
        birthday,
        nickname,
        signature,
        province,
        city,
      };
      this.updateUserInfo(obj);
    },
  },
  async created() {
    await this.getUserInfo();
  },
};
</script>
<style scoped lang="less">
.el-input__inner {
  background: #fff !important;
}
.personaledit {
  width: 100%;
  display: flex;
  .all {
    width: 95%;
    // border-radius: 10px;
    // border: 2px solid #ebebeb;
    // box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    padding: 15px;
    // margin-bottom: 90px;
  }
  h2 {
    text-align: start;
    color: #333;
    margin: 5px 0px 40px;
  }
  .center {
    display: flex;
    .left {
      margin-right: 40px;
      // width: 620px;
      width: 85%;
      > div {
        margin-bottom: 10px;
        &.item {
          display: flex;
          align-items: center;
        }
        span {
          margin-right: 10px;
          display: inline-block;
          width: 66px;
        }
        &.save-canle {
          text-align: center;
        }
      }
    }
    .right {
      text-align: center;
      .img img {
        width: 150px;
        height: 150px;
        border: 1px solid #eee;
      }
    }
    button.user-btn {
      background: #fff;
      color: #333;
      border: 1px solid #ebebeb;
      padding: 8px 20px;
      font-size: 12px;
      border-radius: 20px;
      cursor: pointer;
      margin-top: 20px;
    }
    button.save-btn {
      background-color: #e13e3e;
    }
  }
}
</style>
