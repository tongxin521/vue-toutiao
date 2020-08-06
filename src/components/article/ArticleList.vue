<template>
  <div class="article-list">
    <!-- v-model	是否处于加载中状态 -->
    <!-- refresh	下拉刷新时触发 -->
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      :success-text="downBreakText"
      success-duration="1500"
    >
      <!-- v-model	是否处于加载状态，加载过程中不触发load事件 -->
      <!-- finished	是否已加载完成，加载完成后不再触发load事件 -->
      <!-- load	滚动条与底部距离小于 offset 时触发 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :error.sync="isError"
        error-text="请求失败，点击重新加载"
      >
        <article-item
          v-for="(item, index) in list"
          :key="index"
          :article="item"
        ></article-item>
        <!-- <van-cell v-for="(item,index) in list" :key="index" :title="item.aut_name" /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import ArticleItem from './ArticleItem.vue'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      list: [],
      // 是否加载loding动画
      loading: false,
      // 是否加载完成
      finished: false,
      // 是否请求失败
      isError: false,
      // 下一次的时间戳
      pre_timestamp: Date.now(),
      // 是否处于加载状态
      isLoading: false,
      // 下来刷新成功提示文本
      downBreakText: '刷新成功'
    }
  },
  methods: {
    async onLoad() {
      try {
        const { data } = await this.$http.get('/app/v1_1/articles', {
          params: {
            channel_id: this.channel.id,
            timestamp: this.pre_timestamp,
            with_top: 0
          }
        })
        const { results } = data.data
        this.list.push(...results)
        this.loading = false
        this.pre_timestamp = Date.now()
        if (!results.length) {
          this.finished = true
        }
      } catch (err) {
        this.loading = false
        this.isError = true
      }
    },
    async onRefresh() {
      try {
        const { data } = await this.$http.get('/app/v1_1/articles', {
          params: {
            channel_id: this.channel.id,
            timestamp: Date.now(),
            with_top: 0
          }
        })
        const { results } = data.data
        this.list.unshift(...results)
        this.isLoading = false
        this.downBreakText = `刷新成功，更新了${results.length}`
      } catch (err) {
        this.isLoading = false
        this.downBreakText = '刷新失败,请重新刷新'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.article-list {
  margin-bottom: 100px;
  margin-top: 180px;
  height: 79vh;
  overflow-y: auto;
}
</style>
