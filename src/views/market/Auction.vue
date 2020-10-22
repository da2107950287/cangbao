<template>
  <div class="container">
    <div v-if="rtype==0">
      <div class="handle-box">
        <span>所属类型：</span>
        <el-select v-model="status" placeholder="请选择类型" class="handle-select mr10">
          <!-- <el-option label="全部" value="all"></el-option> -->
          <el-option v-for="(item,index) in stateList" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <span>拍卖会名称：</span>
        <el-input v-model="name" placeholder="请输入关键字" clearable class="handle-search mr10"></el-input>
        <el-button type="primary" class="handle-del mr10" @click="getAllAuction">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addSpecials">新建</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
        <el-table-column prop="name" label="拍卖会标题" align="center"></el-table-column>

        <el-table-column prop="simpleName" label="排名公司名称" align="center"></el-table-column>
        <el-table-column prop="auctionTime" label="拍卖时间" align="center"></el-table-column>
        <el-table-column prop="dealRate" label="成交率" width="80" align="center"></el-table-column>
        <el-table-column prop="dealTotal" label="成交总额" width="120" align="center"></el-table-column>
        <el-table-column prop="dealTotal" label="status" width="120" align="center">
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
            <el-button type="primary" size="mini" @click="updateTypelist(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" class="red" @click="deleteTypelist(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
    <div v-else-if="rtype==1">
      <div style="display: flex;align-items: center;margin-bottom: 20px;">
        <img src="~assets/img/goback.png" @click="$router.push('/marketReport')" class="mr10">
        <h3 v-if="query.id">修改报告</h3>
        <h3 v-else>添加报告</h3>
      </div>
      <el-divider></el-divider>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <h2>基本信息</h2>
        <el-form-item label="拍卖会标题：" prop="name">
          <el-input v-model="form.name" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="form.status" placeholder="请选择类型" class="handle-input mr10">
            <el-option v-for="(item,index) in stateList" :key="index" :label="item.name" :value="item.id.toString()">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="拍卖公司名称：" prop="simpleName">
          <el-input v-model="form.simpleName" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="排序：" prop="orders">
          <el-input v-model="form.orders" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="成交率：" prop="dealRate">
          <el-input v-model="form.dealRate" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="成交总额：" prop="dealTotal">
          <el-input v-model="form.dealTotal" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="拍卖公司id:" prop="organCode">
          <el-input v-model="form.organCode" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="时间：" prop="times">
          <el-date-picker v-model="form.times" value-format="yyyy-MM-dd" class="handle-input" type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="图片：" prop="picUrl">
          <label for="inputId" icon="el-icon-plus">
            <img v-if="form.picUrl" :src="form.picUrl" class="img" />
            <img v-else src="~assets/img/headportrait.png" class="img" alt="">
            <input style="display: none" id="inputId" ref="input" type="file"
              accept="image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="handleFileChange" />
          </label>
        </el-form-item>
        <h2>其他描述信息</h2>

        <el-form ref="form" :rules="rules" :model="form.youhua" label-width="120px">
         
          <el-form-item label="变化类型：" class="" prop="detailExtraInfo">
            <el-table :data="form.detailExtraInfo" border style="width: 500px">
              <el-table-column label="类型" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.type"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="标题" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.label"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="内容" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.text"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="delYouhuaLine(scope.$index,scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" size="mini" @click="addYouhuaLine()">添加</el-button>

          </el-form-item>
        </el-form>
        <el-form-item>
          <el-button @click="$router.push('/marketReport')">返回</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </el-form-item>
      </el-form>

    </div>
    <!-- 编辑弹出框 -->
    <el-dialog :title="title" center :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">

        <el-form-item label="名称：">
          <el-input v-model="form.dicName" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input v-model="form.orders" class="handle-input"></el-input>
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
        type: "all",
        query: {},
        name: "",
        status: "all",
        rtype: "",
        tableData: [],
        form: {
          picUrl: "",
          detailExtraInfo:[],
        },
        editVisible: false,
        isAdd: 0,
        title: '',
        rules: {
          type: [{ required: true, message: "请选择类型", trigger: "blur" }],
          dicName: [{ required: true, message: "请输入名称", trigger: "blur" }],
          orders: [{ required: true, message: "请输入排序", trigger: "blur" }],
        },
        stateList: [
         
          { id: "1", name: "待预展" },
          { id: "2", name: "预展中" },
          { id: "3", name: "待拍卖" },
          { id: "4", name: "拍卖中" },
          { id: "5", name: "已结拍" },
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
      addYouhuaLine() {
        var newLine = { type: "", label: "",text:"" };
        this.form.detailExtraInfo.push(newLine)
      },
      delYouhuaLine(index, row) {
        this.form.detailExtraInfo.splice(index, 1)
      },
      //上传图片
      handleFileChange(e) {
        let file = e.target.files[0];
        let formdata = new FormData();
        formdata.append("file", file);
        this.$uploadPost("/upload/pictureOrVideo", formdata).then((res) => {
          if (res.code == 200) {
            this.form.picUrl = res.data;
          }
        });
      },
      getType() {

        this.query = this.$route.query;
        this.getTypelist()
        if (this.query.rtype) {
          this.rtype = this.query.rtype;
        } else {
          this.rtype = 0;
          this.getAllAuction();
        }
        if (this.query.id) {
          this.getAllAuctionInfo()
        }
      },
      getTypelist() {
        this.$post("/market/getTypelist", {}).then(res => {
          if (res.code == 200) {
            this.typelist = res.data
          }
        })
      },
      getAllAuctionInfo() {
        this.$post("/market/showMarketReport", {
          id: this.query.id
        }).then(res => {
          if (res.code == 200) {
            this.form = res.data;
          }
        })
      },
      //获取数据
      getAllAuction() {
        this.$post("/market/getAllAuction", {
          status: this.status,
          name: this.name,
        }).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.list;
            this.pageTotal = res.data.count;
          }
        })
      },
      addSpecials() {
        this.$router.push({ path: "/auction", query: { rtype: 1 } })
        this.form={
          picUrl: "",
          detailExtraInfo:[],
        }
      },
      // 保存编辑
      saveEdit() {
        this.editVisible = false;
        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.query.id) {
              this.$post("/market/insertAuction", this.form).then(res => {
                if (res.code == 200) {
                  this.$router.push("/auction")
                  this.$message.success(res.msg)
                }
              })
            } else {
              this.$post("/market/updateAuction", this.form).then(res => {
                if (res.code == 200) {
                  this.$router.push("/auction")

                  this.$message.success(res.msg)
                }
              })
            }

          }

        })
      },
      updateTypelist(row) {
        this.$router.push({ path: "/marketReport", query: { rtype: 1, id: row.id } })
        // this.editVisible = true;

      },
      // 删除操作
      deleteTypelist(row) {
        // 二次确认删除
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$post("/other/deleteTypelist", {
            dicId: row.dicId
          }).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg);
              this.getAllAuction()
            }
          })
        })
      },

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
    width: 400px;
    display: inline-block;
  }

  .handle-search {
    width: 300px;
  }

  .mr10 {
    margin-right: 10px;
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