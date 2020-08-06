<template>
  <div class="home-container">
    <!-- 标题部分 -->
    <van-nav-bar class="global-deploy-title" fixed>
      <van-button round slot="title" type="info" icon="search" class="btn-search" to="/search">搜索</van-button>
    </van-nav-bar>
    <van-tabs class="tabs-nav" v-model="active" swipeable animated>
      <van-tab :title="item.name" v-for="item in userChannelList" :key="item.id">
        <article-list :channel="item"></article-list>
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right" class="btn-hamburger" @click="isEditChannelPopup=true">
        <i class="toutiao itgengduo"></i>
      </div>
    </van-tabs>
    <!-- v-model (value)	是否显示弹出层 -->
    <!-- closeable v2.2.0	是否显示关闭图标 -->
    <!-- position	弹出位置，可选值为 top bottom right left -->
    <!-- close-icon-position v2.2.2	关闭图标位置，可选值为top-left bottom-left bottom-right -->
    <van-popup
      v-model="isEditChannelPopup"
      closeable
      position="bottom"
      close-icon-position="top-left"
      :style="{ height: '100%' }"
    >
      <edit-article
        @cutArticle="cutArticleList"
        @removeArticle="delArticle"
        @addArticle="editUserChannelList"
        :myarticle="userChannelList"
        :active="active"
      ></edit-article>
    </van-popup>
  </div>
</template>
<script>
import ArticleList from '../article/ArticleList'
import EditArticle from '../article/EditArticle'
import { setItem, getItem } from '@/store/storage.js'
export default {
  name: 'Page',
  data() {
    return {
      // 标签页选中项
      active: 0,
      // 用户频道列表数据
      userChannelList: [],
      // 是否显示编辑频道弹出层
      isEditChannelPopup: false,
    }
  },
  created() {
    this.getUserChannelList()
  },
  methods: {
    // 获取用户频道列表数据
    async getUserChannelList() {
      try {
        if (this.$store.state.user) {
          const { data } = await this.$http.get('/app/v1_0/user/channels')
          this.userChannelList = data.data.channels
        } else {
          if (getItem('toutiao_channel')) {
            this.userChannelList = getItem('toutiao_channel')
          }
          const { data } = await this.$http.get('/app/v1_0/user/channels')
          this.userChannelList = data.data.channels
        }
      } catch (err) {
        return this.$toast.fail('获取用户频道列表失败')
      }
    },
    // 添加用户频道列表数据
    async editUserChannelList(data) {
      this.userChannelList.push(data)
      try {
        if (this.$store.state.user) {
          await this.$http.patch('/app/v1_0/user/channels', {
            channels: [
              {
                id: data.id,
                seq: this.userChannelList.length,
              },
            ],
          })
        } else {
          setItem('toutiao_channel', this.userChannelList)
        }
      } catch (err) {
        this.$toast.fail('添加用户列表频道失败')
      }
    },
    // 修改频道列表高亮
    cutArticleList(index) {
      this.active = index
      this.isEditChannelPopup = false
    },
    // 删除用户频道列表数据
    async delArticle(index, article) {
      if (index > 0) {
        this.userChannelList.splice(index, 1)
      }
      try {
        if (this.$store.state.user) {
          await this.$http.delete(`/app/v1_0/user/channels/${article.id}`)
        } else {
          setItem('toutiao_channel', this.userChannelList)
        }
      } catch (err) {
        this.$toast.fail('删除用户频道列表失败')
      }
      if (index < this.active && index !== 0) {
        this.active--
      }
    },
  },
  components: {
    ArticleList,
    EditArticle,
  },
}
</script>
<style lang="less" scoped>
.home-container {
  .global-deploy-title {
    height: 100px;
    background-color: #3296fa;

    .btn-search {
      height: 66px;
      width: 555px;
      background-color: #5babfb;
      border: none;
      padding: 0;
    }
    .van-icon {
      color: #fff;
      font-size: 36px;
    }
  }
  /deep/ .van-tabs__wrap {
    position: fixed;
    top: 100px;
    left: 0;
    z-index: 1;
    width: 100%;
  }
  /deep/ .van-nav-bar__title {
    max-width: 100%;
  }

  /deep/ .tabs-nav {
    .van-tab {
      border-right: 1px solid #edeff3;
      flex-basis: auto !important;
      width: 200px;
      height: 80px;
      color: #777777;
      font-size: 26px;
    }
    .van-tab--active {
      color: #333333;
      font-weight: 700;
      font-size: 28px;
    }
    .van-tabs__line {
      bottom: 8px;
      background-color: #3296fa;
      height: 8px;
      width: 32px !important;
      border-radius: 4px;
    }
    .van-tabs__nav--line {
      padding-bottom: 0;
      height: auto;
    }
  }
  .placeholder {
    flex-shrink: 0;
    width: 66px;
    height: 80px;
  }
  .btn-hamburger {
    position: fixed;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80px;
    width: 66px;
    background-color: #fff;
    opacity: 0.902;
    i.toutiao {
      font-size: 33px;
    }
    &::before {
      content: '';
      position: absolute;
      left: 0;
      width: 1px;
      height: 100%;
      background-image: url(~@/assets/gradient-gray-line.png);
      background-size: contain;
    }
  }
}
</style>
