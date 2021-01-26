<template>
    <div class="login">
        <div class="login_left"></div>
        <div class="login_right">
            <div class="right_title">
                <span>第三方快捷登录</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    methods: {
    },
    created() {
    }
};
</script>
<style lang="scss" scoped>
.login{
    min-width: 1300px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: #fff;
    overflow: hidden;
    .login_left{
        width: 766px;
        height: 100%;
        background: url("../../../assets/img/login.png") no-repeat center;
        background-size: cover;
    }
    .login_right{
        width: 500px;
        height: 600px;
        position: absolute;
        left: 800px;
        top: 50%;
        transform: translateY(-50%);
        .right_title{
            text-align: center;
            span{
                font-size: 20px;
                font-family: Source Han Sans CN;
                font-weight: bold;
                line-height: 34px;
                color: #000000;
                opacity: 1;
            }
        }
    }
}

</style>

