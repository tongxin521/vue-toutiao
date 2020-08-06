<template>
  <div class="search-associate">
    <van-cell v-for="(text, index) in searchAssociates" :key="index" icon="search">
      <div @click="$emit('search',text)" slot="title" v-html="searchTextHighlight(text)"></div>
    </van-cell>
  </div>
</template>
<script>
// 导入 lodash 防抖函数 debounce
import { debounce } from 'lodash'
export default {
  name: 'SearchAssociate',
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // 搜索联想列表数据
      searchAssociates: [],
    }
  },
  created() {},
  methods: {
    async getSearchAssociate(val) {
      try {
        const { data } = await this.$http.get('/app/v1_0/suggestion', {
          params: {
            q: val,
          },
        })
        this.searchAssociates = data.data.options
      } catch (err) {
        this.$toast.fail('获取联想列表数据失败！')
      }
    },
    // 搜索文本高亮的方法
    searchTextHighlight(text) {
      const str = `<span style="color:red">${this.searchText}</span>`
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, str)
    },
  },
  watch: {
    searchText: {
      handler: debounce(function (value) {
        this.getSearchAssociate(value)
      }, 200),
      immediate: true,
    },
  },
}
</script>
<style lang="less" scoped></style>
