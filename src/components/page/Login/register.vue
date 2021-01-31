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
          <el-form-item label="用户名" prop="login">
            <el-input v-model="ruleForm.login" placeholder="账号"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email" placeholder="邮箱"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="encrypted_password">
            <el-input
              v-model="ruleForm.encrypted_password"
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
import gql from "graphql-tag";
var MutationRegisterGql = gql`
  mutation register($login: String!, $encrypted_password: String!, $email: String!, $created_at: timestamp!, $updated_at: timestamp!) {
    insert_users(objects: {
      login: $login,
      encrypted_password: $encrypted_password,
      email: $email,
      created_at: $created_at,
      updated_at: $updated_at
    }) {
      returning {
        id
        login
      }
    }
  }
`;
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (!value) {
        return callback(new Error("邮箱不能为空"));
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的邮箱格式"));
        }
      }, 100);
    };
    return {
      labelPosition: "top",
      ruleForm: {
        login: "",
        encrypted_password: "",
        email: "",
        created_at: "now",
        updated_at: "now",
      },
      rules: {
        login: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        encrypted_password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        email: [
          { required: true,validator: checkEmail, trigger: "blur" }
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$apollo
            .mutate({
              // 更新的语句
              mutation: MutationRegisterGql,
              // 实参列表
              variables: {
                login: this.ruleForm.login,
                encrypted_password: this.ruleForm.encrypted_password,
                email: this.ruleForm.email,
                created_at: this.ruleForm.created_at,
                updated_at: this.ruleForm.updated_at,
              },
            })
            .then((response) => {
              // 输出获取的数据集
              console.log(response);
              this.$message({
                message: '恭喜你，注册成功！',
                type: 'success'
              });
            })
            .catch((err) => {
              // 捕获错误
              this.$message({
                message: '错了哦！邮箱已存在',
                type: 'error'
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
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

