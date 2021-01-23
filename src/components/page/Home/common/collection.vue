<template>
    <div class="collection">
        <div class="main_content">
            <div @click="handleDetails()" v-for="(item,index) in dataList" :key="index" class="card">
                <img class="img" :src="item.images" alt="">
                <div class="mould">
                    <div class="mould_warp">
                        <div class="edit" @click.stop="handleEdit()">
                            <i class="el-icon-edit"></i>
                        </div>
                        <div class="dle" @click.stop="handleDel()">
                            <i class="el-icon-delete"></i>
                        </div>
                    </div>
                </div>
                <div class="card_footer">
                    <li class="card_footer_left"><span>{{ item.title }}</span><span>{{ item.label }}</span></li>
                </div>
            </div>
        </div>
        <el-dialog
            :visible.sync="dialogEdit"
            :show-close="false"
            width="600px">
            <span slot="title">编辑收藏夹名称</span>
            <span class="edit">
                <label>标题</label>
                <el-input v-model="title" clearable></el-input>
            </span>
            <span slot="footer" class="dialog-footer">
                <div>确定</div>
                <div @click="handleCancel">取消</div>
            </span>
        </el-dialog>
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
            dialogEdit: false,
            dialogVisible: false,
            title: '',
            dataList:[
                {
                    images:require('@/assets/img/index.jpg'),
                    label: '10',
                    title: '智能家居设计',
                    download: '223',
                    collection: '223',
                },
                {
                    images:require('@/assets/img/index.jpg'),
                    label: '10',
                    title: '智能家居设计',
                    download: '223',
                    collection: '223',
                },
                {
                    images:require('@/assets/img/index.jpg'),
                    label: '10',
                    title: '智能家居设计',
                    download: '223',
                    collection: '223',
                },
                {
                    images:require('@/assets/img/index.jpg'),
                    label: '10',
                    title: '智能家居设计',
                    download: '223',
                    collection: '223',
                },
                {
                    images:require('@/assets/img/index.jpg'),
                    label: '10',
                    title: '智能家居设计',
                    download: '223',
                    collection: '223',
                },
                {
                    images:require('@/assets/img/index.jpg'),
                    label: '10',
                    title: '智能家居设计',
                    download: '223',
                    collection: '223',
                },
                {
                    images:require('@/assets/img/index.jpg'),
                    label: '10',
                    title: '智能家居设计',
                    download: '223',
                    collection: '223',
                },
                {
                    images:require('@/assets/img/index.jpg'),
                    label: '10',
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
        handleEdit() {
            this.dialogEdit = true;
        },
        handleDel() {
            this.dialogVisible = true;
        },
        handleCancel() {
            this.dialogEdit = false;
            this.dialogVisible = false;
        },
        handleDetails() {
            this.$router.push({
                path: '/collection_details'
            })
        }
    },
    created() {
    }
};
</script>
<style lang="scss" scoped>
.collection{
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
                    display: flex;
                    div{
                        width: 40px;
                        height: 40px;
                        background: white;
                        border-radius: 50%;
                        text-align: center;
                        line-height: 40px;
                        margin-right: 20px;
                    }
                    div:last-child{
                        margin-right: 0;
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
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    span:last-child{
                        background: #000000;
                        opacity: 0.5;
                        font-size: 16px;
                        color: white;
                        padding: 4px 14px;
                        box-sizing: border-box;
                        border-radius: 20px;
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
                    width: 100%;
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
                display: flex;
                justify-content: center;
                span{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    img{
                        margin-right: 20px;
                    }
                }
                .edit{
                    width: 400px;
                    label{
                        width: 50px;
                        font-size: 18px;
                        color: #999999;
                    }
                    .el-input.is-active .el-input__inner, .el-input__inner:focus{
                        border-color: #DBDBDB;
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

