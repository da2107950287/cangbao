<template>
  <div class="container">
    <div class="handle-box">
      <span>位置：</span>
      <el-select v-model="position" placeholder="请选择位置" class="handle-select mr10">
        <el-option v-for="(item,index) in positionList" :key="index" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <span>状态：</span>
      <el-select v-model="state" placeholder="请选择状态" class="handle-select mr10">
        <el-option v-for="(item,index) in statesList" :key="index" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-button type="primary" class="handle-del mr10" @click="getData">搜索</el-button>
      <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addBanners">新建</el-button>
    </div>
    <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
      <el-table-column type="index" width="80" label="序号" align="center"></el-table-column>
      <el-table-column prop="title" label="标题" align="center"></el-table-column>
      <el-table-column label="图片" align="center">
        <template slot-scope="scope">
          <el-image :src="scope.row.purl" lazy class="img"></el-image>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="positions" label="位置" align="center"></el-table-column> -->
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.state==1">已推荐</span>
          <span v-else>未推荐</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="updateState(scope.row)">
            <span v-if="scope.row.state==1">取消推荐</span>
            <span v-else>推荐</span>
          </el-button>
          <el-button type="primary" size="mini" @click="updateBanners(scope.row)">编辑</el-button>
          <!-- <el-button type="danger" size="mini" class="red" @click="delete(scope.$index, scope.row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination background layout="total, prev, pager, next" :current-page="PageNumber" :page-size="PageSize"
        :total="pageTotal" @current-change="handlePageChange"></el-pagination>
    </div>
    <!-- 编辑弹出框 -->
    <el-dialog :title="title" center :visible.sync="editVisible" width="800">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="位置：" prop="positions">
          <el-select v-model="form.positions" placeholder="请选择位置" class="handle-input mr10">
            <el-option v-for="(item,index) in positionList" :key="index" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题：" prop="title">
          <el-input v-model="form.title" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="头像：" prop="purl" class="personal-icon">
          <label for="inputId" icon="el-icon-plus">
            <img v-if="form.purl" :src="form.purl" />
            <img v-else src="~assets/img/headportrait.png" alt="">
            <input style="display: none" id="inputId" ref="input" type="file"
              accept="image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="handleFileChange" />
          </label>
        </el-form-item>
        <el-form-item label="内容：" prop="content">
          <editor-bar :value="form.content" v-model="form.content"></editor-bar>
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
  import EditorBar from "@/components/wangeditor/WangEditor.vue";
  export default {
    data() {
      return {
        position: "1",
        state: "all",
        PageNumber: 1,
        PageSize: 10,
        pageTotal: 0,
        tableData: [],
        form: {
          purl: ""
        },
        editVisible: false,
        isAdd: 0,
        title: '',
        rules: {
          positions: [{ required: true, message: "请选择位置", trigger: "blur" }],
          title: [{ required: true, message: "请输入标题", trigger: "blur" }],
          purl: [{ required: true, message: "请上传图片", trigger: "blur" }],
          content: [{ required: true, message: "请输入内容", trigger: "blur" }],
        },
        positionList: [
          { id: "1", name: '首页' },
          { id: "2", name: '市场' },
          { id: "3", name: '课程' }
        ],
        statesList: [
          { id: "all", name: '全部' },
          { id: "1", name: '已推荐' },
          { id: "2", name: '未推荐' }
        ]
      };
    },
    watch: {
      editVisible() {
        if (!this.editVisible) {
          this.form = {
            purl: ""
          }
        }
      }
    },
    created() {
      this.getData()
    },
    methods: {
      //获取数据
      getData() {
        this.$post("/other/getBanner", {
          positions: this.position,
          state: this.state,
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
      handleFileChange(e) {
        let file = e.target.files[0];
        let formdata = new FormData();
        formdata.append("myfile", file);
        this.$uploadPost("/upload/pictureOrVideo", formdata).then((res) => {
          if (res.code == 200) {
            this.form.purl = res.data;
          }
        });
      },
      //修改状态
      updateState(row) {
        var state;
        if (row.state == 1) {
          state = 2
        } else {
          state = 1
        }
        this.$post("/other/updateBannerState", {
          banId: row.banId,
          state: state
        }).then(res => {
          if (res.code == 200) {
            this.getData()
            this.$message.success("操作成功")
          }
        })
      },
      //触发添加按钮
      addBanners() {
        this.editVisible = true;
        this.isAdd = 1;
        this.title = "添加banner";
      },
      //出发编辑按钮
      updateBanners(row) {
        this.editVisible = true;
        this.title = "编辑banner信息";
        this.isAdd = 0;
        this.$post("/other/showBanner", { banId: row.banId }).then(res => {
          if (res.code == 200) {
            this.form = res.data;
          }
        })
      },
      // 保存编辑
      saveEdit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.editVisible = false;
            if (this.isAdd == 1) {
              this.$post("/other/insertBanner", this.form).then(res => {
                if (res.code == 200) {
                  this.getData()
                  this.$message.success(res.msg)
                }
              })
            } else {
              this.$post("/other/updateBanner", this.form).then(res => {
                if (res.code == 200) {
                  this.getData()
                  this.$message.success(res.msg)
                }
              })
            }
          }
        })
      },

      // 删除操作
      deleteDictionary(index, row) {
        // 二次确认删除
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        }).then(() => {
          // this.$post("/other/deleteDictionary", {
          //   dicId: row.dicId
          // }).then(res => {
          //   if (res.code == 200) {
          //     this.$message.success(res.msg);
          //     this.tableData.splice(index, 1);
          //   }
          // })
        })
      },
      // 分页导航
      handlePageChange(val) {
        this.PageNumber = val;
        this.getData();
      },

    },
    components: {
      EditorBar
    }
  };
</script>

<style lang="scss" scoped>
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

  .mr10 {
    margin-right: 10px;
  }

  .table {
    width: 100%;
    font-size: 14px;
  }


  .img {
    width: 100px;
    height: 50px;
  }

  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
</style>