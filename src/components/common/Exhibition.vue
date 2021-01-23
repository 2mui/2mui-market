<template>
    <div class="exhibition">
        <el-dialog
            class="detalis"
            :visible.sync="dialogVisible"
            :show-close="false"
            top="0"
            width="1200">
            <span class="warp">
                <div class="warp_top">
                    <span>女神计划-社交APP</span>
                </div>
                <img :src="require('@/assets/img/details.png')" alt="" srcset="">
            </span>
            <span class="sidebar">
                <div class="sidebar_close">
                    <i class="el-icon-close"></i>
                </div>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dialogVisible: false,
        };
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
