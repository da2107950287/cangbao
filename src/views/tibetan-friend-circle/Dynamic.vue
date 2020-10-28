<template>
  <div class="container">
    <div v-if="type==0">
      <div class="handle-box">
        <span>状态：</span>
        <el-select v-model="state" placeholder="请选择类型" class="handle-search mr10">
          <el-option v-for="(item,index) in statesList" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <span>类型：</span>
        <el-select v-model="cirType" placeholder="请选择圈子类型" class="handle-search  mr10">
          <el-option v-for="(item,index) in dictionaryList" :key="index" :label="item.dicName" :value="item.dicId">
          </el-option>
        </el-select>
        <span>用户ID：</span>
        <el-input v-model="uid" class="handle-search mr10"></el-input>
        <span>藏友圈名称：</span>
        <el-input v-model="cirName" class="handle-search mr10"></el-input>
        <el-button type="primary" class="handle-del mr10" @click="getData">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addCircle">新建</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
        <el-table-column prop="cirType" label="圈子类型" align="center"></el-table-column>
        <el-table-column prop="cirName" label="圈子名称" align="center"></el-table-column>
        <el-table-column prop="number" label="圈子人数" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.state==0">待审核</span>
            <span v-else-if="scope.row.state==1">上架</span>
            <span v-else>下架</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="seeRewardList(scope.row)">查看打赏排行榜</el-button>
            <el-button type="primary" size="mini" @click="updateCircleState(scope.row)">修改状态</el-button>
            <el-button type="primary" size="mini" @click="updateCircle(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page="PageNumber" :page-size="PageSize"
          :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>
    <div v-if="type==1">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="圈子类型：" prop="cirType">
          <el-select v-model="form.cirType" placeholder="请选择圈子类型" class="handle-select mr10">
            <el-option v-for="(item,index) in dictionaryList" :key="index" :label="item.dicName" :value="item.dicId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="圈子名称：" prop="cirName">
          <el-input v-model="form.cirName" placeholder="请输入圈子名称" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="圈子状态：" prop="state">
          <el-radio v-model="form.state" label="0">待审核</el-radio>
          <el-radio v-model="form.state" label="1">上架</el-radio>
          <el-radio v-model="form.state" label="2">下架</el-radio>
        </el-form-item>
        <el-form-item label="圈子头像：" prop="cirUrl" class="personal-icon">
          <label for="cirUrl" icon="el-icon-plus">
            <img v-if="form.cirUrl" :src="form.cirUrl" />
            <img v-else src="~assets/img/headportrait.png" alt="">
            <input style="display: none" id="cirUrl" ref="cirUrl" type="file"
              accept="image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="handleFileChange($event,1)" />
          </label>
        </el-form-item>
        <el-form-item label="圈子封面：" prop="cirCover" class="personal-icon">
          <label for="cirCover" icon="el-icon-plus">
            <img v-if="form.cirCover" :src="form.cirCover" />
            <img v-else src="~assets/img/headportrait.png" alt="">
            <input style="display: none" id="cirCover" ref="cirCover" type="file"
              accept="image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="handleFileChange($event,2)" />
          </label>
        </el-form-item>
        <el-form-item label="圈子介绍：" prop="cirIntro" style="width: 1000px;">
          <!-- <editor-bar :value="form.cirIntro" v-model="form.cirIntro"></editor-bar> -->
      <UEditor v-else ref="ueditor"></UEditor>

        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
          <el-button @click="goback">返 回</el-button>
        </el-form-item>
      </el-form>

    </div>
    <div v-if="type==2">
    
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
        <el-table-column prop="nickname" label="用户名" align="center"></el-table-column>
        <el-table-column  label="用户头像" align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row.headportrait"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="crMoney" label="打赏金额" align="center"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page="PageNumber" :page-size="PageSize"
          :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>
    <el-dialog title="修改圈子状态" center :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="圈子状态：" prop="state">
          <el-radio v-model="form.state" label="0">待审核</el-radio>
          <el-radio v-model="form.state" label="1">上架</el-radio>
          <el-radio v-model="form.state" label="2">下架</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveEditState">确 定</el-button>
        <el-button @click="editVisible = false">取 消</el-button>
      </span>
    </el-dialog>


  </div>
</template>
<script>
  import UEditor from '@/components/ueditor.vue'

  export default {
    data() {
      return {
        type: 0,
        query: {},
        state: "all",
        editVisible: false,
        cirType: "",
        uid: "",
        cirName: "",
        PageNumber: 1,
        PageSize: 10,
        pageTotal: 0,
        tableData: [],
        form: {
          cirCover: '',
          cirUrl: ''
        },
        isAdd: 0,
        title: '',
        dictionaryList: [],
        rules: {
          state: [{ required: true, message: "请选择圈子状态", trigger: "blur" }],
          cirType: [{ required: true, message: "请选择圈子类型", trigger: "blur" }],
          cirName: [{ required: true, message: "请输入圈子名称", trigger: "blur" }],
          cirCover: [{ required: true, message: "请输入圈子封面", trigger: "blur" }],
          cirUrl: [{ required: true, message: "请输入圈子头像", trigger: "blur" }],
          cirIntro: [{ required: true, message: "请输入圈子头像", trigger: "blur" }],
        },
        statesList: [
          { id: "all", name: "全部" },
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
      getType() {
        this.getAllDictionary()
        console.log(this.query, this.$route.query)
        this.query = this.$route.query;
        if (this.query.type) {
          this.type = this.query.type
        } else {
          this.type = 0;
          this.getData()
        }
        if (this.type == 1) {

          if (this.query.cirId) {
            this.getCircleInfo()
          }
        } else if (this.type == 2) {
          this.getRewardList()
        }
      },
      //获取数据
      getData() {
        this.$post("/circle/getCircle", {
          state: this.state,
          cirType: this.cirType,
          uid: this.uid,
          cirName: this.cirName,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.list;
            this.pageTotal = res.data.count;
          }
        })
      },
      getAllDictionary() {
        this.$post("/other/getAllDictionary", {
          dicType: "2"
        }).then(res => {
          if (res.code == 200) {
            this.dictionaryList = res.data;
          }
        })
      },
      getCircleInfo() {
        this.$post("/circle/showCircle", {
          cirId: this.query.cirId
        }).then(res => {
          if (res.code == 200) {
            this.form = res.data;
        this.$refs.ueditor.setUEContent(this.form.cirIntro)

          }
        })
      },
      seeRewardList(row) {
        console.log(888888888888)
        this.$router.push({ path: "/circle", query: { type: 2, cirId: row.cirId } })

      },
      getRewardList() {
        this.$post("/circle/getCircleUser", {
          cirId: this.query.cirId,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.list;
            this.pageTotal = res.data.count;
          }
        })
      },
      //上传图片
      handleFileChange(e, ind) {
        console.log(e, ind)
        let file = e.target.files[0];
        let formdata = new FormData();
        formdata.append("file", file);
        this.$uploadPost("/upload/pictureOrVideo", formdata).then((res) => {
          if (res.code == 200) {
            if (ind == 1) {
              this.form.cirUrl = res.data;
            } else {
              this.form.cirCover = res.data;
            }
          }
        });
      },
      addCircle() {
        this.$router.push({ path: "/circle", query: { type: 1 } })
        // this.editVisible = true;
        // this.isAdd = 1;
        // this.title = "添加数据字典";
      },
      updateCircleState(row) {
        this.editVisible = true;
        this.form = row;

      },
      saveEditState() {
        this.form.cirIntro = this.$refs.ueditor.getUEContent();

        this.$post("/circle/updateCircleState", {
          cirId: this.form.cirId,
          state: this.form.state,
        }).then(res => {
          if (res.code == 200) {
            this.editVisible = false
            this.$message.success(res.msg);
            this.getData()
          }
        })
      },
      // 保存编辑
      saveEdit() {

        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.query.cirId) {
              this.$post("/circle/insertCircle", this.form).then(res => {
                if (res.code == 200) {
                  this.$message.success(res.msg)
                  this.$router.go(-1)
                }
              })
            } else {
              this.$post("/circle/insertCircle", this.form).then(res => {
                if (res.code == 200) {

                  this.$message.success(res.msg)
                  this.$router.go(-1)

                }
              })
            }

          }

        })
      },
      updateCircle(row) {
        this.$router.push({ path: "/circle", query: { type: 1, cirId: row.cirId } })

      },
      // 删除操作
      deleteDictionary(index, row) {
        // 二次确认删除
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$post("/other/deleteDictionary", {
            dicId: row.dicId
          }).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg);
              this.tableData.splice(index, 1);
            }
          })
        }).catch(() => { });
      },
      goback() {
        this.$router.go(-1)
      },
      // 分页导航
      handlePageChange(val) {
        this.PageNumber = val;
        this.getData();
      }
    },
    components:{
      UEditor
    }
  };
</script>

<style lang="scss" scoped>
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

  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
</style>