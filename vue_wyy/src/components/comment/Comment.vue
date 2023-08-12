<template>
  <div class="hotComments">
    <div class="comments" v-if="isHotComment">
      <el-input
        v-model="commentInput"
        type="textarea"
        class="commentArea"
        maxlength="140"
        show-word-limit
      ></el-input>
      <div class="submitCommentButton">
        <el-button
          size="mini"
          round
          class="submitComment"
          @click="submitComment()"
          >评论</el-button
        >
      </div>
    </div>

    <div class="commentHeader"><slot name="title"></slot></div>
    <div class="commentItem" v-for="(item, index) in comments" :key="index">
      <div class="commentCreatorAvatar">
        <img :src="item.user.avatarUrl + '?param=100y100'" alt="yonghu" />
      </div>
      <div class="commentMain">
        <div class="commentContent">
          <span class="commentUserNickName"
            >{{ item.user.nickname }}:&nbsp;</span
          >
          <span>{{ item.content }}</span>
        </div>
        <div class="commentBottom">
          <div class="commentCreatedTime">
            {{ item.time | showDate }}
          </div>
          <div class="commentButtons">
            <div :class="item.liked ? 'likeCurrentComment' : ''">
              <svg class="icon black" aria-hidden="true">
                <use xlink:href="#icon-dianzan"></use></svg
              >{{ item.likedCount }}
            </div>
            <div>
              <svg class="icon black" aria-hidden="true">
                <use xlink:href="#icon-zhuanfaxing"></use>
              </svg>
            </div>
            <div>
              <svg class="icon black" aria-hidden="true">
                <use xlink:href="#icon-pinglun"></use>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from "plugins/utils";

export default {
  name: "Comment",
  data() {
    return {
      commentInput: "", //评论框里的内容
    };
  },
  props: {
    comments: {
      // 评论数据
      type: Array,
      default() {
        return [];
      },
    },
    commentType: {
      // 评论的类型
      type: String,
      default() {
        return "";
      },
    },
    commentId: {
      // 评论对象的id
      type: String,
      default() {
        return "";
      },
    },
    isHotComment: {
      // 是否是热门评论
      type: Boolean,
      default() {
        return true;
      },
    },
  },
  filters: {
    showDate(value) {
      // 1、先将时间戳转成Date对象
      const date = new Date(value);

      // 2、将date进行格式化
      return formatDate(date, "yyyy-MM-dd");
    },
  },
  methods: {
    async submitComment() {
      if (!this.$store.state.isLogin) {
        this.$message.warning("只有登陆后才能评论哦!");
        return;
      }
      if (this.commentInput == "") {
        this.$message.warning("评论内容不能为空哦!");
        return;
      }
      // 判断评论的类型
      let type;
      switch (this.commentType) {
        case "album":
          type = 3;
          break;
        case "musicList":
          type = 2;
          break;
        case "music":
          type = 0;
          break;
        case "mv":
          type = 1;
          break;
        case "video":
          type = 5;
          break;
      }

      let res = await this.$request("/comment", {
        t: 1,
        id: this.commentId,
        type,
        content: this.commentInput,
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });

      if (!res) {
        return;
      }
      if (res.data.code == 200) {
        this.commentInput = "";
        this.$emit("getComment");
      } else {
        this.$message.error("评论失败,请稍后重试!");
      }
    },
  },
};
</script>

<style scoped>
.black {
  fill: black;
  margin-right: 5px;
}
.hotComments {
  margin-bottom: 20px;
  width: 100%;
}

.el-textarea /deep/ .el-textarea__inner {
  height: 65px !important;
  font-size: 12px;
  resize: none;
}

.el-textarea /deep/ .el-textarea__inner:focus {
  border-color: #aaa;
}

.el-textarea /deep/ .el-input__count {
  transform: scale(0.9);
}

.submitCommentButton {
  width: 100%;
  text-align: right;
  margin: 10px 0;
}

.el-button:hover {
  background-color: #f2f2f2;
}

.el-button {
  transform: scale(0.9) translateX(5%);
}

.submitComment:focus {
  background-color: #fff;
}

.commentHeader {
  font-size: 14px;
  color: rgb(26, 26, 26);
  font-weight: 600;
  padding: 10px 0;
}
.commentItem {
  display: flex;
  margin: 5px 0;
  padding: 10px 0 20px;
  border-bottom: 1px solid #eee;
  font-size: 12px;
}
.commentCreatorAvatar {
  width: 35px;
  height: 35px;
  margin: 0px 10px 0 0;
}

.commentCreatorAvatar img {
  width: 100%;
  border-radius: 50%;
  cursor: pointer;
}

.commentMain {
  width: calc(100% - 50px);
}
.commentUserNickName {
  color: #5a8ab9;
  cursor: pointer;
}
.commentBottom {
  margin-top: 2px;
  color: rgb(172, 172, 172);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.commentButtons {
  display: flex;
  align-items: center;
}
.commentButtons div {
  margin-top: -3px;
  padding: 0 8px;
  transform: scale(0.85);
}
.commentButtons div:nth-child(1) {
  font-size: 14px;
}
.commentContent > span {
  line-height: 20px;
}
.likeCurrentComment,
.likeCurrentComment .icon {
  color: #ec4141 !important;
}
</style>