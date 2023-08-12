<template>
  <div class="personaledit">
    <div class="all">
      <h2>编辑个人信息</h2>
      <div class="center">
        <div class="left">
          <div class="item">
            <span>昵称: </span>
            <el-form :rules="rules" :model="userInfo" >
              <el-form-item prop="nickname">
                <el-input v-model="userInfo.nickname"></el-input>
              </el-form-item>
            </el-form>
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
         <el-upload
          :action="uploadUrl" :headers="{ 'Content-Type': 'multipart/form-data' }"
          :limit="1"  :http-request="upAvatar" :show-file-list="false" 
          >
          <button class="user-btn">修改头像</button>
         </el-upload>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { Loading } from "element-ui";
export default {
  data() {
    //编辑昵称检测
    var checkNickname = async (rule, value, callback) => {
      //如果为空
      if (!value) {
        return callback(new Error("请输入昵称"));
      }
      if (value == JSON.parse(this.originUserInfo).nickname) {
        return callback();
      }
      // var pattern = /^[A-Za-z0-9_-]+$/;
      // var pattern = /^[a-zA-Z0-9-_]*$/;
      var pattern = /^[a-zA-Z0-9-_]+$/;
      // console.log(value.length);
      console.log(pattern.test(value)); //找不到合适的正则表达式

      //重复昵称检测
      await this.$request(`/nickname/check?nickname=${value}`).then((res) => {
        console.log(res);
        if (res.data.nickname == this.originUserInfo.nickname) {
          return callback();
        }
        if (res.data.duplicated)
          return callback(new Error("该昵称已经被占用!"));
      });

      //昵称格式判断
      if (value.length < 4 || value.length > 30 || pattern.test(value)) {
        return callback(
          new Error("昵称为4-30个字，且不包含除-和_以外的特殊字符")
        );
      }

      callback();
    };
    return {
      // 用户信息
      userInfo: {
        nickname: "",
      },
      areaList: [], //全部省份数据
      uploadUrl: `http://localhost:3000/avatar/upload`, //修改头像上传的地址
      originUserInfo: "", //登录用户的信息
      // avatarInput: {},
      rules: {
        nickname: [{ validator: checkNickname, trigger: "blur" }],
      },
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
      this.originUserInfo = JSON.stringify(this.userInfo);
    },

    //获取图片大小
    //imgSize.width undefined 两个箭头函数嵌套影响this
    async getImgSize(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        // reader.onload = (theFile) => {
        reader.onload = function (theFile) {
          let image = new Image();
          image.src = theFile.target.result;
          // image.onload = () => {
          image.onload = function () {
            resolve({
              width: this.width,
              height: this.height,
            });
          };
        };
      });
    },

    //更新头像
    async upAvatar(f) {
      // console.log(file);
      let load = Loading.service({
        text: "头像更新中",
        target: ".personaledit",
      });
      let file = f.file;
      const imgSize = await this.getImgSize(file);
      let formData = new FormData();
      formData.append("imgFile", file);
      console.log(imgSize.width);
      // console.log(formData);
      axios
        .post(
          `http://localhost:3000/avatar/upload?imgSize=${imgSize.width}`,
          formData,

          {
            params: {
              timestamp: Date.now(),
              cookie: localStorage.getItem("cookie"),
            },
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          load.close();
          // console.log(res);
          if (res.data.code === 200) {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.userInfo.avatarUrl = res.data.data.url;
          } else {
            this.$message({
              message: "修改失败",
              type: "error",
            });
          }
        });
    },

    //更新用户信息
    async updateUserInfo(obj) {
      let res = await this.$request("/user/update", obj);
      if (res.code === 200) {
        this.$message({
          message: "修改成功",
          type: "success",
        });
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
