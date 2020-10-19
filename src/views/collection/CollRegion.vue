<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <span>状态：</span>
        <el-select v-model="state" placeholder="状态" class="handle-select mr10">
          <el-option label="全部" value="all"></el-option>
          <el-option v-for="(item,index) in statesList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="getCollRegion">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addCollRegion">新建</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
        <el-table-column prop="crName" label="区域名称" align="center"></el-table-column>
        <el-table-column label="区域状态" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.state==1">上架</div>
            <div v-else>下架</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="400" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editCollRegion(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 编辑弹出框 -->
    <el-dialog center :title="title" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :rules="rules" :model="form" label-width="100px">
        <el-form-item label="状态：" prop="rId">
          <el-select v-model="form.state" placeholder="请选择状态" class="handle-input mr10">
            <el-option v-for="(item,index) in statesList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称：" prop="account">
          <el-input v-model="form.crName" placeholder="请输入区域名称" class="handle-input mr10"></el-input>
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
  import { uploadPost } from "utils/request.js"
  export default {
    data() {
     
      return {
        state:"all",
        tableData: [],  
        editVisible: false,
        title: "",
        form: {},
        rules: {
          state: [{ required: true, message: "请上传图片", trigger: "blur" }],
          crName: [{ required: true, message: "请输入名称", trigger: "blur" }],
        },
        //状态选项
        statesList: [
          { id: "1", name: "上架" },
          { id: "2", name: "下架" },
        ],
        
      };
    },
    created() {
      this.getCollRegion();
    },
    methods: {
      // 获取藏品区域
      getCollRegion() {
        this.$post("/circle/getCollRegion", {
          state:this.state
        }).then(res => {
          if (res.code == 200) {
            this.tableData = res.data;
          }
        })
      },
  
      //触发新建按钮
      addCollRegion() {
        this.editVisible = true;
        this.isAdd = true;
        this.title = "添加地区"
      },
      //触发编辑按钮
      editCollRegion(row) {
        this.editVisible = true;
        this.isAdd = false;
        this.title = "编辑地区信息"
        this.form = row;
      },
      // 保存编辑
      saveEdit() {
        this.$refs.form.validate(valid => {
          if (valid) {
        this.editVisible = false;
            if (this.isAdd) {
              this.$post("/circle/insertCollRegion", this.form).then(res => {
                if (res.code == 200) {
                  this.$message.success(res.msg)
                  this.getCollRegion()
                }
              })
            } else {
              this.$post("/circle/updateCollRegion", this.form).then(res => {
                if (res.code == 200) {
                  this.$message.success(res.msg)
                  this.getCollRegion()
                }
              })
            }
          }
        })

      },
    
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