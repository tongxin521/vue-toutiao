<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <comment-item
        @onreplypopup="$emit('onreplypopup',$event)"
        v-for="(item,index) in list"
        :key="index"
        :comment="item"
        :immediate-check="false"
      ></comment-item>
    </van-list>
    <!-- 评论列表 -->
  </div>
</template>

<script>
import CommentItem from '@/components/comment/CommentItem'
export default {
  name: 'CommentList',
  components: {
    CommentItem,
  },
  props: {
    articleId: {
      type: [Object, String, Number],
      required: true,
    },
    list: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: 'a',
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['a', 'c'].indexOf(value) !== -1
      },
    },
  },
  data() {
    return {
      // list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      // 获取的评论数据个数
      limit: 10,
      offset: null,
    }
  },
  created() {
    this.loading = true
    this.onLoad()
  },
  methods: {
    async onLoad() {
      try {
        const { data } = await this.$http.get('/app/v1_0/comments', {
          params: {
            // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
            type: this.type,
            // 源id，文章id或评论id
            source: this.articleId.toString(),
            // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
            offset: this.offset,
            // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
            limit: this.limit,
          },
        })
        const { results } = data.data
        this.$emit('commentNumber', data.data.total_count)
        // console.log(results)
        this.list.push(...results)
        // // 加载状态结束
        this.loading = false
        // // 数据全部加载完成
        if (results.length) {
          this.offset = data.data.last_id
        } else {
          this.finished = true
        }
      } catch (err) {
        this.$toast.fail('获取文章评论失败', err)
      }
    },
  },
}
</script>

<style scoped lang="less">
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}

.van-list {
  margin-bottom: 45px;
}
</style>
