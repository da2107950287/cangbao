<template>
  <div class="container">
    <div v-if="type==0">
      <h3>用户列表</h3>
      <el-divider></el-divider>

      <div class="handle-box">
        <span>状态：</span>
        <el-select v-model="state" placeholder="请选择类型" class="handle-search mr10">
          <el-option label="全部" value="all"></el-option>
          <el-option v-for="(item,index) in stateList" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <span>注册时间：</span>
        <el-date-picker v-model="daterange" type="daterange" value-format="yyyy-MM-dd" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期" class="mr10">
        </el-date-picker>
        <span>手机号：</span>
        <el-input v-model="account" placeholder="请输入手机号" class="handle-search mr10" clearable></el-input>
        <el-button type="primary" class="handle-del mr10" @click="getUser">搜索</el-button>
        <!-- <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addCircle">新建</el-button> -->
      </div>
      <el-table v-loading="loading" :data="tableData" border class="table" ref="multipleTable"
        header-cell-class-name="table-header">
        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
        <el-table-column prop="uid" label="用户ID" align="center"></el-table-column>
        <el-table-column prop="account" label="手机号" align="center"></el-table-column>
        <el-table-column prop="nickname" label="昵称" align="center"></el-table-column>
        <el-table-column prop="registertime" label="注册时间" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.state==1">正常</span>
            <span v-else>异常</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="400" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="updateUserState(scope.row)">
              <span v-if="scope.row.state==1">冻结</span>
              <span v-else>解冻</span>
            </el-button>
            <el-button type="primary" size="mini" @click="viewUser(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total,sizes, prev, pager, next,jumper" :current-page="PageNumber"
          :page-size="PageSize" :total="pageTotal" @current-change="handlePageChange($event,1)"
          @size-change="handleSizeChange($event,1)"></el-pagination>
      </div>
    </div>

    <div v-else-if="type==2">
      <div style="display: flex;align-items: center;" class="mb20">
        <img src="../../assets/img/goback.png" @click="$router.push('/user')" class="mr10">
        <h3>编辑用户</h3>
      </div>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="1" class="info">
          <el-form :model="form" style="padding-left: 30px;">
            <el-form-item label="用户ID：">
              <div>{{form.uid}}</div>
            </el-form-item>
            <el-form-item label="昵称：">
              <div>{{form.nickname}}</div>
            </el-form-item>
            <el-form-item label="手机号：">
              <div>{{form.account}}</div>
            </el-form-item>
            <el-form-item label="注册时间：">
              <div>{{form.registertime}}</div>
            </el-form-item>
            <el-form-item label="状态：">
              <div v-if="form.state==1">有效</div>
              <div v-else>无效</div>
            </el-form-item>

            <el-form-item label="用户头像：">
              <img :src="form.headportrait" class="img60">
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="$router.push('/user')">返回</el-button>

            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="动态" name="2">

          <el-table v-loading="loading" :data="tableData" class="table" ref="multipleTable"
            header-cell-class-name="table-header">
            <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
            <el-table-column prop="content" label="发布内容" align="left" show-overflow-tooltip></el-table-column>
            <el-table-column prop="commentNumber" label="评论数量" width="180" align="center"></el-table-column>
            <el-table-column prop="clickNumber" label="点击数量" width="180" align="center"></el-table-column>
            <el-table-column prop="collNumber" label="收藏数量" width="180" align="center"></el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination background layout="total,sizes, prev, pager, next,jumper" :current-page="PageNumber"
              :page-size="PageSize" :total="pageTotal" @current-change="handlePageChange($event,2)"
              @size-change="handleSizeChange($event,2)"></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="圈子" name="3">
          <el-table v-loading="loading" :data="tableData" class="table" ref="multipleTable"
            header-cell-class-name="table-header">
            <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
            <el-table-column prop="cirType" label="圈子类型" width="160" align="center"></el-table-column>
            <el-table-column prop="cirName" label="圈子名称" width="160" align="center"></el-table-column>
            <el-table-column prop="cirTime" label="创建时间" align="center"></el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination background layout="total,sizes, prev, pager, next,jumper" :current-page="PageNumber"
              :page-size="PageSize" :total="pageTotal" @current-change="handlePageChange($event,3)"
              @size-change="handleSizeChange($event,3)"></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="课程" name="4">
          <el-table v-loading="loading" :data="tableData" border class="table" ref="multipleTable"
            header-cell-class-name="table-header">
            <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
            <el-table-column prop="couTypeName" label="课程类型" align="center"></el-table-column>
            <el-table-column prop="couName" label="课程名称" align="center"></el-table-column>
            <el-table-column label="课程封面" align="center" width="200">
              <template slot-scope="scope">
                <img :src="scope.row.cover" style="max-width: 180px;max-height: 100px;"></img>
              </template>
            </el-table-column>
            <el-table-column prop="number" label="学习人数" align="center"></el-table-column>
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.state==1">上架</span>
                <span v-else>下架</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination background layout="total,sizes, prev, pager, next,jumper" :current-page="PageNumber"
              :page-size="PageSize" :total="pageTotal" @current-change="handlePageChange($event,4)"
              @size-change="handleSizeChange($event,4)"></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="藏品" name="5">
          <el-table v-loading="loading" :data="tableData" border class="table" ref="multipleTable"
            header-cell-class-name="table-header">
            <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
            <el-table-column prop="collTime" label="发布时间" align="center"></el-table-column>
            <el-table-column prop="collName" label="藏品名称" align="center"></el-table-column>
            <el-table-column prop="guaranteePrice" label="担保价" align="center"></el-table-column>
            <el-table-column prop="size" label="尺寸" align="center"></el-table-column>
            <el-table-column prop="years" label="年份" align="center"></el-table-column>
            <el-table-column prop="region" label="区域" align="center"></el-table-column>
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.state==1">上架</span>
                <span v-else>下架</span>
              </template>
            </el-table-column>

          </el-table>
          <div class="pagination">
            <el-pagination background layout="total,sizes, prev, pager, next,jumper" :current-page="PageNumber"
              :page-size="PageSize" :total="pageTotal" @current-change="handlePageChange($event,5)"
              @size-change="handleSizeChange($event,5)"></el-pagination>
          </div>
        </el-tab-pane>

      </el-tabs>
    </div>


  </div>
</template>
<script>

  export default {
    data() {
      return {
        loading: false,
        type: 0,
        tabIndex: "",
        state: "all",//状态
        daterange: [],
        account: "",
        activeName: "1",
        PageNumber: 1,
        PageSize: 10,
        pageTotal: 0,
        tableData: [],
        form: {
          cirCover: '',
          cirUrl: ''
        },
        stateList: [
          { id: "0", name: "待审核" },
          { id: "1", name: "上架" },
          { id: "2", name: "下架" },
        ],
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
      //tab切换
      handleClick(tab) {
        this.PageNumber = 1;
        this.PageSize = 10;
        this.tabIndex = tab.index;
        if (this.query.type == 2) {
          if (tab.index == 0) {
            this.getUserInfo()
          } else if (tab.index == 1) {
            this.getDynamic()
          } else if (tab.index == 2) {
            this.getCircle()
          } else if (tab.index == 3) {
            this.getUserCourse()
          } else if (tab.index == 4) {
            this.getCollection()
          }
        }
      },
      getType() {
        this.tableData = [];
        this.query = this.$route.query;
        if (this.query.type) {
          this.type = this.query.type
        } else {
          this.type = 0;
          this.getUser()
        }
        if (this.type == 2) {//圈子列表
          if (this.tabIndex == 0) {
            this.getUserInfo()
          } else if (this.tabIndex == 1) {
            this.getDynamic()
          } else if (this.tabIndex == 2) {
            this.getCircle()
          } else if (this.tabIndex == 3) {
            this.getUserCourse()
          }
        }
      },
      viewUser(row) {
        this.$router.push({ path: "/user", query: { type: 2, uid: row.uid } })
      },
      updateUserState(row) {
        let state="";
        if(row.state==1){
          state=2
        }else{
          state=1
        }

        this.$post("/userinfo/updateUserinfo", {
          uid: row.uid,
          state
        }).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg);
            this.getUser()
          }
        })
      },
      //获取用户列表
      getUser() {
        this.loading = true;
        this.$post("/userinfo/getUserinfo", {
          state: this.state,
          starttime: this.daterange[0],
          endtime: this.daterange[1],
          account: this.account,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.loading = false;
            this.tableData = res.data.list;
            this.pageTotal = res.data.count;
          }
        })
      },
      //获取用户信息
      getUserInfo() {
        this.$post("/userinfo/showUserinfo", {
          uid: this.$route.query.uid,
        }).then(res => {
          if (res.code == 200) {
            this.form = res.data;
          }
        })
      },
      //获取动态列表
      getDynamic() {
        this.loading = true;
        this.$post("/circle/getDynamic", {
          dyType: "all",
          state: "all",
          uid: this.query.uid,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.loading = false;
            this.tableData = res.data.list;
            this.tableData.forEach((el, ind) => {
              el.picture = el.picture.split(",")[0]
            });
            this.pageTotal = res.data.count;
          }
        })
      },
      //获取圈子列表
      getCircle() {
        this.loading = true;
        this.$post("/circle/getCircle", {
          state: "all",
          uid: this.$route.query.uid,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.loading = false;
            this.tableData = res.data.list;
            this.pageTotal = res.data.count;
          }
        })
      },
      //获取课程列表
      getUserCourse() {
        this.loading = true;
        this.$post("/course/getUserCourse", {
          uid: this.$route.query.uid,
          PageSize: this.PageSize,
          PageNumber: this.PageNumber
        }).then(res => {
          if (res.code == 200) {
            this.loading = false;
            this.tableData = res.data.list;
            this.pageTotal = res.data.count;
          }
        })
      },
      //获取藏品列表
      getCollection() {
        this.loading = true;
        this.$post("/circle/getCollection", {
          uid: this.$route.query.uid,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.loading = false;
            this.tableData = res.data.list;
            this.pageTotal = res.data.count;
          }
        })
      },

      // 分页导航
      handlePageChange(val, type) {
        this.PageNumber = val;
        this.handleType(type)
      },
      handleSizeChange(val, type) {
        this.PageSize = val;
        this.handleType(type)
      },
      handleType(type) {
        if (type == 1) {
          this.getUser()
        } else if (type == 2) {
          this.getDynamic()
        } else if (type == 3) {
          this.getCircle()
        } else if (type == 4) {
          this.getUserCourse()
        } else if (type == 5) {
          this.getCollection()
        }
      }
    },
  };
</script>

<style lang="scss" scoped>
  .mb20 {
    margin-bottom: 20px;
  }

  .img60 {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }

  .handle-box {
    margin-bottom: 20px;
  }

  .handle-search {
    width: 200px;
  }

  .handle-select {
    width: 300px;
  }

  .handle-input {
    width: 300px;
    display: inline-block;
  }

  .mr10 {
    margin-right: 10px;
  }

  .table {
    width: 100%;
    font-size: 14px;
  }

  .info {
    color: #606266;
    line-height: 40px;

    div {
      display: flex;
      align-items: center;
    }
  }
</style>