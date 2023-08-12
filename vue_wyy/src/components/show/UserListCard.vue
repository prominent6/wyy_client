<template>
  <div class="UserListCard">
    <div
      class="userItemContainer"
      v-for="(item, index) in userList"
      :key="index"
    >
      <div class="userItem">
        <div class="left">
          <img :src="item.avatarUrl + '?param=200y200'" alt="" class="avatar" />
        </div>
        <div class="right">
          <div class="nickName">{{ item.nickname }}</div>
          <div class="signature">
            {{ item.signature }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserListCard",
  props: {
    userList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>

<style scoped>
.UserListCard {
  display: flex;
  flex-wrap: wrap;
  min-width: 700px;
}

.userItemContainer {
  margin: 0 auto;
}

.userItem {
  display: flex;
  width: 350px;
  padding: 10px 10px;
  border-radius: 10px;
  cursor: pointer;
}

.userItem:hover {
  background-color: #f9f9f9;
}

.avatar {
  height: 70px;
  width: 70px;
  object-fit: cover;
  border-radius: 50%;
  border: 1px solid #eee;
  margin-right: 10px;
}

.nickName {
  margin: 10px 0 5px;
  font-size: 13px;
  color: #373737;
}

.signature {
  font-weight: lighter;
  font-size: 12px;
  transform: scale(0.9) translateX(-5%);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 250px;
  height: 13px;
  margin: 5px 0;
}
</style>