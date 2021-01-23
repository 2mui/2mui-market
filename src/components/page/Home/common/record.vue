<template>
    <div class="record">
        <div class="main_content">
            <div v-for="(item,index) in dataList" :key="index" class="card">
                <img class="img" :src="item.images" alt="">
                <div class="mould">
                    <div class="mould_warp">
                        <div class="dle" @click.stop="handleDel">
                            <i class="el-icon-delete"></i>
                        </div>
                    </div>
                </div>
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
        <el-dialog
            :visible.sync="dialogVisible"
            :show-close="false"
            width="600px">
            <span slot="title">删除</span>
            <span>
                <img :src="require('@/assets/img/question.png')" alt="" srcset="">
                确定删除此文件夹？
            </span>
            <span slot="footer" class="dialog-footer">
                <div>确定</div>
                <div @click="handleCancel">取消</div>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dialogVisible: false,
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
        },
        handleDel() {
            this.dialogVisible = true;
        },
        handleCancel() {
            this.dialogVisible = false;
        }
    },
    created() {
    }
};
</script>
<style lang="scss" scoped>
.record{
    width: 100%;
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
            position: relative;
            .img{
                width: 100%;
                height: 303px;
                border-radius: 14px;
                box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2);
                transition: all 0.2s;
            }
            .mould{
                display: none;
                width: 100%;
                height: 97px;
                padding: 0 10px;
                box-sizing: border-box;
                position: absolute;
                left: 0;
                top: 0;
                .mould_warp{
                    width: 100%;
                    height: 97px;
                    background: linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, rgba(128, 128, 128, 0) 100%);
                    opacity: 1;
                    border-radius: 14px;
                    padding: 20px 0 0 20px;
                    box-sizing: border-box;
                    .dle{
                        width: 40px;
                        height: 40px;
                        background: white;
                        border-radius: 50%;
                        text-align: center;
                        line-height: 40px;
                    }
                }
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
            .mould{
                display: block;
            }
        }
    }
    .main_content::after{
        content: '';
        display: block;
        clear: both;
    }
    /deep/{
        .el-dialog{
            border-radius: 14px;
            .el-dialog__header{
                text-align: center;
                padding: 20px 20px 20px;
                position: relative;
                span{
                    font-size: 24px;
                    font-weight: 400;
                    color: #333333;
                    position: relative;
                    z-index: 1;
                }
                span::after{
                    content: '';
                    width: 52px;
                    height: 25px;
                    background: #FFF94B;
                    position: absolute;
                    left: 50%;
                    bottom: -9px;
                    z-index: -1;
                    transform: translateX(-50%)
                }
            }
            .el-dialog__header::after{
                content: '';
                width: 80%;
                height: 1px;
                background: #D3D3D3;
                position: absolute;
                left: 50%;
                bottom: 0;
                transform: translateX(-50%)
            }
            .el-dialog__body{
                font-size: 18px;
                text-align: center;
                span{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    img{
                        margin-right: 20px;
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

</style>

