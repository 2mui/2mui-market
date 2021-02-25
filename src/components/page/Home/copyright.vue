<template>
  <div class="copyright">
    <div class="main">
      <h3>版权声明</h3>
      <p>
        本站素材图片均来源于网络用户分享，在此只是方便用户相互分享学习交流和研究，提高技术技能。本站不具备充分的监控能力来审查图片是否存在侵权等情节。本站不拥有此类图片的版权，本站所有资源仅供学习研究与交流，不得用于任何商业用途的范围，用户应自觉遵守著作权法及其他相关法律的规定。
      </p>
      <p>
        本站鼓励用户对网站上的作品进行全面监督，当版权拥有者提出侵权指控并出示充分的版权证明材料时，本站会在第一时间对投诉举报进行核实，并及时清理侵权作品。
      </p>
      <p>
        本站作品模板内出现的任何摄影图、商品图、艺术字、人物肖像仅供作参考展示，不得用于商用，若擅自使用，后果将由使用者自行承担。
      </p>
      <p>
        本站会员所发评论言论仅代表网友自己，不代表本站观点，当用户的言论和行为侵犯了第三方的著作权或其他权利，责任在于用户本人，本站不承担任何法律责任。在本站发表言论的
        网友，我们认为用户已经知道并理解这一声明。
      </p>
      <p>内容由用户免费分享产生,如发现您的权益受到损害，请联系官方客服处理。</p>
      <p>
        如果版权拥有者发现自己作品被侵权，本站在收到相关举报后，若情况属实，会在24小时内采取删除、屏蔽、断开链接等措施来移除相关涉嫌侵权的内容。
      </p>
      <p>
        本站会员服务，只是购买服务器域名技术维护服务费，并不是购买素材的费用(本站不具有素材的版权)，会员账号只限本人使用，一旦发现账号异常，本站可以在不通知用户的情况下封号。只是为维护本站的运行而自愿支付的会员费用。
      </p>
      <p>
        所有下载的链接都是用百度网盘下载，介意的请勿加入，虚拟物品，不支持任何理由退款。
      </p>
      <p class="footer">版权投诉举报通道</p>
      <p class="footer">QQ:2050708081 (周一至周五 9:30—18:00)</p>
      <p class="footer">邮箱：2050708081@qq.com</p>
    </div>
    <Footer :colorConfirm="colorConfirm" />
  </div>
</template>

<script>
import Footer from "../../common/Footer";
export default {
  components: {
    Footer,
  },
  data() {
    return {
      colorConfirm: "#F5F5F5",
    };
  },
  methods: {},
  created() {},
};
</script>
<style lang="scss" scoped>
.copyright {
  .main {
    width: 1292px;
    margin: 0 auto;
    margin-bottom: 63px;
    h3 {
      font-size: 24px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      line-height: 41px;
      color: #333333;
      margin: 53px 0 48px 0;
      text-align: center;
    }
    p {
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      line-height: 24px;
      color: #666666;
      margin-bottom: 30px;
    }
    .footer {
      margin: 0;
    }
  }
}
</style>

