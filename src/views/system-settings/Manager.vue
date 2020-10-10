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
        <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addManagers">新建
        </el-button>

        <el-select v-model="query.state" placeholder="状态" class=" mr10">
          <el-option label="全部" value="all"></el-option>
          <el-option label="正常" value="1"></el-option>
          <el-option label="禁用" value="2"></el-option>
        </el-select>
        <el-input v-model="query.content" placeholder="用户名" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
        @selection-change="handleSelectionChange">
        <el-table-column prop="id" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="account" label="账号" align="center"></el-table-column>
        <el-table-column prop="username" label="姓名" align="center"> </el-table-column>
        <el-table-column prop="mobile" label="手机号" align="center"> </el-table-column>
        <el-table-column prop="rName" label="角色" align="center"> </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.state==1">正常</div>
            <div v-else>禁用</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="400" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
            <el-button type="primary" size="mini" @click="updateState(scope.row)">
              <span v-if="scope.row.state==1">禁用</span>
              <span v-else>启用</span>
            </el-button>
            <el-button type="primary" size="mini" @click="resetPassword(scope.row)">重置密码</el-button>
            <el-button type="danger" size="mini" @click="deleteManager(scope.$index,scope.row)">删除</el-button>

          </template>
        </el-table-column>
      </el-table>

    </div>

    <!-- 编辑弹出框 -->
    <el-dialog center title="添加管理员" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="角色：">
          <el-select v-model="form.rId" placeholder="请选择角色" class="handle-select mr10">
            <el-option v-for="(item,index) in rolesList" :key="index" :label="item.RName" :value="item.RId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号：">
          <el-input v-model="form.account" placeholder="请输入账号" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item label="密码：">
          <el-input v-model="form.password" placeholder="请输入密码" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input v-model="form.mobile" placeholder="请输入手机号" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item label="管理员名称：">
          <el-input v-model="form.username" placeholder="请输入管理员名称" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item label="性别：">
          <el-select size="medium" v-model="form.sex" placeholder="请选择性别" class="handle-select mr10">
            <el-option key="1" label="男" value="男"></el-option>
            <el-option key="2" label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="头像：" class="personal-icon">
          <img v-if="form.headportrait" :src="form.headportrait" class="img" />
          <label v-else for="inputId" icon="el-icon-plus">
            <img src="~assets/img/headportrait.png" alt="">
            <input style="display: none" id="inputId" ref="input" type="file"
              accept="image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="handleFileChange" />
          </label>

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
        query: {
          state: 'all',
          content: ''
        },
        tableData: [],
        rolesList: [],//角色选项
        multipleSelection: [],
        editVisible: false,
        form: {
          headportrait: '',
          username: '',
          account: '',
          password: '',
          mobile: '',
          sex: '',
          rId: ''
        },
        idx: -1,
        id: -1
      };
    },
    computed: {
      token() {
        if (JSON.parse(localStorage.getItem("userinfo")).mtoken) {
          return { "mtoken": JSON.parse(localStorage.getItem("userinfo")).mtoken };
        }
      },
    },
    watch: {
      editVisible() {
        if (this.editVisible) {
          this.getRoles()
        }
      }
    },
    created() {
      this.getData();
    },
    methods: {
      // 获取数据
      getData() {
        this.$post("/userinfo/getManger", {
          state: "all",
          account: JSON.parse(localStorage.getItem("userinfo")).account
        }).then(res => {
          if (res.code == 200) {
            this.tableData = res.data;
          }
        })
      },
      // 触发搜索按钮
      handleSearch() {
        this.$post("/userinfo/getManger", this.query).then(res => {
          if (res.code == 200) {
            this.tableData = res.data
          }
        })
      },

      handleFileChange(e) {
        let file = e.target.files[0];
        let formdata = new FormData();
        formdata.append("myfile", file);
        console.log(formdata);
        uploadPost("/upload/pictureOrVideo", formdata).then((res) => {
          if (res.code == 200) {
            this.form.headportrait = res.data;
            console.log(res.data)
            console.log(this.form)

          }
        });
      },
      //添加管理员
      addManagers() {
        this.editVisible = true;

      },
      //获取角色列表
      getRoles() {
        this.$post("/userinfo/getRole", { state: 1 }).then(res => {
          if (res.code == 200) {
            this.rolesList = res.data;
          }
        })
      },
      //重置密码
      resetPassword(row) {
        console.log(row)
        this.$confirm('确定要重置密码吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$post("/userinfo/updatePassWord", {
            mid: row.mid,
            password: "reset",
            state: row.state
          }).then(res => {
            if (res.code == 200) {
              this.$message.success("重置密码成功")
            }
          })
        }).catch(() => { });

      },
      //启用或者禁用
      updateState(row) {
        console.log(row)
        var state;
        if (row.state == 1) {
          state = 2
        } else {
          state = 1
        }
        this.$post("/userinfo/updatePassWord", {
          mid: row.mid,
          password: row.password,
          state: state
        }).then(res => {
          if (res.code == 200) {
            this.getData()
            this.$message.success("操作成功")
          }
        })
      },
      // 删除操作
      deleteManager(index, row) {
        // 二次确认删除
        this.$confirm('确定要删除该管理员吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$post("/userinfo/deleteManger", {
            mid: row.mid
          }).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg);
              this.tableData.splice(index, 1);
            }
          })
        }).catch(() => { });
      },
      // 多选操作
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      delAllSelection() {
        const length = this.multipleSelection.length;
        let str = '';
        this.delList = this.delList.concat(this.multipleSelection);
        for (let i = 0; i < length; i++) {
          str += this.multipleSelection[i].name + ' ';
        }
        this.$message.error(`删除了${str}`);
        this.multipleSelection = [];
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
        this.$post("/userinfo/addManger", this.form).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.getData()
          }
        })
      },
      // 分页导航
      handlePageChange(val) {
        this.$set(this.query, 'pageIndex', val);
        this.getData();
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