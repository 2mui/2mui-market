<template>
  <div class="formwork">
    <div class="banner">
      <img :src="require('@/assets/img/banner.jpg')" alt="" />
    </div>
    <div class="main">
      <div class="main_search">
        <div class="search_list">
          <label class="label">{{ radioList1.label }}</label>
          <el-radio-group @change="industryChange" v-model="radio1">
            <el-radio-button
              v-for="(item, index) in radioList1.arr"
              :key="index"
              :label="item"
            ></el-radio-button>
          </el-radio-group>
        </div>
        <div class="search_list">
          <label class="label">{{ radioList2.label }}</label>
          <el-radio-group @change="formatChange" v-model="radio2">
            <el-radio-button
              v-for="(item, index) in radioList2.arr"
              :key="index"
              :label="item"
            ></el-radio-button>
          </el-radio-group>
        </div>
        <div class="search_list">
          <label class="label">{{ radioList3.label }}</label>
          <el-radio-group @change="sortChange" v-model="radio3">
            <el-radio-button
              v-for="(item, index) in radioList3.arr"
              :key="index"
              :label="item"
            ></el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="main_content">
        <div v-for="(item, index) in dataList" :key="index" class="card">
          <img class="img" :src="item.images" alt="" />
          <div class="card_footer">
            <li class="card_footer_left">
              <span>{{ item.title }}</span
              ><span>{{ item.label }}</span>
            </li>
            <div class="card_footer_right">
              <li>
                <img
                  :src="require('@/assets/img/download.png')"
                  alt=""
                  srcset=""
                />
                {{ item.download }}
              </li>
              <li>
                <img
                  :src="require('@/assets/img/collection.png')"
                  alt=""
                  srcset=""
                />
                {{ item.collection }}
              </li>
            </div>
          </div>
        </div>
      </div>
      <div class="main_footer">
        <div class="main_footer_warp">
          <el-button>首页</el-button>
          <el-button>上一页</el-button>
          <el-pagination background layout="pager" :page-size="10" :total="50">
          </el-pagination>
          <el-button>下一页</el-button>
          <el-button>尾页</el-button>
        </div>
      </div>
    </div>
    <Footer :colorConfirm="colorConfirm" />
  </div>
</template>

<script>
import Footer from "../../common/Footer";
import gql from "graphql-tag";
export default {
  components: {
    Footer,
  },
  metaInfo() {
    return {
      title: "素材",
      id: "",
      meta: [
        { name: "keywords", content: "this.description" },
        { name: "description", content: "this.description" },
      ],
    };
  },
  data() {
    return {
      colorConfirm: "#F5F5F5",
      radio1: "全部",
      radio2: "PSD",
      radio3: "全部",
      radioList1: {
        label: "行业",
        arr: ["全部", "电商", "社交", "影音", "医疗"],
      },
      radioList2: {
        label: "格式",
        arr: ["PSD", "AI", "XD", "Sketch"],
      },
      radioList3: {
        label: "排序",
        arr: ["全部", "推荐", "最新", "最热", "下载量"],
      },
      dataList: [
        {
          images: require("@/assets/img/index.jpg"),
          label: "APP",
          title: "智能家居设计",
          download: "223",
          collection: "223",
        },
        {
          images: require("@/assets/img/index.jpg"),
          label: "APP",
          title: "智能家居设计",
          download: "223",
          collection: "223",
        },
        {
          images: require("@/assets/img/index.jpg"),
          label: "APP",
          title: "智能家居设计",
          download: "223",
          collection: "223",
        },
        {
          images: require("@/assets/img/index.jpg"),
          label: "APP",
          title: "智能家居设计",
          download: "223",
          collection: "223",
        },
        {
          images: require("@/assets/img/index.jpg"),
          label: "APP",
          title: "智能家居设计",
          download: "223",
          collection: "223",
        },
        {
          images: require("@/assets/img/index.jpg"),
          label: "APP",
          title: "智能家居设计",
          download: "223",
          collection: "223",
        },
        {
          images: require("@/assets/img/index.jpg"),
          label: "APP",
          title: "智能家居设计",
          download: "223",
          collection: "223",
        },
        {
          images: require("@/assets/img/index.jpg"),
          label: "APP",
          title: "智能家居设计",
          download: "223",
          collection: "223",
        },
      ],
      // 排序搜索条件
      sortWhere: "",
      sortOrder: "",
    };
  },
  watch: {
    $route: {
      handler() {
        this.id = this.$route.query.id;
        this.sortWhere = "";
        this.sortOrder = "";
        this.getDataList(this.id, this.sortWhere, this.sortOrder);
      },
      deep: true,
    },
  },
  methods: {
    industryChange(val) {
      this.radio1 = val;
      console.log(val);
    },
    formatChange(val) {
      this.radio2 = val;
      console.log(val);
    },
    sortChange(val) {
      this.radio3 = val;
      this.sortWhere = "";
      this.sortOrder = "";
      if (this.radio3 == "推荐") {
        this.sortWhere = "featured: {_eq: true}";
      } else if (this.radio3 == "最新") {
        this.sortOrder = "created_at: desc";
      } else if (this.radio3 == "最热") {
        this.sortOrder = "likes_count: desc";
      } else if (this.radio3 == "下载量") {
        this.sortOrder = "downloads_count: desc";
      }
      console.log(val);
      this.getDataList(this.id, this.sortWhere, this.sortOrder);
    },
    getDataList(id, sortWhere, sortOrder) {
      this.$apollo
        .query({
          query: gql`
            {
              items(where: { category_id: { _eq: ${id} },${sortWhere} }, order_by: {${sortOrder}}) {
                category_id
                id
                title
              }
            }
          `,
          fetchPolicy: "no-cache",
        })
        .then((data) => {
          console.log(data);
        });
    },
  },
  created() {
    this.id = this.$route.query.id;
    this.getDataList(this.id, this.sortWhere, this.sortOrder);
  },
};
</script>
<style lang="scss" scoped>
.formwork {
  width: 100%;
  img {
    width: 100%;
  }
  .main {
    margin: 0 auto;
    max-width: 1740px;
    min-width: 1200px;
    .main_search {
      padding: 50px 20px;
      box-sizing: border-box;
      .search_list {
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        .label {
          font-size: 16px;
          font-weight: 400;
          color: #666666;
          margin-right: 60px;
        }
        /deep/ {
          .el-radio-group {
            .el-radio-button .el-radio-button__inner {
              border-radius: 100px;
            }
            .el-radio-button__orig-radio:checked + .el-radio-button__inner {
              background: #fff94b;
              color: #333333;
              border-color: #fff94b;
              box-shadow: none;
            }
            .el-radio-button__inner {
              border: none;
            }
            .el-radio-button__inner:hover {
              color: #333333;
            }
            .el-radio-button--small .el-radio-button__inner {
              padding: 14px 33px;
              font-size: 16px;
              font-weight: 400;
              color: #333333;
            }
          }
        }
      }
      .search_list:last-child {
        margin-bottom: 0;
      }
    }
    .main_content {
      width: 100%;
      padding: 0 10px;
      box-sizing: border-box;
      .card {
        cursor: pointer;
        width: 25%;
        padding: 0 10px;
        margin-bottom: 50px;
        box-sizing: border-box;
        float: left;
        img {
          width: 100%;
          height: 303px;
          border-radius: 14px;
          box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2);
          transition: all 0.2s;
        }
        .card_footer {
          height: 50px;
          font-size: 18px;
          color: #333333;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .card_footer_left {
            span:last-child {
              background: #d3d3d3;
              font-size: 16px;
              color: white;
              padding: 4px 14px;
              box-sizing: border-box;
              border-radius: 20px;
            }
          }
          .card_footer_right {
            display: flex;
            align-items: center;
            justify-content: space-between;
            li {
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-size: 16px;
              color: #333333;
              margin-left: 10px;
              img {
                width: 18px;
                height: 14px;
              }
            }
            li:first-child {
              margin-left: 0;
            }
          }
        }
      }
      .card:hover {
        img {
          transition: all 1s;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
        }
      }
    }
    .main_content::after {
      content: "";
      display: block;
      clear: both;
    }
    .main_footer {
      margin-bottom: 50px;
      display: flex;
      justify-content: center;
      .main_footer_warp {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        /deep/ {
          .el-button:focus,
          .el-button:hover {
            background: #fff94b;
            border-color: #fff94b;
            color: #333333;
          }
          .el-button--small,
          .el-button--small.is-round {
            height: 40px;
            padding: 2px 15px;
          }
          .el-pager li {
            width: 38px;
            height: 38px;
            line-height: 38px;
            color: #333333;
          }
          .el-pagination.is-background .el-pager li:not(.disabled).active {
            background: #fff94b;
            border: none;
          }
          .el-pagination.is-background .el-pager li:not(.disabled):hover {
            background: #fff94b;
            color: #333333;
          }
          .el-pagination.is-background .btn-next,
          .el-pagination.is-background .btn-prev,
          .el-pagination.is-background .el-pager li {
            background: white;
            border: 1px solid #c3c3c3;
          }
        }
      }
    }
  }
}
</style>

