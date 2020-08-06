<template>
  <div class="login-container">
    <van-nav-bar title="登录" class="global-deploy-title">
      <van-icon
        @click="$router.back()"
        class="van_icon"
        slot="left"
        name="cross"
      />
    </van-nav-bar>
    <van-form @submit="onSubmit" ref="useForm">
      <van-field
        v-model="user.mobile"
        left-icon="toutiao itshouji"
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="toutiao itshouji"></i>
      </van-field>

      <van-field
        maxlength="6"
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
      >
        <i slot="left-icon" class="toutiao ityanzhengma"></i>
        <template #button>
          <van-count-down
            @finish="isDisplayCode = false"
            v-if="isDisplayCode"
            :time="userFormTime"
            format="ss s"
          />
          <van-button
            v-else
            size="small"
            class="btn-yanzheng"
            native-type="button"
            block
            @click="getAuthCode"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div class="btn-row">
        <van-button type="info" native-type="submit" round>登录</van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
export default {
  name: 'LoginPagin',
  data() {
    return {
      // form表单对象
      user: {
        mobile: '13911111111',
        code: '246810'
      },
      // 表单验证规则
      userFormRules: {
        mobile: [
          {
            required: true,
            message: '手机号不能为空'
          },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: '手机号格式错误'
          }
        ],
        code: [
          {
            required: true,
            message: '验证码不能为空'
          },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      },
      // 倒计时时间
      userFormTime: 1000 * 60,
      // 是否显示获取验证码
      isDisplayCode: false
    }
  },
  created() {},
  methods: {
    async onSubmit() {
      this.$toast.loading({
        message: '登陆中...',
        forbidClick: true
      })
      try {
        const { data } = await this.$http.post(
          'app/v1_0/authorizations',
          this.user
        )
        this.$store.commit('setUser', data.data)
        this.$router.back()
        this.$toast.success('登陆成功')
      } catch (err) {
        console.log(err)
        // if (err.response.status === 400) {
        //   return this.$toast.fail('登陆失败,手机号或验证码错误')
        // } else {
        //   return this.$toast.fail('登陆失败', err)
        // }
      }
    },
    // 获取验证码
    async getAuthCode() {
      // 验证手机号
      try {
        await this.$refs.useForm.validate('mobile')
        // 开启倒计时
        this.isDisplayCode = true
        // 获取验证码
        await this.$http.get(`/app/v1_0/sms/codes/${this.user.mobile}`)
      } catch (err) {
        if (err.response.status === 429) {
          return this.$toast.fail('获取验证码过于频繁,请稍后重试！！')
        } else if (err.response.status === 404) {
          return this.$toast.fail('手机号错误！')
        }
        return this.$toast.fail('获取验证码失败', err)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.login-container {
  .van-nav-bar {
    background-color: #3296fa;
  }
  .btn-row {
    padding: 53px 32px;
  }
  .van-button {
    width: 100%;
    background-color: #6db4fb;
    border: none;
    color: #3296fa;
    font-size: 30px;
  }
  .toutiao {
    font-size: 40px;
    position: relative;
    top: 3px;
  }
  .btn-yanzheng {
    background-color: #ededed;
    font-size: 22px;
    color: #666666;
    height: 50px;
    border-radius: 25px;
  }
  .global-deploy-title {
    .van_icon {
      font-size: 32px;
      color: #fff;
    }
  }
}
</style>
