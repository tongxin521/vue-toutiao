<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isShowDelStatus">
        <span @click="$emit('clearSearchHistory')">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isShowDelStatus=false">完成</span>
      </div>
      <van-icon v-else name="delete" @click="isShowDelStatus=true" />
    </van-cell>
    <van-cell
      v-for="(item,index) in searchHistorys"
      :key="index"
      :title="item"
      @click="editSearchHistory(item,index)"
    >
      <van-icon v-show="isShowDelStatus" name="close" />
    </van-cell>
  </div>
</template>
<script>
export default {
  name: 'SearchHistory',
  props: {
    searchHistorys: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      // 是否显示删除状态
      isShowDelStatus: false,
    }
  },
  created() {},
  methods: {
    editSearchHistory(item, index) {
      if (this.isShowDelStatus) {
        // 删除状态
        this.searchHistorys.splice(index, 1)
      } else {
        // 搜索状态
        this.$emit('search-status', item)
      }
    },
  },
}
</script>
<style lang="less" scoped>
</style>
