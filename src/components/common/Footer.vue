<template>
  <div class="footer" :style="{ background: colorConfirm }">
    <div class="footer_top">
      <div class="footer_list logo">
        <div class="footer_logo">
          <img :src="require('@/assets/img/footer_logo.png')" alt="" />
          <span>二木UI</span>
        </div>
      </div>
      <div class="footer_list footer_link">
        <p>关于我们</p>
        <li><span>版权声明</span><span>版权声明</span></li>
        <li><span>隐私政策</span><span>隐私政策</span></li>
      </div>
      <div class="footer_list footer_link">
        <p>友情链接</p>
        <li>
          <span v-for="(item, index) in dataList" :key="index">
            <a :href="item.url" target="_blank" rel="noopener noreferrer">{{
              item.title
            }}</a>
          </span>
        </li>
        <!-- <li><span>二木设计</span><span>二木设计</span></li> -->
      </div>
      <div class="footer_list footer_contact">
        <div>
          <p>联系我们</p>
          <li>
            <img :src="require('@/assets/img/footer_phone.png')" alt="" />
            <span>1346687899</span>
          </li>
          <li>
            <img :src="require('@/assets/img/we_chat.png')" alt="" />
            <span>1346687899</span>
          </li>
        </div>
        <div>
          <img :src="require('@/assets/img/footer_qr.png')" alt="" />
          <p>扫描二维码关注公众号</p>
        </div>
      </div>
    </div>
    <div class="footer_bottom">©2021版权所有</div>
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
    padding: 57px 0 63px 0;
    display: flex;
    align-items: center;
    .footer_list {
      height: 123px;
      flex: 1;
      .footer_logo {
        display: flex;
        align-items: center;
        img {
          width: 94px;
          height: 94px;
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
      p {
        font-size: 20px;
        font-weight: bold;
        color: #333333;
        opacity: 1;
        margin-bottom: 32px;
      }
      li {
        width: 220px;
        font-size: 18px;
        font-weight: 400;
        color: #333333;
        opacity: 1;
        a {
          color: #333333;
        }
        span {
          cursor: pointer;
          margin-right: 30px;
          margin-bottom: 18px;
        }
      }
    }
    .footer_contact {
      border-left: 1px solid #cfcfcf;
      padding-left: 40px;
      box-sizing: border-box;
      display: flex;
      div {
        flex: 1;
        p {
          font-size: 20px;
          font-weight: bold;
          color: #333333;
          opacity: 1;
          margin-bottom: 32px;
        }
        li {
          font-size: 18px;
          font-weight: 400;
          color: #333333;
          opacity: 1;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          span {
            cursor: pointer;
            margin-right: 30px;
            margin-left: 5px;
          }
        }
      }
      div:last-child {
        p {
          font-size: 12px;
          font-weight: 400;
          color: #999999;
          opacity: 1;
        }
      }
    }
  }
  .footer_bottom {
    display: flex;
    justify-content: center;
    font-size: 18px;
    font-weight: 400;
    color: #999999;
    opacity: 1;
    padding-bottom: 20px;
  }
}
</style>

