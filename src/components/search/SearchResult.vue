<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
    >
      <van-cell v-for="(item,index) in list" :key="index" :title="item.aut_name" />
    </van-list>
  </div>
</template>
<script>
export default {
  name: 'SearchResult',
  props: {
    searchContent: {
      type: String,
      required: true,
      error: false,
    },
  },
  data() {
    return {
      list: [],
      // 是否显示loding动画
      loading: false,
      // 数据是否加载完成
      finished: false,
      // 访问数据的页码
      page: 1,
      // 访问数据每页显示的数据
      per_page: 20,
    }
  },
  created() {},
  methods: {
    async onLoad() {
      try {
        const { data } = await this.$http.get('/app/v1_0/search', {
          params: {
            page: this.page,
            per_page: this.per_page,
            q: this.searchContent,
          },
        })
        const { results } = data.data
        this.list.push(...results)
        // 加载状态结束
        this.loading = false

        // 数据全部加载完成
        if (results.length) {
          this.page++
        } else {
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    },
  },
}
</script>
<style lang="less" scoped>
</style>
