<template>
  <div class="box">
    <el-dialog
      class="indexMould"
      :visible.sync="dialogCollection"
      :close-on-click-modal="false"
      :before-close="handleClose"
      top="5%"
      width="1040px"
    >
      <div class="warp">
        <div class="login" @click="handleHeid">
          <div class="login_left"></div>
          <div class="login_right">
            <div class="right_title">
              <span>第三方快捷登录</span>
            </div>
            <div class="icon_img">
              <div class="icon">
                <li class="title_text">
                  <img src="../../assets/img/qq.png" alt="" /> QQ登录
                </li>
              </div>
              <div class="icon">
                <li class="title_text">
                  <img
                    src="../../assets/img/weChat.png"
                    alt=""
                    @click.stop="handleWXLogin"
                  />
                  微信登录
                </li>
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
                <el-form-item label="账号" prop="login">
                  <el-input
                    v-model="ruleForm.login"
                    placeholder="账号"
                  ></el-input>
                </el-form-item>
                <router-link to="#" class="forget_password"
                  >忘记密码?</router-link
                >
                <el-form-item label="密码" prop="encrypted_password">
                  <el-input
                    v-model="ruleForm.encrypted_password"
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
                <router-link to="./register" class="register"
                  >立即注册</router-link
                >
              </p>
            </div>
          </div>
          <div id="weixin" v-show="showLogin"></div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogCollection: true,

      showLogin: false,
      labelPosition: "top",
      ruleForm: {
        login: "",
        encrypted_password: "",
      },
      rules: {
        login: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        encrypted_password: [
          { required: true, message: "请输入密码", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$apollo
            .query({
              query: gql`
                {
                  users {
                    email
                    login
                    encrypted_password
                  }
                }
              `,
              fetchPolicy: "no-cache",
            })
            .then((data) => {
              var userList = data.data.users;
              for (var i in userList) {
                if (
                  this.ruleForm.login == userList[i].login &&
                  this.ruleForm.encrypted_password ==
                    userList[i].encrypted_password
                ) {
                  console.log(userList[i]);
                  console.log("成功");
                } else {
                  console.log("失败");
                }
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleHeid() {
      this.showLogin = false;
    },
    handleWXLogin() {
      this.showLogin = true;
      var obj = new WxLogin({
        self_redirect: false,
        id: "weixin",
        appid: "wx132ba6a4780db515",
        scope: "snsapi_login",
        redirect_uri: "http://localhost:8080/#/login",
        state: "",
        style: "",
        href: "",
      });
    },
    handleClose() {
      this.dialogCollection = false;
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.box {
  /deep/ {
    .el-dialog {
      border-radius: 14px;
      .el-dialog__header {
        padding: 0;
        .el-dialog__headerbtn{
            color: #333333;
            z-index: 9;
        }
        .el-dialog__headerbtn:focus .el-dialog__close, .el-dialog__headerbtn:hover .el-dialog__close{
            color: #333333;
        }
      }
      .el-dialog__body {
        padding: 0;
        .warp {
          height: 760px;
          .login {
            width: 100%;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: #fff;
            overflow: hidden;
            .login_left {
              width: 478px;
              height: 100%;
              background: url("../../assets/img/login.png") no-repeat center;
              background-size: cover;
            }
            .login_right {
              font-family: Source Han Sans CN;
              width: 400px;
              height: 600px;
              position: absolute;
              left: 560px;
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
                width: 80px;
                height: 1px;
                background: #d3d3d3;
                margin: 16px 0;
                float: left;
              }
              .right_title::after {
                content: "";
                width: 80px;
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
                    cursor: pointer;
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
            #weixin {
              background: white;
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            }
          }
        }
      }
      .el-dialog__footer {
        text-align: center;
        .dialog-footer {
          div {
            cursor: pointer;
            width: 144px;
            height: 50px;
            line-height: 50px;
            display: inline-block;
            background: #000000;
            border: 1px solid #000000;
            border-radius: 114px;
            margin-right: 20px;
            color: white;
            font-size: 18px;
          }
          div:last-child {
            background: white;
            color: #000000;
          }
        }
      }
    }
  }
}
</style>

