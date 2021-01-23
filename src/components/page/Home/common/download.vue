<template>
    <div class="download">
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
</template>

<script>
export default {
    data() {
        return {
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
.download{
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
            .img{
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

</style>

