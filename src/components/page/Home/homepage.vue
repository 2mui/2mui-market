<template>
    <div class="homepage">
        <div class="banner">
            <div class="banner_avatar">
                <img :src="require('@/assets/img/girl.jpg')" alt="">
                <ul>
                    <li>王晓喵</li>
                    <li>ID  625789000</li>
                </ul>
            </div>
        </div>
        <div class="main">
            <div class="main_left">
                <ul>
                    <li v-for="(item,index) in linkList" :key="index" @click="handleLink(item.href)">{{ item.title }}</li>
                </ul>
            </div>
            <div class="main_right">
                <el-form ref="form" :model="form" label-width="80px">
                    <div id="data" name="data" class="right_title">基本资料</div>
                    <el-form-item label="昵称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-radio-group v-model="form.resource">
                            <el-radio label="男"></el-radio>
                            <el-radio label="女"></el-radio>
                            <el-radio label="保密"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="现居">
                        <el-select v-model="form.region" placeholder="请选择活动省份">
                            <el-option label="湖北" value="shanghai"></el-option>
                            <el-option label="武汉" value="beijing"></el-option>
                        </el-select>
                        <el-select class="mu_select" v-model="form.region" placeholder="请选择活动市区">
                            <el-option label="湖北" value="shanghai"></el-option>
                            <el-option label="武汉" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <div id="information" name="information" class="right_title">个人信息</div>
                    <el-form-item label="手机号">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="QQ">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="行业">
                        <el-select class="mu_industry" v-model="form.region" placeholder="请选择活动省份">
                            <el-option label="IT" value="shanghai"></el-option>
                            <el-option label="医疗" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="职业">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <div id="privacy" name="privacy" class="right_title">隐私设置</div>
                    <el-form-item label="姓名">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item class="mu_button">
                        <el-button type="primary">立即创建</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <Footer :colorConfirm="colorConfirm" />
    </div>
</template>

<script>
import Footer from '../../common/Footer';
export default {
    components: {
        Footer
    },
    data() {
        return {
            colorConfirm: '#F5F5F5',
            linkList: [
                {
                    href: '#data',
                    title: '基本资料'
                },
                {
                    href: '#information',
                    title: '个人信息'
                },
                {
                    href: '#privacy',
                    title: '隐私设置'
                }
            ],
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            }
        };
    },
    methods: {
        handleLink(href) {
            document.querySelector(href).scrollIntoView(true);
        }
    },
    created() {
    }
};
</script>
<style lang="scss" scoped>
.homepage{
    width: 100%;
    .banner{
        width: 100%;
        height: 140px;
        background: url("../../../assets/img/backdrop.png") no-repeat center;
        background-size: cover;
        margin-bottom: 130px;
        position: relative;
        .banner_avatar{
            width: 264px;
            height: 134px;
            position: absolute;
            top: 70px;
            left: 94px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            img{
                width: 130px;
                height: 130px;
                border-radius: 50%;
                border: 4px solid #ffffff;
                margin-right: 18px;
            }
            ul{
                li:first-child{
                    font-size: 28px;
                    font-family: Source Han Sans CN;
                    font-weight: bold;
                    color: #333333;
                    opacity: 1;
                    margin-bottom: 24px;
                }
                li:last-child{
                    font-size: 16px;
                    font-family: Source Han Sans CN;
                    font-weight: 400;
                    color: #666666;
                    opacity: 1;
                }
            }
        }
    }
    .main{
        margin: 0 auto;
        width: 1200px;
        display: flex;
        padding-bottom: 100px;
        box-sizing: border-box;
        .main_left{
            width: 400px;
            border-right: 1px solid #D3D3D3;
            display: flex;
            justify-content: flex-end;
            ul{
                padding-right: 86px;
                box-sizing: border-box;
                li{
                    cursor: pointer;
                    font-size: 18px;
                    font-family: Source Han Sans CN;
                    font-weight: 400;
                    margin-bottom: 45px;
                    a{
                        color: #000000;
                    }
                }
            }
        }
        .main_right{
            width: 800px;
            .right_title{
                padding-left: 100px;
                box-sizing: border-box;
                font-size: 30px;
                font-family: Source Han Sans CN;
                font-weight: 400;
                color: #333333;
                position: relative;
                margin-bottom: 46px;
            }
            .right_title::after{
                content: '';
                width: 121px;
                height: 25px;
                background: #FFF94B;
                position: absolute;
                left: 100px;
                top: 18px;
                z-index: -1;
            }
            /deep/{
                .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
                    padding-left: 114px;
                    box-sizing: border-box;
                }
                .el-input.is-active .el-input__inner, .el-input__inner:focus{
                    border-color: #DBDBDB;
                }
                .el-form-item--small .el-form-item__content, .el-form-item--small .el-form-item__label{
                    height: 50px;
                    line-height: 50px;
                    font-size: 18px;
                    color: #666666;
                }
                .el-input--small .el-input__inner{
                    height: 50px;
                    line-height: 50px;
                }
                .el-radio__inner{
                    border-radius: 2px;
                    border: 1px solid #000000;
                }
                .el-radio__input.is-checked .el-radio__inner{
                    background: #FFF94B;
                    border: 1px solid #FFF94B;
                }
                .el-radio__input.is-checked+.el-radio__label{
                    color: #000000;
                }
                .el-select{
                    width: 180px;
                    margin-right: 20px;
                }
                .mu_select{
                    width: 300px;
                    margin-right: 0px;
                }
                .mu_industry{
                    width: 100%;
                }
                .mu_button{
                    margin-top: 110px;
                    padding-left: 100px !important;
                    box-sizing: border-box;
                    .el-form-item__content{
                        margin: 0 !important;
                    }
                    .el-button--small, .el-button--small.is-round{
                        padding: 18px 34px;
                        border-radius: 50px;
                        background: #000000;
                        font-size: 18px;
                        font-weight: 400;
                        color: #FFFFFF;
                        opacity: 1;
                    }
                    .el-button--primary{
                        border: none;
                    }
                }
            }
        }
    }
}

</style>

