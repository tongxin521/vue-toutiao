<template>
  <div class="updata-user">
    <van-nav-bar class="global-deploy-title" title="个人信息" left-arrow @click-left="$router.back()" />
    <div class="user-info">
      <input type="file" hidden ref="fileRef" @change="onChange" />
      <van-cell title="头像" is-link @click="$refs.fileRef.click()">
        <van-image class="user-photo" round fit="cover" :src="userInfo.photo" />
      </van-cell>
      <van-cell title="昵称" :value="userInfo.name" is-link @click="isUseNameShow=true" />
      <van-cell
        title="性别"
        :value="userInfo.gender===0?'男':'女'"
        is-link
        @click="isUseGenderShow=true"
      />
      <van-cell title="生日" :value="userInfo.birthday" is-link @click="isUseBirthdayShow=true" />
    </div>
    <!-- 修改用户昵称弹出框 -->
    <van-popup v-model="isUseNameShow" position="bottom" :style="{ height: '100%' }">
      <user-nickname v-if="isUseNameShow" @close="isUseNameShow=false" v-model="userInfo.name"></user-nickname>
    </van-popup>
    <!-- /修改用户昵称弹出框 -->
    <van-popup v-model="isUseGenderShow" position="bottom">
      <user-gender v-if="isUseGenderShow" @close="isUseGenderShow=false" v-model="userInfo.gender"></user-gender>
    </van-popup>
    <!-- /修改用户生日弹出框 -->
    <van-popup v-model="isUseBirthdayShow" position="bottom">
      <user-birthday
        v-if="isUseBirthdayShow"
        @close="isUseBirthdayShow=false"
        v-model="userInfo.birthday"
      ></user-birthday>
    </van-popup>
    <!-- 更换头像弹出框 -->
    <van-popup v-model="isUsePhotoShow" position="bottom" :style="{ height: '100%' }">
      <user-photo
        v-if="isUsePhotoShow"
        @close="isUsePhotoShow=false"
        @user-photo="userInfo.photo=$event"
        :img="img"
      ></user-photo>
    </van-popup>
  </div>
</template>
<script>
import UserNickname from '@/components/user/UserNickname.vue'
import UserGender from '@/components/user/UserGender.vue'
import UserBirthday from '@/components/user/UserBirthday.vue'
import UserPhoto from '@/components/user/UserPhoto.vue'
export default {
  name: 'UpdataUser',
  data() {
    return {
      userInfo: {},
      isUseNameShow: false,
      isUseGenderShow: false,
      isUseBirthdayShow: false,
      isUsePhotoShow: false,
      img: '',
    }
  },
  components: {
    UserNickname,
    UserGender,
    UserBirthday,
    UserPhoto,
  },
  created() {
    this.getUserInfo()
  },
  mounted() {},
  methods: {
    async getUserInfo() {
      try {
        const { data } = await this.$http.get('/app/v1_0/user/profile')
        this.userInfo = data.data
      } catch (err) {
        return this.$toast.fail('获取用户信息失败')
      }
    },
    onChange() {
      const file = this.$refs.fileRef.files[0]
      const img = window.URL.createObjectURL(file)
      this.img = img
      this.isUsePhotoShow = true
      this.$refs.fileRef.value = ''
    },
  },
}
</script>
<style lang="less" scoped>
.updata-user {
  /deep/ .van-nav-bar {
    background-color: #3296fa;
    .van-icon {
      color: #fff;
    }
  }
  .user-photo {
    width: 60px;
    height: 60px;
  }
}
.van-popup {
  background: #f5f7f9;
}
</style>
