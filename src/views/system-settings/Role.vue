<template>
  <div>
    <!-- <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 基础表格
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addRoles">添加角色
        </el-button>
        <el-select v-model="query.state" placeholder="请选择状态" class=" mr10">
          <el-option label="全部" value="all"></el-option>
          <el-option label="正常" value="1"></el-option>
          <el-option label="禁用" value="2"></el-option>
        </el-select>
      
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
        @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
        <el-table-column prop="id" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="rName" label="角色名称" align="center"></el-table-column>
        <el-table-column prop="describes" label="描述" align="center">
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.state==1">正常</div>
            <div v-else>禁用</div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="updateState(scope.row)">
              <span v-if="scope.row.state==1">禁用</span>
              <span v-else>启用</span>
            </el-button>
            <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="deleteRole(scope.$index, scope.row)">删除</el-button>

          </template>
        </el-table-column>
      </el-table>

    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="添加角色" center :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="角色名称：">
          <el-input v-model="form.rName" placeholder="请输入角色名称" class="handle-select mr10"></el-input>
        </el-form-item>
      
        <el-form-item label="角色状态：">
          <el-select size="medium" v-model="form.state" placeholder="请选择状态" class="handle-select mr10">
            <el-option key="1" label="启用" value="1"></el-option>
            <el-option key="2" label="禁用" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色描述：">
          <el-input type="textarea" v-model="form.describes" placeholder="请输入描述" class="handle-select mr10"></el-input>
        </el-form-item>
        <el-form-item label="权限列表：">
          <el-checkbox-group v-model="form.pIds">
            <el-checkbox v-for="item in powers" :label="item.pId" :key="item.pId">{{item.pName}}</el-checkbox>
          </el-checkbox-group>
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
  // import { fetchData } from '../../api/index';
  export default {
    name: 'basetable',
    data() {
      return {
        query:{
          state:"all"
        },
        tableData: [],
        powers: [],
        multipleSelection: [],
        delList: [],
        editVisible: false,
        pageTotal: 0,
        form: {
          rName: '',
          describes: '',
          state: '',
          pIds: []
        },
        idx: -1,
        id: -1
      };
    },
    watch: {
      editVisible() {
        if (this.editVisible) {
          this.getPower()
        }
      }
    },
    created() {
      this.getData();
    },
    methods: {
      // 获取数据
      getData() {
        this.$post("/userinfo/getRole", this.query).then(res => {
          this.tableData = res.data
        })
      },
      //获取权限列表
      getPower() {
        this.$post("/userinfo/getPower", {}).then(res => {
          if (res.code == 200) {
            this.powers = res.data;
          }
        })
      },
      //添加角色
      addRoles() {
        this.editVisible = true;
      },
      // // 触发搜索按钮
      handleSearch() {
       
        this.getData();
      },
      // 删除操作
      deleteRole(index, row) {
        console.log(row)
        // 二次确认删除
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$post("/userinfo/deleteRole", { rId: row.rId }).then(res => {
            if (res.code == 200) {
              this.tableData.splice(index, 1);
              this.$message.success(res.msg)
            }
          })
        }).catch(() => { });
      },
      //修改角色状态
      updateState(row) {
        console.log(row)
        var state;
        if (row.state == 1) {
          state = 2
        } else {
          state = 1
        }
        this.$post("/userinfo/updateRoleState", {
          rId: row.rId,
          state
        }).then(res => {
          if (res.code == 200) {
            this.getData()
            this.$message.success(res.msg)
          }
        })
      },
      // 多选操作
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
     
      // 编辑操作
      handleEdit(index, row) {
        console.log(row)
        this.idx = index;
        this.form = row;
        this.editVisible = true;
      },
      // 保存编辑
      saveEdit() {
        
        this.editVisible = false;
       
        this.form.pIds = this.form.pIds.join(",")
        this.$post("/userinfo/addRole", this.form).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.getData()
          }
        })
      },
      
    }
  };
</script>

<style scoped>
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
</style>