<template>
  <div class="comment-reply-contaner">
    <van-nav-bar :title="comment.reply_count?comment.reply_count+'条回复':'暂未回复'">
      <van-icon slot="left" name="cross" @click="$emit('close')" />
    </van-nav-bar>
    <comment-item :comment="comment"></comment-item>
    <van-cell title="全部回复" />
    <comment-list :list="commentLists" :articleId="comment.com_id" :type="'c'"></comment-list>
    <div class="replay-comment">
      <van-button round size="small" @click="isReplyShow=true">评论回复</van-button>
    </div>
    <!-- 回复评论弹出层 -->
    <van-popup v-model="isReplyShow" position="bottom">
      <comment-post :articleId="comment.com_id" :artId="articleId" @postComment="addpostComment"></comment-post>
    </van-popup>
    <!-- /回复评论弹出层 -->
  </div>
</template>
<script>
import CommentItem from '@/components/comment/CommentItem.vue'
import CommentList from '@/components/comment/CommentList.vue'
import CommentPost from '@/components/comment/CommentPost.vue'
export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    CommentList,
    CommentPost,
  },
  props: {
    comment: {
      type: Object,
      required: true,
    },
    articleId: {
      type: [Object, String, Number],
      required: true,
    },
  },
  data() {
    return {
      isReplyShow: false,
      commentLists: [],
    }
  },
  created() {},
  methods: {
    addpostComment(e) {
      this.comment.reply_count++
      this.isReplyShow = false
      this.commentLists.unshift(e)
    },
  },
}
</script>
<style lang="less" scoped>
.comment-reply-contaner {
  z-index: 3;
  padding-bottom: 88px;
  .replay-comment {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    height: 88px;
    display: flex;
    justify-content: center;
    align-items: center;
    .van-button {
      width: 60%;
    }
  }
}
</style>
