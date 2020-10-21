<template>
  <div class="container">
    <div v-if="rtype==0">
      <div class="handle-box">

        <span>分析师名称：</span>
        <el-input v-model="name" placeholder="请输入关键字" clearable class="handle-search mr10"></el-input>
        <el-button type="primary" class="handle-del mr10" @click="getTopArtists">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addTypelists">新建</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
        <el-table-column prop="name" label="分析师名称" align="center"></el-table-column>
        <el-table-column prop="name" label="头像" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.headPortrait" style="max-width: 180px;max-height: 100px;"></img>
          </template>
        </el-table-column>

        <el-table-column prop="cje" label="成交额" align="center">

        </el-table-column>
        <el-table-column prop="cjl" label="成交数量" align="center"></el-table-column>

        <el-table-column prop="spl" label="上拍数量" width="120" align="center"></el-table-column>
        <el-table-column prop="youhua" label="拍卖指数" width="120" align="center"></el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="updateTypelist(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" class="red" @click="deleteTypelist(scope.row)">删除
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
    <div v-else-if="rtype==1">
      <div style="display: flex;align-items: center;margin-bottom: 20px;">
        <img src="~assets/img/goback.png" @click="$router.push('/artAnalyst')" class="mr10">
        <h3 v-if="query.id">修改分析师</h3>
        <h3 v-else>添加分析师</h3>
      </div>
      <el-divider></el-divider>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <!-- <el-form-item label="类型：">
          <el-select v-model="form.type" placeholder="请选择类型" class="handle-select mr10">
            <el-option v-for="(item,index) in typelist" :key="index" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="名称：" prop="name">
          <el-input v-model="form.name" class="handle-input"></el-input>
        </el-form-item>

        <el-form-item label="综合指数：" prop="artronExponent">
          <el-input v-model="form.artronExponent" class="handle-input"></el-input>
        </el-form-item>

        <el-form-item label="成交量：" prop="cjl">
          <el-input v-model="form.cjl" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="成交额：" prop="cje">
          <el-input v-model="form.cje" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="成交额单位：" prop="cjeUni">
          <el-input v-model="form.cjeUni" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="排序：" prop="orders">
          <el-input v-model="form.orders" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="上拍数量：" prop="spl">
          <el-input v-model="form.spl" class="handle-input"></el-input>
        </el-form-item>
      
        <el-form-item label="拍卖指数："  style="margin-bottom: 20px;"prop="youhua">

          <el-form ref="form" :rules="rules" :model="youhua" label-width="100px" style="height: auto;">
            <el-form-item label="比上季：" prop="change">
              <el-input v-model="youhua.change" placeholder="请输入类型名称" class="handle-input mr10"></el-input>
            </el-form-item>
            <el-form-item label="上季" prop="orders">
              <el-input v-model="youhua.prev" placeholder="请输入类型排序" class="handle-input mr10"></el-input>
            </el-form-item>
            <el-form-item label="当季：" prop="orders">
              <el-input v-model="youhua.curr" placeholder="请输入类型排序" class="handle-input mr10"></el-input>
            </el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item label="生日：" prop="thedDeath">
          <el-date-picker v-model="form.thedDeath" value-format="yyyy-MM-dd" class="handle-input" type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="图片：" prop="headPortrait">
          <label for="inputId" icon="el-icon-plus">
            <img v-if="form.headPortrait" :src="form.headPortrait" class="img">
            <img v-else src="~assets/img/headportrait.png" alt="" class="img">
            <input style="display: none" id="inputId" ref="input" type="file"
              accept="image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="handleFileChange" />
          </label>
        </el-form-item>


        <el-form-item>
          <el-button @click="$router.push('/artAnalyst')">返回</el-button>
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
        PageNumber: 1,
        PageSize: 10,
        pageTotal: 0,
        tableData: [],
        youhua:{},
        form: {
          headPortrait: ""
        },
        editVisible: false,
        isAdd: 0,
        title: '',
        rules: {
          type: [{ required: true, message: "请选择类型", trigger: "blur" }],
          dicName: [{ required: true, message: "请输入名称", trigger: "blur" }],
          orders: [{ required: true, message: "请输入排序", trigger: "blur" }],
        },

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
      //上传图片
      handleFileChange(e) {
        let file = e.target.files[0];
        let formdata = new FormData();
        formdata.append("file", file);
        this.$uploadPost("/upload/pictureOrVideo", formdata).then((res) => {
          if (res.code == 200) {
            this.form.headPortrait = res.data;
          }
        });
      },
      getType() {

        this.query = this.$route.query;
        if (this.query.rtype) {
          this.rtype = this.query.rtype;
        } else {
          this.rtype = 0;
          this.getTopArtists();
        }
        if (this.query.id) {
          this.getTopArtistsInfo()
        }
      },

      getTopArtistsInfo() {
        this.$post("/market/showTopArtists", {
          id: this.query.id
        }).then(res => {
          if (res.code == 200) {
            this.form = res.data;
          }
        })
      },
      //获取数据
      getTopArtists() {
        this.$post("/market/getTopArtists", {
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
      addTypelists() {
        this.$router.push({ path: "/artAnalyst", query: { rtype: 1 } })

      },
      // 保存编辑
      saveEdit() {
        this.editVisible = false;
        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.query.id) {
              this.$post("/market/updateTopArtists", this.form).then(res => {
                if (res.code == 200) {
                  this.$router.push("/marketRepost")
                  this.$message.success(res.msg)
                }
              })
            } else {
              this.$post("/market/insertTopArtists", this.form).then(res => {
                if (res.code == 200) {
                  this.$router.push("/marketRepost")

                  this.$message.success(res.msg)
                }
              })
            }

          }

        })
      },
      updateTypelist(row) {
        this.$router.push({ path: "/artAnalyst", query: { rtype: 1, id: row.id } })
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
              this.getTopArtists()
            }
          })
        })
      },
      // 分页导航
      handlePageChange(val) {
        console.log(val)
        this.PageNumber = val;
        this.getTopArtists();
      },
      handleSizeChange(val) {
        this.PageSize = val;
        this.getTopArtists();
      }
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
  .el-form-item .el-form-item{
    margin-bottom: 20px;
  }
</style>