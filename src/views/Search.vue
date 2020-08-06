<template>
  <div class="search-container">
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isShowSearch=false"
      />
    </form>
    <!-- 搜索结果 -->
    <search-result :searchContent="sureSearchContent" v-if="isShowSearch"></search-result>

    <!-- 搜索联想 -->
    <search-associate @search="onSearch" v-else-if="searchText" :searchText="searchText"></search-associate>

    <!-- 搜索历史 -->
    <search-history
      @clearSearchHistory="searchHistorys=[]"
      @search-status="onSearch"
      :searchHistorys="searchHistorys"
      v-else
    ></search-history>
  </div>
</template>
<script>
import SearchHistory from '@/components/search/SearchHistory'
import SearchAssociate from '@/components/search/SearchAssociate'
import SearchResult from '@/components/search/SearchResult'
import { setItem, getItem } from '@/store/storage.js'
export default {
  name: 'serch',
  components: {
    SearchHistory,
    SearchAssociate,
    SearchResult,
  },
  data() {
    return {
      // 搜索内容
      searchText: '',
      isShowSearch: false,
      // 确定搜索内容
      sureSearchContent: '',
      // 存储搜索历史记录
      searchHistorys: getItem('search_history') || [],
    }
  },
  created() {},
  methods: {
    // 确定搜索时的函数
    onSearch(value) {
      // value 当前搜索的内容
      // 修改搜索文本
      this.searchText = value
      // 确定搜索的内容
      this.sureSearchContent = value
      const index = this.searchHistorys.indexOf(value)
      if (index !== -1) {
        this.searchHistorys.splice(index, 1)
      }
      this.searchHistorys.unshift(value)
      setItem('search_history', this.searchHistorys)
      // 显示搜索结果
      this.isShowSearch = true
    },
    // 点击取消按钮时触发
    onCancel() {
      this.$router.back()
    },
  },
}
</script>
<style lang="less" scoped>
.search-container {
  .van-search__action {
    color: #fff;
  }
}
</style>
