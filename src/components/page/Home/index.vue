<template>
    <div class="home">
        <div class="banner">
            <img :src="require('@/assets/img/banner.jpg')" alt="">
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
                    <img class="img" :src="item.images" alt="">
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
            <div class="main_footer">
                <div class="main_footer_warp">
                    <el-button>首页</el-button>
                    <el-button>上一页</el-button>
                    <el-pagination
                        background
                        layout="pager"
                        :page-size="10"
                        :total="50">
                    </el-pagination>
                    <el-button>下一页</el-button>
                    <el-button>尾页</el-button>
                </div>
            </div>
        </div>
        <div class="partners_warp">
            <div class="partners">
                <div class="partners_title">
                    <li>合作伙伴</li>
                </div>
                <div class="partners_content">
                    <div class="card" v-for="(item,index) in partnerList" :key="index">
                        <div class="card_list">
                            <img class="img" :src="item.images" alt="">
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
import gql from "graphql-tag";

const Dataitems = gql`
  {
    items {
        id
        title
        url
        updated_at
        industry
        featured
        detail
        description
        created_at
        cover
        category
        author
    }
  }
`;
export default {
    name: 'home',
    components: {
        Footer
    },
    data() {
        return {
            colorConfirm: '#ffffff',
            className: 0,
            navList:[
                {
                    id: 0,
                    title: '热门'
                },
                {
                    id: 1,
                    title: '最新'
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
            partnerList: [
                {
                    id: 0,
                    images:require('@/assets/img/partner.png'),
                },
                {
                    id: 1,
                    images:require('@/assets/img/partner.png'),
                },
                {
                    id: 2,
                    images:require('@/assets/img/partner.png'),
                },
                {
                    id: 3,
                    images:require('@/assets/img/partner.png'),
                },
                {
                    id: 4,
                    images:require('@/assets/img/partner.png'),
                },
                {
                    id: 5,
                    images:require('@/assets/img/partner.png'),
                },
                {
                    id: 6,
                    images:require('@/assets/img/partner.png'),
                },
                {
                    id: 7,
                    images:require('@/assets/img/partner.png'),
                }
            ]
        };
    },
    computed: {

    },
    methods: {
        handleNav(id) {
            this.className = id;
        }
    },
    apollo: {
        items() {
            return {
                query: Dataitems,
                update(data) {
                    console.log(data)
                }
            };
        }
    }
};
</script>


<style lang="scss" scoped>
.home{
    width: 100%;
    img{
        width: 100%;
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
        .main_footer{
            margin-bottom: 50px;
            display: flex;
            justify-content: center;
            .main_footer_warp{
                display: flex;
                justify-content: center;
                align-items: flex-end;
                /deep/{
                    .el-button:focus, .el-button:hover{
                        background: #FFF94B;
                        border-color: #FFF94B;
                        color: #333333;
                    }
                    .el-button--small, .el-button--small.is-round{
                        height: 40px;
                        padding: 2px 15px;
                    }
                    .el-pager li{
                        width: 38px;
                        height: 38px;
                        line-height: 38px;
                        color: #333333;
                    }
                    .el-pagination.is-background .el-pager li:not(.disabled).active{
                        background: #FFF94B;
                        border: none;
                    }
                    .el-pagination.is-background .el-pager li:not(.disabled):hover{
                        background: #FFF94B;
                        color: #333333;
                    }
                    .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li{
                        background: white;
                        border: 1px solid #C3C3C3;
                    }
                }
            }
        }
    }
    .partners_warp{
        width: 100%;
        background: #F5F5F5;
        .partners{
            margin: 0 auto;
            max-width: 1740px;
            min-width: 1200px;
            .partners_title{
                height: 174px;
                display: flex;
                align-items: center;
                justify-content: center;
                li{
                    font-size: 30px;
                    font-weight: 400;
                    color: #333333;
                    position: relative;
                }
                li::after{
                    content: '';
                    width: 121px;
                    height: 2px;
                    background: #333333;
                    opacity: 1;
                    position: absolute;
                    top: 56px;
                    left: 0;
                }
            }
            .partners_content{
                width: 100%;
                padding: 0 10px;
                box-sizing: border-box;
                .card{
                    width: 25%;
                    padding: 0 10px;
                    margin-bottom: 50px;
                    box-sizing: border-box;
                    float: left;
                    .card_list{
                        height: 140px;
                        background: #FFFFFF;
                        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.07);
                        opacity: 0.8;
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        img{
                            width: 160px;
                            height: 70px;
                            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2);
                            transition: all 0.2s;
                        }
                    }
                }
            }
            .partners_content::after{
                content: '';
                display: block;
                clear: both;
            }
        }
    }
}

</style>
