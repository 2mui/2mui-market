<template>
    <div class="exhibition">
        <el-dialog
            class="detalis"
            :visible.sync="dialogVisible"
            :show-close="false"
            :close-on-click-modal="false"
            top="0"
            width="1180px">
            <span class="warp">
                <div class="warp_top">
                    <span>女神计划-社交APP</span>
                </div>
                <img :src="require('@/assets/img/details.png')" alt="" srcset="">
                <div class="warp_footer">
                    <p>相关推荐</p>
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
                </div>
            </span>
            <span class="sidebar">
                <div class="sidebar_buttom">
                    <div class="close">
                        <div>
                            <i class="el-icon-close" @click="handleClose"></i>
                        </div>
                    </div>
                    <div class="list">
                        <div>
                            <img :src="require('@/assets/img/collection2.png')" alt="" srcset="">
                        </div>
                        <p>235人收藏</p>
                    </div>
                    <div class="list">
                        <div>
                            <img :src="require('@/assets/img/download2.png')" alt="" srcset="">
                        </div>
                        <p>235人下载</p>
                    </div>
                    <div class="list">
                        <div>
                            <i class="el-icon-arrow-right"></i>
                        </div>
                        <p>下一个</p>
                    </div>
                    <div class="list">
                        <div>
                            <i class="el-icon-arrow-right"></i>
                        </div>
                        <p>上一个</p>
                    </div>
                </div>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dialogVisible: true,
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
                }
            ]
        };
    },
    methods: {
        handleClose() {
            this.$parent.isDetails = false;
        }
    },
    created() {
    }
};
</script>
<style lang="scss" scoped>
.exhibition{
    /deep/{
        .detalis{
            .el-dialog{
                border-radius: 0;
                background: none;
                box-shadow: none;
                .el-dialog__header{
                    padding: 0;
                }
                .el-dialog__body{
                    width: 100%;
                    padding: 0;
                    display: flex;
                    .warp{
                        width: 1000px;
                        img{
                            width: 100%;
                        }
                        .warp_top{
                            width: 100%;
                            height: 100px;
                            line-height: 100px;
                            font-size: 24px;
                            font-weight: bold;
                            color: #FFFFFF;
                        }
                        .warp_footer{
                            p{
                                padding: 30px 0 20px 0;
                                font-size: 20px;
                                font-weight: 400;
                                color: #FFFFFF;
                            }
                            .main_content{
                                width: 100%;
                                box-sizing: border-box;
                                .card{
                                    cursor: pointer;
                                    width: 33%;
                                    padding: 0 10px;
                                    margin-bottom: 50px;
                                    box-sizing: border-box;
                                    float: left;
                                    img{
                                        width: 100%;
                                        height: 200px;
                                        border-radius: 14px;
                                        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2);
                                        transition: all 0.2s;
                                    }
                                    .card_footer{
                                        height: 50px;
                                        font-size: 14px;
                                        color: #ffffff;
                                        display: flex;
                                        align-items: center;
                                        justify-content: space-between;
                                        .card_footer_left{
                                            span:last-child{
                                                background: #D3D3D3;
                                                font-size: 12px;
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
                                                font-size: 14px;
                                                color: #ffffff;
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
                    .sidebar{
                        width: 200px;
                        .sidebar_close{
                            cursor: pointer;
                            width: 100%;
                            height: 100px;
                            line-height: 100px;
                            text-align: center;
                            font-size: 24px;
                            color: #FFFFFF;
                        }
                        .sidebar_buttom{
                            height: 768px;
                            padding-left: 47px;
                            box-sizing: border-box;
                            position: fixed;
                            .close{
                                margin-bottom: 50px;
                                div{
                                    cursor: pointer;
                                    width: 76px;
                                    height: 76px;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    i{
                                        font-size: 24px;
                                        color: #FFFFFF;
                                        font-weight: bold;
                                    }
                                }
                            }
                            .list{
                                color: white;
                                margin-bottom: 50px;
                                div{
                                    cursor: pointer;
                                    width: 76px;
                                    height: 76px;
                                    border-radius: 50%;
                                    background: white;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    img{
                                        width: 30px;
                                    }
                                    i{
                                        color: #666666;
                                        font-size: 30px;
                                        font-weight: bold;
                                    }
                                }
                                p{
                                    text-align: center;
                                    margin-top: 10px;
                                    font-size: 16px;
                                }
                            }
                            .list:nth-child(2){
                                margin-top: 150px;
                            }
                            .list:nth-child(4){
                                margin-top: 100px;
                            }
                        }
                    }
                }
                .el-dialog__footer{
                    text-align: center;
                    .dialog-footer{
                        div{
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
                        div:last-child{
                            background: white;
                            color: #000000;
                        }
                    }
                }
            }
        }
    }
}
</style>
