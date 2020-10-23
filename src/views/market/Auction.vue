<template>
  <div class="container">
    {{tabIndex}}
    <!-- 拍卖会列表 -->
    <div v-if="rtype==0">
      <h3>拍卖会列表</h3>
      <el-divider></el-divider>

      <div class="handle-box">
        <span>所属类型：</span>
        <el-select v-model="status" placeholder="请选择类型" class="handle-select mr10">
          <el-option label="全部" value="all"></el-option>
          <el-option v-for="(item,index) in stateList" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <span>拍卖会名称：</span>
        <el-input v-model="name" placeholder="请输入关键字" clearable class="handle-search mr10"></el-input>
        <el-button type="primary" class="handle-del mr10" @click="getAuction">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addAuction">新建</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
        <el-table-column prop="name" label="拍卖会标题" align="center"></el-table-column>
        <el-table-column prop="simpleName" label="排名公司名称" align="center"></el-table-column>
        <el-table-column prop="auctionTime" label="拍卖时间" align="center"></el-table-column>
        <el-table-column prop="dealRate" label="成交率" width="120" align="center"></el-table-column>
        <el-table-column prop="dealTotal" label="成交总额" width="120" align="center"></el-table-column>
        <el-table-column label="状态" width="120" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status==1">待预展</span>
            <span v-else-if="scope.row.status==2">预展中 </span>
            <span v-else-if="scope.row.status==3">待拍卖</span>
            <span v-else-if="scope.row.status==4">拍卖中</span>
            <span v-else>已结拍</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="updateAuction(scope.row)">查看</el-button>

          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total,sizes, prev, pager, next,jumper" :current-page="PageNumber"
          :page-size="PageSize" :total="pageTotal" @current-change="handlePageChange($event,1)"
          @size-change="handleSizeChange($event,1)"></el-pagination>
      </div>
    </div>
    <!-- 添加拍卖会 -->
    <div v-else-if="rtype==1">
      <div style="display: flex;align-items: center;margin-bottom: 20px;">
        <img src="~assets/img/goback.png" @click="$router.push('/auction')" class="mr10">
        <h3>添加拍卖会</h3>
      </div>
      <el-divider></el-divider>
      <auction-form :form="form" :companyList="companyList" :stateList="stateList"></auction-form>
    </div>
    <!-- 查看拍卖会 -->
    <div v-else-if="rtype==2">
      <div style="display: flex;align-items: center;margin-bottom: 20px;">
        <img src="~assets/img/goback.png" @click="$router.push('/auction')" class="mr10">
        <h3>编辑拍卖会</h3>
      </div>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <!-- 拍卖会信息 -->
        <el-tab-pane label="拍卖会信息" name="a1">
          <auction-form :form="form" :companyList="companyList" :stateList="stateList"></auction-form>
        </el-tab-pane>
        <!-- 拍卖会专场列表 -->
        <el-tab-pane label="专场列表" name="a2">
          <div class="handle-box">
            <span>拍卖会专场状态：</span>
            <el-select v-model="status" placeholder="请选择类型" class="handle-search mr10">
              <el-option label="全部" value="all"></el-option>
              <el-option v-for="(item,index) in stateList" :key="index" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
            <span>拍卖会专场名称：</span>
            <el-input v-model="name" placeholder="请输入关键字" clearable class="handle-search mr10"></el-input>
            <el-button type="primary" class="handle-del mr10" @click="getSpecials">搜索</el-button>
            <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addSpecials">新建</el-button>
          </div>
          <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
            <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
            <el-table-column prop="name" label="拍卖会专场名称" align="center"></el-table-column>
            <el-table-column prop="total" label="拍卖会专场封面" align="center">
              <template slot-scope="scope">
                <img :src="scope.row.coverPic" alt="">
              </template>
            </el-table-column>
            <el-table-column prop="total" label="拍卖数量" width="120" align="center"></el-table-column>
            <el-table-column prop="orders" label="排序" width="120" align="center"></el-table-column>
            <el-table-column label="状态" width="120" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.status==3">待拍卖</span>
                <span v-else-if="scope.row.status==4">拍卖中</span>
                <span v-else-if="scope.row.status==5">已结拍</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="300" align="center">
              <template slot-scope="scope">

                <el-button type="primary" size="mini" @click="updateSpecials(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination background layout="total,sizes, prev, pager, next,jumper" :current-page="PageNumber"
              :page-size="PageSize" :total="pageTotal" @current-change="handlePageChange($event,2)"
              @size-change="handleSizeChange($event,1)"></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 添加拍卖会专场 -->
    <div v-else-if="rtype==3">
      <div style="display: flex;align-items: center;margin-bottom: 20px;">
        <img src="~assets/img/goback.png" @click="$router.go(-1)" class="mr10">
        <h3>添加拍卖会专场</h3>
      </div>
      <el-divider></el-divider>
      <specials-form :form="specialsForm" :companyList="companyList" :stateList="stateList"></specials-form>
    </div>
    <!-- 查看拍卖会专场 -->
    <div v-else-if="rtype==4">
      <div style="display: flex;align-items: center;margin-bottom: 20px;">
        <img src="~assets/img/goback.png" @click="$router.push('/auction')" class="mr10">
        <h3>编辑拍卖会专场</h3>
      </div>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <!-- 拍卖会专场 信息 -->
        <el-tab-pane label="拍卖会专场信息" name="a1">
          <specials-form :form="form" :companyList="companyList" :stateList="stateList"></specials-form>
        </el-tab-pane>
        <!-- 拍品列表 -->
        <el-tab-pane label="拍品列表" name="a2">
          <div class="handle-box">
            <span>拍品状态：</span>
            <el-select v-model="lotStatus" placeholder="请选择类型" class="handle-select mr10">
              <el-option label="全部" value="all"></el-option>
              <el-option v-for="(item,index) in stateList" :key="index" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
            <span>拍品分类：</span>
            <el-cascader v-model="classCode" filterable clearable @expand-change="handleChange" :options="options"
              :props="prop" class="handle-select mr10">
            </el-cascader>
            <span>拍卖公司：</span>
            <el-select v-model="organCode" filterable placeholder="请选择类型" class="handle-select mr10">
              <el-option v-for="(item,index) in companyList" :key="index" :label="item.simpleName"
                :value="item.organCode">
              </el-option>
            </el-select>
            <span>拍品拍卖时间：</span>
            <el-date-picker v-model="date" type="daterange" value-format="yyyy-MM-dd" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期" class="handle-search mr10">
            </el-date-picker>
            <br>
            <span class="mt20">拍品名称：</span>
            <el-input v-model="lotName" placeholder="请输入关键字" clearable class="handle-search mr10 mt20"></el-input>
            <el-button type="primary" class="handle-del mr10 mt20" @click="getSpecials">搜索</el-button>
            <el-button type="primary" icon="el-icon-plus" class="handle-del mr10 mt20" @click="addLot">新建</el-button>
          </div>
          <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
            <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
            <el-table-column prop="name" label="拍卖会专场名称" align="center"></el-table-column>
            <el-table-column prop="total" label="拍卖会专场封面" align="center">
              <template slot-scope="scope">
                <img :src="scope.row.coverPic" alt="">
              </template>
            </el-table-column>
            <el-table-column prop="total" label="拍卖数量" width="120" align="center"></el-table-column>
            <el-table-column prop="orders" label="排序" width="120" align="center"></el-table-column>
            <el-table-column label="状态" width="120" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.status==3">待拍卖</span>
                <span v-else-if="scope.row.status==4">拍卖中</span>
                <span v-else-if="scope.row.status==5">已结拍</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="300" align="center">
              <template slot-scope="scope">

                <el-button type="primary" size="mini" @click="updateLot(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination background layout="total,sizes, prev, pager, next,jumper" :current-page="PageNumber"
              :page-size="PageSize" :total="pageTotal" @current-change="handlePageChange($event,2)"
              @size-change="handleSizeChange($event,1)"></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-else-if="rtype==5">
      <div style="display: flex;align-items: center;margin-bottom: 20px;">
        <img src="~assets/img/goback.png" @click="$router.push('/auction')" class="mr10">
        <h3>添加拍品</h3>
      </div>
      <el-divider></el-divider>
      <lot-form :form="form" :propClassList="prop" :companyList="companyList" :stateList="stateList"></lot-form>
    </div>

  </div>
</template>
<script>
  import AuctionForm from "components/auction/AuctionForm.vue";
  import SpecialsForm from "components/auction/SpecialsForm.vue";
  import LotForm from "components/auction/LotForm.vue";


  export default {
    data() {
      return {
        // 拍品
        date: [],
        classCode: [],
        organCode: "",
        lotStatus: "3",
        lotName: "",

        value: [],
        type: "all",
        query: {},
        name: "",
        status: "all",
        PageNumber: 1,
        PageSize: 10,
        pageTotal: 0,
        rtype: "",
        tableData: [],
        form: {
          picUrl: "",
          detailExtraInfo: [],
        },
        specialsForm: {
          coverPic: "",
          extraInfo: [],
          detailExtraInfo: [],
        },
        editVisible: false,
        isAdd: 0,
        title: '',
        rules: {
          type: [{ required: true, message: "请选择类型", trigger: "blur" }],
          dicName: [{ required: true, message: "请输入名称", trigger: "blur" }],
          orders: [{ required: true, message: "请输入排序", trigger: "blur" }],
        },
        companyList: [],
        stateList: [
          { id: "1", name: "待预展" },
          { id: "2", name: "预展中" },
          { id: "3", name: "待拍卖" },
          { id: "4", name: "拍卖中" },
          { id: "5", name: "已结拍" },
        ],
        activeName: "a1",
        options: [],
        prop: {
          label: 'name',
          value: 'classCode',
          children: 'children'
        },
        tabIndex: "0"

      };
    },
    watch: {
      $route(to, form) {
        this.getType()
      }
    },
    created() {
      this.getType()
    },
    methods: {
      getType() {
        this.getOneClassList()
        if (this.$route.query.rtype) {
          this.rtype = this.$route.query.rtype;
          this.getCompanyList()
        } else {
          this.rtype = 0;
          this.getAuction();
        }
        if (this.rtype == 2) {
          if (this.tabIndex == 0) {
            this.getAuctionInfo()
          } else {
            this.getSpecials()
          }
        }

        if (this.rtype == 4) {
          this.getOneClassList()
          this.getCompanyList()
          if (this.tabIndex == 0) {
            this.getSpecialsInfo()
          } else {
            this.getLot()
          }

        }
        if (this.rtype == 5) {
          if (this.$route.query.id) {
            this.getLotInfo()
          }
        }


      },
      getLotInfo() {
        this.$post("/market/showLot", { id: this.$route.query.id }).then(res => {
          if (res.code == 200) {

            this.form = res.data;
          }
        })
      },
      handleClick(tab) {
        this.PageNumber = 1;
        this.PageSize = 10;
        this.tabIndex = tab.index;
        if (this.rtype == 2) {
          if (tab.index == 0) {
            this.getAuctionInfo()
          } else if (tab.index == 1) {
            this.getSpecials()
          }
        } else if (this.rtype == 4) {
          if (tab.index == 0) {
            this.getSpecialsInfo()
          } else if (tab.index == 1) {

            this.getLot()
          }
        }

      },
      updateSpecials(row) {
        this.$router.push({ path: "auction", query: { rtype: 4, specialCode: row.specialCode, sessionCode: this.$route.query.sessionCode } })
      },
      updateLot(row) {
        this.$router.push({ path: "auction", query: { rtype: 5, specialCode: row.specialCode, sessionCode: this.$route.query.sessionCode, id: row.id } })

      },
      //获取公司列表
      getCompanyList() {
        this.$post("/market/getAllOrganList", { orders: "all" }).then(res => {
          if (res.code == 200) {
            this.companyList = res.data;
          }
        })
      },
      //获取一级分类
      getOneClassList() {
        this.$post("/market/getAllArtClassList", {
          type: 1,
        }).then(res => {
          if (res.code == 200) {
            this.options = res.data;
            this.options.forEach((item, index) => {
              this.$set(this.options[index], 'children', [])
            })
          }
        })
      },
      //获取二级分类
      handleChange(val) {
        console.log(val[0])
        this.$post("/market/getAllArtClassList", {
          type: 2,
          superior: val[0]
        }).then(res => {
          if (res.code == 200) {
            for (let i = 0; i < this.options.length; i++) {
              if (this.options[i].classCode === val[0]) {
                this.$set(this.options[i], 'children', res.data)
                break;
              }
            }

          }
        })
      },
      //获取拍卖会列表
      getAuction() {
        this.$post("/market/getAuction", {
          status: this.status,
          name: this.name,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.list;
            this.pageTotal = res.data.count;
          }
        })
      },
      //获取专场列表
      getSpecials() {
        this.$post("/market/getSpecials", {
          name: this.name,
          sessionCode: this.$route.query.sessionCode,
          status: this.status,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.list;
            this.pageTotal = res.data.count;
          }
        })
      },
      //获取拍品
      getLot() {
        this.$post("/market/getLot", {
          name: this.lotName,
          specialCode: this.$route.query.specialCode,
          classCodeOne: this.classCode[0],
          classCodeTwo: this.classCode[1],
          startdate: this.date[0],
          enddate: this.date[1],
          organCode: this.organCode,
          status: this.lotStatus,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.list;
            this.pageTotal = res.data.count;
          }
        })
      },
      //获取拍卖会详情
      getAuctionInfo() {
        this.$post("/market/showAuction", {
          sessionCode: this.$route.query.sessionCode
        }).then(res => {
          if (res.code == 200) {
            this.form = res.data;

          }
        })
      },

      //获取专场详情
      getSpecialsInfo() {
        this.$post("/market/showSpecials", {
          specialCode: this.$route.query.specialCode
        }).then(res => {
          if (res.code == 200) {
            this.form = res.data
          }
        })
      },

      //添加拍卖会
      addAuction() {
        this.$router.push({ path: "/auction", query: { rtype: 1 } })
        this.form = {
          picUrl: "",
          detailExtraInfo: [],
        }
      },
      //添加专场
      addSpecials() {
        this.$router.push({ path: "auction", query: { rtype: 3, sessionCode: this.$route.query.sessionCode } })
      },
      //添加拍品
      addLot(row) {

        this.$router.push({ path: "auction", query: { rtype: 5, sessionCode: this.$route.query.sessionCode, specialCode: this.$route.query.specialCode } })
        this.form = {
          coverPic: "",
          logoUrl: "",
          attribute: [],
          extraInfo: [],
          extraInfo2: []
        }
      },

      updateAuction(row) {
        this.$router.push({ path: "/auction", query: { rtype: 2, sessionCode: row.sessionCode } })
      },
      // 分页导航
      handlePageChange(val) {
        console.log(val)
        this.PageNumber = val;
        this.getAuction();
      },
      handleSizeChange(val) {
        this.PageSize = val;
        this.getAuction();
      }

    },
    components: {
      AuctionForm,
      SpecialsForm,
      LotForm
    }
  };
</script>

<style lang="scss" scoped>
  .text {
    color: #6a6a6a;

  }

  .handle-box {
    margin-bottom: 20px;
  }

  .handle-select {
    width: 200px;
  }

  .handle-input {
    width: 300px;
    display: inline-block;
  }

  .handle-search {
    width: 300px;
  }

  .mr10 {
    margin-right: 10px;

  }

  .mt20 {
    margin-top: 20px;
  }

  .table {
    width: 100%;
    font-size: 14px;
  }

  .img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .el-form h2 {

    font-weight: 400;
    font-size: 18px;
    padding: 5px 0 15px;
  }
</style>