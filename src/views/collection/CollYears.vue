<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <span>状态：</span>
        <el-select v-model="state" placeholder="状态" class="handle-select mr10">
          <el-option label="全部" value="all"></el-option>
          <el-option v-for="(item,index) in stateList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="getCollYears">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addCollYears">新建</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
        <el-table-column prop="cyName" label="年份名称" align="center"></el-table-column>
        <el-table-column label="年份状态" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.state==1">上架</div>
            <div v-else>下架</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="400" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editCollYears(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 编辑弹出框 -->
    <el-dialog center :title="title" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :rules="rules" :model="form" label-width="100px">
        <el-form-item label="状态：" prop="state">
          <el-select v-model="form.state" placeholder="请选择状态" class="handle-input mr10">
            <el-option v-for="(item,index) in stateList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年份：" prop="cyName">
          <el-input v-model="form.cyName" placeholder="请输入年份" class="handle-input mr10"></el-input>
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
        state:"all",
        tableData: [],  
        editVisible: false,
        title: "",
        form: {},
        rules: {
          state: [{ required: true, message: "请选择状态", trigger: "blur" }],
          cyName: [{ required: true, message: "请输入年份", trigger: "blur" }],
        },
        //状态选项
        stateList: [
          { id: "1", name: "上架" },
          { id: "2", name: "下架" },
        ],
        
      };
    },
    created() {
      this.getCollYears();
    },
    methods: {
      // 获取藏品年份
      getCollYears() {
        this.$post("/circle/getCollYears", {
          state:this.state
        }).then(res => {
          if (res.code == 200) {
            this.tableData = res.data;
          }
        })
      },
  
      //触发新建按钮
      addCollYears() {
        this.editVisible = true;
        this.form={}
        this.isAdd = true;
        this.title = "添加年份"
      },
      //触发编辑按钮
      editCollYears(row) {
        this.editVisible = true;
        this.isAdd = false;
        this.title = "编辑年份信息"
        this.form = row;
      },
      // 保存编辑
      saveEdit() {
        this.$refs.form.validate(valid => {
          if (valid) {
        this.editVisible = false;
            if (this.isAdd) {
              this.$post("/circle/insertCollYears", this.form).then(res => {
                if (res.code == 200) {
                  this.$message.success(res.msg)
                  this.getCollYears()
                }
              })
            } else {
              this.$post("/circle/updateCollYears", this.form).then(res => {
                if (res.code == 200) {
                  this.$message.success(res.msg)
                  this.getCollYears()
                }
              })
            }
          }
        })
      }
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