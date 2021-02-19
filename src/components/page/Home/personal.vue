<template>
  <div class="personal">
    <div class="banner">
      <div class="banner_mask">
        <div class="banner_avatar">
          <img :src="require('@/assets/img/girl.jpg')" alt="" />
          <ul>
            <li>{{ userInfo.login }}</li>
            <li>ID {{ userInfo.id }}</li>
          </ul>
          <div class="banner_button">
            <div @click="handleMyInfo">个人资料</div>
            <div>
              更多
              <img :src="require('@/assets/img/more.png')" alt="" srcset="" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="main_title">
        <ul>
          <li
            @click="handleNav(item.title)"
            v-for="(item, index) in navList"
            :class="className == item.title ? 'active' : ''"
            :key="index"
          >
            {{ item.title }}
          </li>
        </ul>
      </div>
      <Collection v-if="className == '我的收藏'" />
      <Record v-if="className == '浏览记录'" />
      <Download v-if="className == '下载记录'" />
    </div>
    <Footer :colorConfirm="colorConfirm" />
  </div>
</template>

<script>
import Footer from "../../common/Footer";
import Collection from "./common/collection";
import Record from "./common/record";
import Download from "./common/download";
export default {
  components: {
    Footer,
    Collection,
    Record,
    Download,
  },
  data() {
    return {
      className: "我的收藏",
      colorConfirm: "#F5F5F5",
      navList: [
        {
          id: 0,
          title: "我的收藏",
        },
        {
          id: 1,
          title: "浏览记录",
        },
        {
          id: 2,
          title: "下载记录",
        },
      ],
    };
  },
  watch: {
    $route: {
      handler() {
        this.className = this.$route.query.name;
      },
      deep: true,
    },
  },
  computed: {
    userInfo() {
      return window.$store.state.userInfo;
    },
  },
  methods: {
    handleMyInfo() {
      this.$router.push({
        path: "/homepage"
      });
    },
    handleNav(name) {
      this.$router.push({
        path: "/personal",
        query: { name: name },
      });
      this.className = name;
    },
  },
  created() {
    this.className = this.$route.query.name;
  },
};
</script>
<style lang="scss" scoped>
.personal {
  width: 100%;
  .banner {
    width: 100%;
    height: 404px;
    background: url("../../../assets/img/backdrop.png") no-repeat center;
    background-size: cover;
    .banner_mask {
      width: 100%;
      height: 100%;
      background: url("../../../assets/img/mask.png") no-repeat center;
      background-size: cover;
      position: relative;
      .banner_avatar {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        > img {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          border: 4px solid #ffffff;
        }
        ul {
          li:first-child {
            font-size: 28px;
            font-family: Source Han Sans CN;
            font-weight: bold;
            color: #333333;
            opacity: 1;
            margin-top: 20px;
            margin-bottom: 13px;
          }
          li:last-child {
            font-size: 16px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: #666666;
            opacity: 1;
          }
        }
        .banner_button {
          display: flex;
          div {
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
          div:first-child {
            margin-right: 48px;
            background: #000000;
            color: white;
          }
        }
      }
    }
  }
  .main {
    margin: 0 auto;
    max-width: 1740px;
    min-width: 1200px;
    .main_title {
      height: 174px;
      display: flex;
      align-items: center;
      justify-content: center;
      ul {
        display: flex;
        li {
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
        li:last-child {
          margin-right: 0;
        }
        .active {
          background: #fff94b;
          position: relative;
        }
        .active::after {
          content: "";
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
  }
}
</style>

