<template>
  <div>
    <div class="header" v-if="!$store.state.user">
      <div class="not-login" @click="$router.push('/login')">
        <img class="image" src="~@/assets/mobile.png" alt />
        <span class="text">登录/注册</span>
      </div>
    </div>
    <div class="header" v-else>
      <div class="user_info">
        <div class="left">
          <van-image round fit="cover" class="use-poto" :src="userInfo.photo" />
          <span class="text">{{userInfo.name}}</span>
        </div>
        <div class="right">
          <van-button type="default" round size="mini" class="setUseInfo" to="/updata/user">编辑资料</van-button>
        </div>
      </div>
      <div class="user_info_bt">
        <div class="user_item">
          <span class="textNum">{{userInfo.art_count}}</span>
          <span class="text">头条</span>
        </div>
        <div class="user_item">
          <span class="textNum">{{userInfo.follow_count}}</span>
          <span class="text">关注</span>
        </div>
        <div class="user_item">
          <span class="textNum">{{userInfo.fans_count}}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="user_item">
          <span class="textNum">{{userInfo.like_count}}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <van-grid :column-num="2" clickable>
      <van-grid-item class="gridItem">
        <i slot="icon" class="toutiao itshoucang"></i>
        <span slot="text" class="text">收 藏</span>
      </van-grid-item>
      <van-grid-item class="gridItem">
        <i slot="icon" class="toutiao itlishi"></i>
        <span slot="text" class="text">历 史</span>
      </van-grid-item>
    </van-grid>
    <van-cell class="msgInform" title="消息通知" is-link />
    <van-cell class="xiaozhi" title="小智同学" is-link />
    <van-cell v-if="$store.state.user" class="logOut" title="退出登录" clickable @click="onLogOut" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 用户信息
      userInfo: {},
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    // 退出登录
    onLogOut() {
      this.$dialog
        .confirm({
          message: '确定要退出吗?',
        })
        .then(() => {
          // on confirm
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // on cancel
          this.$toast.fail('取消了退出登录！！')
        })
    },
    // 获取登录用户信息
    async getUserInfo() {
      try {
        const { data } = await this.$http.get('/app/v1_0/user')
        this.userInfo = data.data
      } catch (err) {
        this.$toast.fail('获取用户信息失败！！')
      }
    },
  },
}
</script>
<style lang="less" scoped>
.header {
  height: 361px;
  background: url('~@/assets/banner.png');
  background-size: cover;
  .not-login {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .image {
      width: 135px;
      height: 135px;
      margin-bottom: 15px;
    }
    .text {
      color: #fff;
      font-size: 26px;
    }
  }
}
.user_info {
  height: 231px;
  padding: 74px 32px 24px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  .right {
    display: flex;
    align-items: center;
    .setUseInfo {
      padding: 0 5px;
      color: #666;
      font-size: 20px;
    }
  }
  .use-poto {
    width: 131px;
    height: 131px;
    border-radius: 50%;
    border: 4px solid #fff;
    margin-right: 25px;
  }
  .left {
    display: flex;
    align-items: center;
    font-size: 30px;
    color: #fff;
  }
}
.user_info_bt {
  display: flex;
  .user_item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: #fff;
    margin-top: 25px;
    .textNum {
      font-size: 36px;
      font-weight: 500;
    }
    .text {
      font-size: 24px;
      font-weight: 500;
    }
  }
}
.toutiao {
  font-size: 45px;
}
.itshoucang {
  color: #eb5253;
}
.text {
  font-size: 26px;
}
.itlishi {
  color: #ff9d1d;
}
.gridItem {
  height: 141px;
}
.msgInform {
  height: 100px;
  margin-top: 10px;
}
.xiaozhi {
  height: 100px;
  margin-bottom: 10px;
}
.logOut {
  height: 105px;
  text-align: center;
  color: #d86262;
}
</style>
