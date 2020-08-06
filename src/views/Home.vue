<template>
  <div class="container">
    <!-- 子路由出口 -->
    <router-view></router-view>
    <!-- tabbar -->
    <van-tabbar route>
      <van-tabbar-item to="/page" class="tabbar_item">
        <i slot="icon" class="toutiao itshouye" />
        <span class="text">首页</span>
      </van-tabbar-item>
      <van-tabbar-item to="/ask" class="tabbar_item">
        <i slot="icon" class="toutiao itwenda" />
        <span class="text">问答</span>
      </van-tabbar-item>
      <van-tabbar-item to="/video" class="tabbar_item">
        <i slot="icon" class="toutiao itshipin" />
        <span class="text">视频</span>
      </van-tabbar-item>
      <van-tabbar-item to="/my" class="tabbar_item">
        <i slot="icon" class="toutiao itwode" />
        <span class="text">{{$store.state.user?"我的":'未登录'}}</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  data() {
    return {
      active: '',
    }
  },
}
</script>
<style lang="less" scoped>
.container {
  .toutiao {
    font-size: 40px;
  }
  .text {
    font-size: 22px;
  }
}
</style>
