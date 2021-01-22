<template>
    <div class="personal">
        <div class="banner">
            <div class="banner_avatar">
                <img :src="require('@/assets/img/girl.jpg')" alt="">
                <ul>
                    <li>王晓喵</li>
                    <li>ID  625789000</li>
                </ul>
                <div class="banner_button">
                    <div>个人资料</div>
                    <div>
                        更多
                        <img :src="require('@/assets/img/more.png')" alt="" srcset="">
                    </div>
                </div>
            </div>
        </div>
        <div class="main">
            <div class="main_title">
                <ul>
                    <li @click="handleNav(item.id)" v-for="(item,index) in navList" :class="className == item.id ? 'active' : ''" :key="index">
                        {{ item.title }}
                    </li>
                </ul>
            </div>
            <div class="main_content">
                <div v-for="(item,index) in dataList" :key="index" class="card">
                    <img :src="item.images" alt="">
                    <div class="card_footer">
                        <li class="card_footer_left"><span>{{ item.title }}</span><span>{{ item.label }}</span></li>
                        <div class="card_footer_right">
                            <li>
                                <img :src="require('@/assets/img/download.png')" alt="" srcset="">
                                {{ item.download }}
                            </li>
                            <li>
                                <img :src="require('@/assets/img/collection.png')" alt="" srcset="">
                                {{ item.collection }}
                            </li>
                        </div>
                    </div>
                </div>
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
            className: 0,
            navList:[
                {
                    id: 0,
                    title: '我的收藏'
                },
                {
                    id: 1,
                    title: '浏览记录'
                },
                {
                    id: 2,
                    title: '下载记录'
                }
            ],
            dataList:[
                {
                    images:require('@/assets/img/index.jpg'),
                    label: 'APP',
                    title: '智能家居设计',
                    download: '223',
                    collection: '223',
                },
                {
                    images:require('@/assets/img/index.jpg'),
                    label: 'APP',
                    title: '智能家居设计',
                    download: '223',
                    collection: '223',
                },
                {
                    images:require('@/assets/img/index.jpg'),
                    label: 'APP',
                    title: '智能家居设计',
                    download: '223',
                    collection: '223',
                },
                {
                    images:require('@/assets/img/index.jpg'),
                    label: 'APP',
                    title: '智能家居设计',
                    download: '223',
                    collection: '223',
                },
                {
                    images:require('@/assets/img/index.jpg'),
                    label: 'APP',
                    title: '智能家居设计',
                    download: '223',
                    collection: '223',
                },
                {
                    images:require('@/assets/img/index.jpg'),
                    label: 'APP',
                    title: '智能家居设计',
                    download: '223',
                    collection: '223',
                },
                {
                    images:require('@/assets/img/index.jpg'),
                    label: 'APP',
                    title: '智能家居设计',
                    download: '223',
                    collection: '223',
                },
                {
                    images:require('@/assets/img/index.jpg'),
                    label: 'APP',
                    title: '智能家居设计',
                    download: '223',
                    collection: '223',
                }
            ],
        };
    },
    methods: {
        handleNav(id) {
            this.className = id;
        }
    },
    created() {
    }
};
</script>
<style lang="scss" scoped>
.personal{
    width: 100%;
    .banner{
        width: 100%;
        height: 404px;
        background: url("../../../assets/img/backdrop.png") no-repeat center;
        background-size: cover;
        position: relative;
        .banner_avatar{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            text-align: center;
            >img{
                width: 130px;
                height: 130px;
                border-radius: 50%;
                border: 4px solid #ffffff;
            }
            ul{
                li:first-child{
                    font-size: 28px;
                    font-family: Source Han Sans CN;
                    font-weight: bold;
                    color: #333333;
                    opacity: 1;
                    margin-top: 20px;
                    margin-bottom: 13px;
                }
                li:last-child{
                    font-size: 16px;
                    font-family: Source Han Sans CN;
                    font-weight: 400;
                    color: #666666;
                    opacity: 1;
                }
            }
            .banner_button{
                display: flex;
                div{
                    cursor: pointer;
                    width: 144px;
                    height: 50px;
                    border: 1px solid #000000;
                    opacity: 1;
                    border-radius: 114px;
                    margin-top: 24px;
                    text-align: center;
                    line-height: 50px;
                    font-size: 18px;
                }
                div:first-child{
                    margin-right: 48px;
                    background: #000000;
                    color: white;
                }
            }
        }
    }
    .main{
        margin: 0 auto;
        max-width: 1740px;
        min-width: 1200px;
        .main_title{
            height: 174px;
            display: flex;
            align-items: center;
            justify-content: center;
            ul{
                display: flex;
                li{
                    cursor: pointer;
                    border-radius: 44px;
                    line-height: 44px;
                    padding: 0 29px;
                    box-sizing: border-box;
                    font-size: 20px;
                    font-weight: 400;
                    color: #333333;
                    margin-right: 73px;
                }
                li:last-child{
                    margin-right: 0;
                }
                .active{
                    background: #FFF94B;
                    position: relative;
                }
                .active::after{
                    content: '';
                    width: 41px;
                    height: 4px;
                    background: #333333;
                    position: absolute;
                    top: 70px;
                    left: 50%;
                    transform: translateX(-50%);
                }
            }
        }
        .main_content{
            width: 100%;
            padding: 0 10px;
            box-sizing: border-box;
            .card{
                cursor: pointer;
                width: 25%;
                padding: 0 10px;
                margin-bottom: 50px;
                box-sizing: border-box;
                float: left;
                img{
                    width: 100%;
                    height: 303px;
                    border-radius: 14px;
                    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2);
                    transition: all 0.2s;
                }
                .card_footer{
                    height: 50px;
                    font-size: 18px;
                    color: #333333;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .card_footer_left{
                        span:last-child{
                            background: #D3D3D3;
                            font-size: 16px;
                            color: white;
                            padding: 4px 14px;
                            box-sizing: border-box;
                            border-radius: 20px;
                        }
                    }
                    .card_footer_right{
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        li{
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            font-size: 16px;
                            color: #333333;
                            margin-left: 10px;
                            img{
                                width: 18px;
                                height: 14px;
                            }
                        }
                        li:first-child{
                            margin-left: 0;
                        }
                    }
                }
            }
            .card:hover{
                img{
                    transition: all 1s;
                    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
                }
            }
        }
        .main_content::after{
            content: '';
            display: block;
            clear: both;
        }
    }
}

</style>

