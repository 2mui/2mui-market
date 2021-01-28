<template>
  <div class="login">
    <div class="login_left"></div>
    <div class="login_right">
      <div class="right_title">
        <span>第三方快捷登录</span>
      </div>
      <div class="icon_img">
        <div class="icon">
          <router-link to="#" class="title_text"
            ><img src="../../../assets/img/qq.png" alt="" /> QQ登录</router-link
          >
        </div>
        <div class="icon">
          <router-link to="#" class="title_text"
            ><img src="../../../assets/img/weChat.png" alt="" />
            微信登录</router-link
          >
        </div>
      </div>
      <div class="right_title">
        <span>账号密码登录</span>
      </div>
      <div class="login_form">
        <el-form
          :label-position="labelPosition"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="账号" prop="account_number">
            <el-input v-model="ruleForm.name" placeholder="账号"></el-input>
          </el-form-item>
          <router-link to="#" class="forget_password">忘记密码?</router-link>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="ruleForm.name"
              type="password"
              placeholder="密码"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="submit" @click="submitForm('ruleForm')"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
        <p class="text">
          没有账号?
          <router-link to="./register" class="register">立即注册</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      labelPosition: "top",
      ruleForm: {
        account_number: "",
        password: "",
      },
      rules: {
        account_number: [],
        password: [],
      },
    };
  },
  methods: {
    submitForm() {},
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.login {
  min-width: 1300px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #fff;
  overflow: hidden;
  .login_left {
    width: 766px;
    height: 100%;
    background: url("../../../assets/img/login.png") no-repeat center;
    background-size: cover;
  }
  .login_right {
    font-family: Source Han Sans CN;
    width: 500px;
    height: 600px;
    position: absolute;
    left: 900px;
    top: 50%;
    transform: translateY(-50%);
    .right_title {
      text-align: center;
      span {
        font-size: 20px;

        font-weight: bold;
        line-height: 34px;
        color: #000000;
        opacity: 1;
      }
    }
    .right_title::before {
      content: "";
      width: 140px;
      height: 1px;
      background: #d3d3d3;
      margin: 16px 0;
      float: left;
    }
    .right_title::after {
      content: "";
      width: 140px;
      height: 1px;
      background: #d3d3d3;
      margin: 16px 0;
      float: right;
    }

    .icon_img {
      display: flex;
      justify-content: space-evenly;
      text-align: center;
      margin: 40px 0 92px 0;
      .icon {
        width: 90px;
        height: 90px;
        img {
          width: 100%;
        }
        a {
          font-size: 14px;
          color: #666666;

          font-weight: 400;
          line-height: 24px;
        }
      }
    }
    .login_form {
      margin-top: 41px;
      position: relative;
      .submit {
        width: 100%;
        height: 50px;
        background: #fff94b;
        border: none;
        border-radius: 80px;
        font-size: 18px;
        margin-top: 30px;
        line-height: 36px;
        color: #000000;
      }
    }
    .text {
      text-align: center;
      font-size: 16px;
    }
    .forget_password {
      font-size: 16px;
      color: #000000;
      text-decoration: underline;
      position: absolute;
      right: 0;
      top: 103px;
    }
    .register {
      font-size: 16px;
      color: #000000;
      text-decoration: underline;
    }
  }
}
</style>

