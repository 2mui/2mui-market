<template>
  <div class="footer" :style="{ background: colorConfirm }">
    <div class="footer_top">
      <div class="footer_list logo">
        <div class="footer_logo">
          <img :src="require('@/assets/img/footer_logo.png')" alt="" />
          <span>二木素材</span>
        </div>
      </div>
      <div class="footer_list footer_link">
        <li>
          <span>关于我们</span
          ><router-link tag="span" to="/copyright">版权声明</router-link
          ><router-link tag="span" to="/privacy">隐私政策</router-link>
        </li>
      </div>
      <div class="footer_list footer_link">
        <li>
          <span>友情链接</span>
          <span v-for="(item, index) in dataList" :key="index">
            <a :href="item.url" target="_blank" rel="noopener noreferrer">{{
              item.title
            }}</a>
          </span>
        </li>
      </div>
      <div class="footer_list footer_contact">
        <div>
          <li>
            <span>联系我们</span>
            <img :src="require('@/assets/img/footer_qq.png')" alt="" />
            <span>2050708081</span>
          </li>
        </div>
      </div>
    </div>
    <div class="footer_bottom">
      <p>
        本站素材图片均来源于网络用户分享，本站所有资源仅供学习研究与交流，不得用于任何商业用途的范围
      </p>
      <p>©2021 本站若侵犯了您的合法权益，请联系站长删除！</p>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
export default {
  data() {
    return {
      dataList: [],
    };
  },
  props: {
    colorConfirm: {
      type: String,
      default() {
        return "";
      },
    },
  },
  methods: {
    // 友情链接
    handleLinks() {
      this.$apollo
        .query({
          query: gql`
            {
              links {
                id
                position
                title
                updated_at
                url
                created_at
              }
            }
          `,
          fetchPolicy: "no-cache",
        })
        .then((data) => {
          this.dataList = data.data.links;
        });
    },
  },
  created() {
    this.handleLinks();
  },
};
</script>
<style lang="scss" scoped>
.footer {
  width: 100%;
  .footer_top {
    padding: 44px 0 90px 0;
    display: flex;
    align-items: center;
    .footer_list {
      height: 50px;
      flex: 1;
      display: flex;
      align-items: center;
      .footer_logo {
        display: flex;
        align-items: center;
        img {
          width: 42px;
          height: 42px;
          margin-right: 27px;
        }
        span {
          font-size: 24px;
          font-weight: bold;
          color: #333333;
          opacity: 1;
        }
      }
    }
    .logo {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .footer_link {
      border-left: 1px solid #cfcfcf;
      padding: 0 40px;
      box-sizing: border-box;
      li {
        font-size: 18px;
        font-weight: 400;
        color: #333333;
        opacity: 1;
        a {
          color: #333333;
        }
        span:first-child {
          font-size: 18px;
          font-weight: bold;
          color: #333333;
        }
        span {
          cursor: pointer;
          margin-right: 30px;
          margin-bottom: 18px;
        }
      }
    }
    .footer_link:nth-child(3) {
      flex: 1.4;
    }
    .footer_contact {
      border-left: 1px solid #cfcfcf;
      padding-left: 40px;
      box-sizing: border-box;
      display: flex;
      div {
        flex: 1;
        li {
          font-size: 18px;
          font-weight: 400;
          color: #333333;
          opacity: 1;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          img {
            width: 18px;
            height: 24px;
          }
          span:first-child {
            font-size: 18px;
            font-weight: bold;
            color: #333333;
          }
          span {
            cursor: pointer;
            margin-right: 30px;
            margin-left: 5px;
          }
        }
      }
    }
  }
  .footer_bottom {
    font-size: 18px;
    font-weight: 400;
    text-align: center;
    color: #333333;
    opacity: 1;
    padding-bottom: 20px;
    p:nth-child(1) {
      margin-bottom: 20px;
    }
  }
}
</style>

