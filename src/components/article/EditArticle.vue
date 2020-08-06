<template>
  <div class="edit-article">
    <van-cell class="my-article">
      <div slot="title" class="title">我的频道</div>
      <van-button
        class="btn-edit"
        type="danger"
        size="small"
        round
        @click="isicon=!isicon"
      >{{isicon?'完成':'编辑'}}</van-button>
    </van-cell>
    <van-grid :gutter="8">
      <van-grid-item class="article-item" v-for="(article,index) in myarticle" :key="index">
        <div
          @click="cutArticle(index,article)"
          slot="text"
          class="text"
          :class="index==active?'active':''"
        >{{article.name}}</div>
        <van-icon v-if="isicon&&index!==0" slot="icon" name="close" class="icon-right-top" />
      </van-grid-item>
    </van-grid>
    <van-cell class="article-recommend">
      <div slot="title" class="title">频道推荐</div>
    </van-cell>
    <van-grid :gutter="8">
      <van-grid-item
        class="article-item"
        v-for="(item,index) in surplusArticleList"
        :key="index"
        :text="item.name"
        icon="plus"
        @click="addArticle(item,index)"
      />
    </van-grid>
  </div>
</template>
<script>
export default {
  name: 'EditArticle',
  props: {
    myarticle: {
      type: Array,
      required: true,
    },
    active: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      allArticle: [],
      isicon: false,
    }
  },
  created() {
    this.getAllArticle()
  },
  methods: {
    async getAllArticle() {
      try {
        const { data } = await this.$http.get('/app/v1_0/channels')
        this.allArticle = data.data.channels
        console.log(this.allArticle)
      } catch (err) {
        return this.$toast.fail('获取全部频道列表失败！')
      }
    },
    addArticle(article, index) {
      this.$emit('addArticle', article, index)
    },
    cutArticle(index, article) {
      // 非编辑状态切换频道
      if (!this.isicon) {
        return this.$emit('cutArticle', index)
      }
      // 编辑状态删除我的频道
      return this.$emit('removeArticle', index, article)
    },
  },
  computed: {
    surplusArticleList() {
      // 用来测试数组的每个元素的函数。返回 true 表示该元素通过测试，保留该元素，false 则不保留。
      return this.allArticle.filter((item) => {
        // 数组中第一个满足所提供测试函数的元素的值，否则返回 undefined
        // 遍历我的频道 如果在全部频道中存在
        // 如果全部频道里有我的频道 返回第一个满足条件的元素
        // 取反  代表我不希望剩余频道有我的频道
        return !this.myarticle.find((item2) => {
          // 判断全部频道是否有我的频道
          return item2.id === item.id
        })
      })
    },
  },
}
</script>
<style lang="less" scoped>
.edit-article {
  padding: 110px 25px 0;
  .title {
    font-size: 32px;
    color: #333333;
  }
  /deep/ .my-article {
    .btn-edit {
      height: 48px;
      width: 105px;
      .van-button__text {
        color: #f85959;
      }
    }
    .btn-edit {
      background-color: #fff;
      border: 1px solid #f85a5a;
    }
  }
  .icon-right-top {
    font-size: 28px;
    position: absolute;
    top: -8px;
    right: -8px;
    z-index: 2;
  }
  /deep/ .van-grid-item__icon-wrapper {
    position: unset;
  }
  /deep/ .article-item {
    height: 86px;
    height: 160px;
    .van-grid-item__content {
      flex-direction: row;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        margin: 0;
        font-size: 26px;
        color: #222;
      }
      .van-grid-item__icon {
        font-size: 24px;
        margin-right: 7px;
      }
    }
  }
  .van-cell::after {
    border-bottom: 0;
  }
  .van-grid-item__content {
    padding: 0;
  }
  /deep/ .van-grid-item__text {
    white-space: nowrap;
  }
  .active {
    color: #f85959 !important;
  }
}
</style>
