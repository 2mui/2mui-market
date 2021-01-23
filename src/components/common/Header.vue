<template>
    <div class="header">
        <div class="header_logo">
            <div class="logo_warp">
                <img :src="require('@/assets/img/header_logo.png')" alt="">
                <span>二木UI</span>
            </div>
        </div>
        <div class="header_nav">
            <li @click="handleChange(item.id,item.path,item.name)" :class="item.id == className ? 'active' : ''" v-for="(item,index) in nav" :key="index">{{ item.name }}</li>
        </div>
        <div class="header_right">
            <div class="search">
                <el-dropdown>
                    <span class="el-dropdown-link">
                        全部
                        <img :src="require('@/assets/img/dropdown_bottom.png')" alt="">
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>网页设计</el-dropdown-item>
                        <el-dropdown-item>APP设计</el-dropdown-item>
                        <el-dropdown-item>插画</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <input type="text" placeholder="输入想要搜索的内容">
                <div class="search_buttom">
                    <img :src="require('@/assets/img/search.png')" alt="">
                </div>
            </div>
            <div class="header_avatar">
                <div class="avatar_warp">
                    <img :src="require('@/assets/img/girl.jpg')" alt="">
                    <ul>
                        <li v-for="(item,index) in dataList" :key="index"
                            @click="handleNav(item.path,item.name)">
                            <img :src="item.url" alt="">
                            {{ item.name }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            className: 0,
            nav:[
                {
                    id: 0,
                    path: '/index',
                    name: '首页'
                },
                {
                    id: 1,
                    path: '/formwork',
                    name: '网页设计'
                },
                {
                    id: 2,
                    path: '/formwork',
                    name: 'APP设计'
                },
                {
                    id: 3,
                    path: '/formwork',
                    name: 'Banner'
                },
                {
                    id: 4,
                    path: '/formwork',
                    name: '插画'
                },
                {
                    id: 5,
                    path: '/formwork',
                    name: '图标设计'
                },
                {
                    id: 6,
                    path: '/formwork',
                    name: '动画'
                },
                {
                    id: 7,
                    path: '/formwork',
                    name: '3D'
                },
            ],
            dataList: [
                {
                    path: '/homepage',
                    url: require('@/assets/img/man.png'),
                    name: '个人主页'
                },
                {
                    path: '/personal',
                    url: require('@/assets/img/collection.png'),
                    name: '我的收藏'
                },
                {
                    path: '/personal',
                    url: require('@/assets/img/browse.png'),
                    name: '浏览记录'
                },
                {
                    path: '/personal',
                    url: require('@/assets/img/download.png'),
                    name: '下载记录'
                },
                {
                    path: '/personal',
                    url: require('@/assets/img/download.png'),
                    name: '退出登录'
                }
            ]
        };
    },
    methods: {
        handleChange(id,path,name){
            this.className = id;
            if (path == '/index') {
                this.$router.push({
                    path:path
                })
            } else {
                this.$router.push({
                    path:path,
                    query: {id:id}
                })
            }
        },
        handleNav(path,name) {
            if (name == '个人主页') {
                this.$router.push({
                    path:path
                })
            } else if (name == '退出登录') {

            }
            else {
                this.$router.push({
                    path:path,
                    query: {name:name}
                })
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.header{
    width: 100%;
    height: 99px;
    background: white;
    border-bottom: 1px solid #E5E5E5;
    display: flex;
    justify-content: space-between;
    .header_logo{
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-left: 86px;
        box-sizing: border-box;
        .logo_warp{
            display: flex;
            align-items: center;
            span{
                margin-left: 16px;
                font-size: 24px;
                font-weight: bold;
                color: #333333;
                opacity: 1;
            }
        }
    }
    .header_nav{
        display: flex;
        align-items: center;
        li{
            cursor: pointer;
            border-radius: 44px;
            line-height: 44px;
            padding: 0 29px;
            box-sizing: border-box;
            font-size: 20px;
            font-weight: 400;
            color: #333333;
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
            top: 68px;
            left: 50%;
            transform: translateX(-50%);
        }
    }
    .header_right{
        display: flex;
        align-items: center;
        padding-right: 40px;
        box-sizing: border-box;
        .search{
            height: 50px;
            background: #FFFFFF;
            border: 1px solid #333333;
            opacity: 1;
            border-radius: 56px;
            margin-right: 30px;
            display: flex;
            align-items: center;
            /deep/{
                .el-dropdown{
                    cursor: pointer;
                    width: 90px;
                    padding: 0 15px;
                    box-sizing: border-box;
                    display: flex;
                    justify-content: center;
                    .el-dropdown-link{
                        font-size: 18px;
                        font-weight: 400;
                        color: #333333;
                        opacity: 1;
                    }
                }
            }
            >input{
                padding-right: 10px;
                box-sizing: border-box;
                width: 200px;
                height: 50px;
                border: none;
                outline: none;
                font-size: 18px;
                font-weight: 400;
                color: #333333;
            }
            >input::-webkit-input-placeholder{
                font-size: 16px;
                font-weight: 400;
                color: #999999;
                opacity: 1;
            }
            .search_buttom{
                cursor: pointer;
                width: 49px;
                height: 49px;
                border-radius: 50%;
                background: #FFF94B;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
        .header_avatar{
            width: 60px;
            height: 60px;
            .avatar_warp{
                cursor: pointer;
                >img{
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
                ul{
                    position: relative;
                    z-index: 9;
                    left: -100%;
                    display: none;
                    width: 150px;
                    background: #FFFFFF;
                    box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.16);
                    opacity: 1;
                    border-radius: 14px;
                    padding: 10px 10px;
                    box-sizing: border-box;
                    li{
                        text-align: center;
                        line-height: 40px;
                        border-radius: 14px;
                        background: #FFF94B;
                        margin-bottom: 5px;
                        font-size: 18px;
                        font-family: Source Han Sans CN;                        
                        font-weight: 400;
                        color: #333333;
                        img{
                            width: 18px;
                            height: 16px;
                        }
                    }
                }
            }
            .avatar_warp:hover{
                ul{
                    display: block;
                }
            }
        }
    }
}

</style>
<style lang="scss">
.el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover{
    background-color: #FFF94B;
    color: #333333;
}
</style>

