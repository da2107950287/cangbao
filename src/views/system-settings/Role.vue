<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <span>状态：</span>
        <el-select v-model="state" placeholder="状态" class=" mr10">
          <el-option label="全部" value="all"></el-option>
          <el-option v-for="(item,index) in stateList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="getRole">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addRole">新建</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
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
            <el-button type="primary" size="mini" @click="viewRole(scope.row)">查看</el-button>
            <el-button type="danger" size="mini" @click="deleteRole(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 编辑弹出框 -->
    <el-dialog :title="title" center :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称：" prop="rName">
          <el-input v-model="form.rName" placeholder="请输入角色名称" class="handle-select mr10"></el-input>
        </el-form-item>
        <el-form-item label="角色状态：" prop="state">
          <el-select v-model="form.state" placeholder="请选择状态" class="handle-select mr10">
            <el-option v-for="(item,index) in stateList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色描述：" prop="describes">
          <el-input type="textarea" v-model="form.describes" placeholder="请输入描述" class="handle-select mr10"></el-input>
        </el-form-item>

        <el-form-item label="权限列表：" prop="pIds">
          <el-checkbox-group v-model="form.pIds">
            <el-checkbox v-for="item in powers" :label="item.pId" :key="item.pId">{{item.pName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span v-if="isAdd" slot="footer" class="dialog-footer">
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
        tableData: [],
        powers: [],
        editVisible: false,
        title: '',
        state: "all",
        isAdd:null,
        form: {
          rName: '',
          describes: '',
          state: '',
          pIds: []
        },
        rules: {
          rName: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
          describes: [{ required: true, message: "请输入角色描述", trigger: "blur" }],
          state: [{ required: true, message: "请选择角色状态", trigger: "blur" }],
          pIds: [{ required: true, message: "请选择角色权限", trigger: "blur" }],
        },
        //状态选项
        stateList: [
          { id: "1", name: "正常" },
          { id: "2", name: "禁用" },
        ],
      };
    },
    watch: {
      editVisible() {
        if (this.editVisible) {
          this.getPower()
        }else{
          this.form={
            pIds:[]
          }
          this.$nextTick(() => {
            this.$refs.form.clearValidate();
          })
        }
      }
    },
    created() {
      this.getRole();
    },
    methods: {
      // 获取数据
      getRole() {
        this.$post("/userinfo/getRole", {
          state: this.state
        }).then(res => {
          if (res.code = 200) {
            this.tableData = res.data;
          }
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
      addRole(){
        this.editVisible=true;
        this.isAdd=true;
        this.title="添加角色";
        // this.form={};
      },
      // 保存编辑
      saveEdit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.editVisible = false;
            this.form.pIds = this.form.pIds.join(",")
            this.$post("/userinfo/addRole", this.form).then(res => {
              if (res.code == 200) {
                this.$message.success(res.msg)
                this.getRole()
              }
            })
          }
        })
      },
      //查看角色信息
      viewRole(row) {
        this.title="查看角色信息"
        this.$post("/userinfo/showRole", { rId: row.rId }).then(res => {
          if (res.code == 200) {
            this.form = res.data;
            this.form.pIds=[];
            this.form.list.forEach(el => {
              this.form.pIds.push(el.pId)
            });
           
            this.editVisible = true;
          }
        })
      },
      // 删除操作
      deleteRole(index, row) {
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
        })
      },
      //修改角色状态
      updateState(row) {
        let state = row.state ^ 3

        this.$post("/userinfo/updateRoleState", {
          rId: row.rId,
          state
        }).then(res => {
          if (res.code == 200) {
            this.getRole()
            this.$message.success(res.msg)
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