<template>
  <div class="register">
    <div class="register_left"></div>
    <div class="register_right">
      <div class="right_title">
        <span>新用户注册</span>
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
          <el-form-item label="用户名" prop="account_number">
            <el-input
              v-model="ruleForm.account_number"
              placeholder="账号"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email" placeholder="邮箱"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="ruleForm.password"
              type="password"
              placeholder="密码"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="submit" @click="submitForm('ruleForm')"
              >创建账户</el-button
            >
          </el-form-item>
        </el-form>
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
        email: "",
      },
      rules: {
        account_number: [],
        password: [],
        email: [],
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
.register {
  min-width: 1300px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #fff;
  overflow: hidden;
  //   width: 100vw;
  //   height: 100vh;
  //   background: #fff;
  .register_left {
    width: 766px;
    height: 100vh;
    background: url("../../../assets/img/login.png") no-repeat center;
    background-size: cover;
  }
  .register_right {
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
      margin-bottom: 41px;
    }
    .right_title:before {
      content: "";
      width: 140px;
      height: 1px;
      background: #d3d3d3;
      margin: 16px 0;
      float: left;
    }
    .right_title:after {
      content: "";
      width: 140px;
      height: 1px;
      background: #d3d3d3;
      margin: 16px 0;
      float: right;
    }

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
}
</style>

