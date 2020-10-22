<template>
  <div>
    <div class="container">

      <div v-if="$route.query.type==2" style="display: flex;align-items: center;margin-bottom: 20px;">
        <img src="../../assets/img/goback.png" @click="$router.push('/auctionCategory')" class="mr10">
        <h3>二级分类</h3>
      </div>
      <div class="handle-box">
        <!-- <span>状态：</span>
        <el-select v-model="type" placeholder="状态" class="handle-select mr10">
          <el-option v-for="(item,index) in typeList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="getCollYears">搜索</el-button> -->
        <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addYearList">新建</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
        <el-table-column prop="name" label="拍卖分类名称" align="center"></el-table-column>
        <el-table-column label="等级" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.type==1">一级</div>
            <div v-else>二级</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="400" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editYearList(scope.row)">编辑</el-button>
            <el-button v-if="$route.query.type!=2" type="primary" size="mini" @click="getTwoLevel(scope.row)">查看下一级
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <div class="pagination">
          <el-pagination background layout="total,sizes, prev, pager, next,jumper" :current-page="PageNumber"
            :page-size="PageSize" :total="pageTotal" @current-change="handlePageChange($event)"
            @size-change="handleSizeChange($event)"></el-pagination>
        </div>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog center :title="title" :visible.sync="editVisible" width="40%">
      <el-form ref="form" :rules="rules" :model="form" label-width="140px">
        <el-form-item label="拍卖分类名称：" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" class="handle-input mr10"></el-input>
        </el-form-item>
       
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        PageNumber: 1,
        PageSize: 10,
        pageTotal: 0,
        type: "1",

        tableData: [],
        editVisible: false,
        title: "",
        form: {},
        rules: {
          name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
       
        },

        typeList: [
          { id: "1", name: "一级" },
          { id: "2", name: "二级" },
        ],
        allArtClassList: []
      };
    },
    watch: {
      $route(to, form) {
        this.PageNumber=1;
        this.PageSize=10;
        this.getArtClassList()
      }
    },
    created() {
      this.getArtClassList();
    },
    methods: {
      getAllArtClassList() {
        this.$post("/market/getArtClassList", {
          type,
          superior: this.$route.query.superior,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.list;
            this.pageTotal = res.data.count;
          }
        })
      },
      getTwoLevel(row) {
        this.$router.push({ path: "/auctionCategory", query: { type: 2, id: row.classCode } })
      },
      // getType(){
      //   if(this.$router.query.type){
      //     this.type=
      //   }
      // },
      // getTwoLevel(){
      //   this.$router.push({ path: "/auctionCategory", query: {superior: } })

      // },
      // 获取藏品年份
      getArtClassList() {
        let type;
        if (this.$route.query.type) {
          type = this.$route.query.type
        } else {
          type = 1
        }
        this.$post("/market/getArtClassList", {
          type,
          superior: this.$route.query.superior,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.list;
            this.pageTotal = res.data.count;
          }
        })
      },

      //触发新建按钮
      addYearList() {
        this.editVisible = true;
        this.form = {}
        this.isAdd = true;
        this.title = "添加拍卖会类别"
      },
      //触发编辑按钮
      editYearList(row) {
        this.editVisible = true;
        this.isAdd = false;
        this.title = "编辑拍卖会类别信息"
        this.form = row;
      },
      // 保存编辑
      saveEdit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.editVisible = false;
            if (this.$route.query.id) {
                this.form.superior = this.$route.query.id
              }
            if (this.isAdd) {
              console.log(this.form)
             
              if (this.$route.query.type) {
                this.form.type = this.$route.query.type
              } else {
                this.form.type = 1
              }
              this.$post("/market/insertArtClassList", this.form).then(res => {
                if (res.code == 200) {
                  this.$message.success(res.msg)
                  this.getArtClassList()
                }
              })
            } else {
              this.$post("/market/updateArtClassList", this.form).then(res => {
                if (res.code == 200) {
                  this.$message.success(res.msg)
                  this.getArtClassList()
                }
              })
            }
          }
        })
      },
      // 分页导航
      handlePageChange(val) {
        console.log(val)
        this.PageNumber = val;
        this.getArtClassList();
      },
      handleSizeChange(val) {
        this.PageSize = val;
        this.getArtClassList();
      }
    }
  };
</script>

<style lang="scss" scoped>
  .handle-box {
    margin-bottom: 20px;
  }

  .handle-select {
    width: 400px;
  }

  .handle-input {
    width: 400px;
    display: inline-block;
  }

  .mr10 {
    margin-right: 10px;
  }

  .table {
    width: 100%;
    font-size: 14px;
  }

  .red {
    color: #ff0000;
  }

  .mr10 {
    margin-right: 10px;
  }

  .table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
  }

  .personal-icon {
    img {
      width: 100px;
      height: 100px;
      border-radius: 50%
    }
  }
</style>