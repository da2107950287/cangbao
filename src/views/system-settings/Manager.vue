<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <span>状态：</span>
        <el-select v-model="query.state" placeholder="状态" class="handle-select mr10">
          <el-option v-for="(item,index) in statesList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-input v-model="query.content" placeholder="请输入关键词" class="handle-select mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addManager">新建</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
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
            <el-button type="primary" size="mini" @click="editManager(scope.row)">查看</el-button>
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
    <el-dialog center :title="title" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :rules="rules" :model="form" label-width="100px">
        <el-form-item label="角色：" prop="rId">
          <el-select v-model="form.rId" placeholder="请选择角色" class="handle-input mr10">
            <el-option v-for="(item,index) in rolesList" :key="index" :label="item.rName" :value="item.rId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号：" prop="account">
          <el-input v-model="form.account" placeholder="请输入账号" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="mobile">
          <el-input v-model.number="form.mobile" maxlength="11" placeholder="请输入手机号" class="handle-input mr10">
          </el-input>
        </el-form-item>
        <el-form-item label="名称：" prop="username">
          <el-input v-model="form.username" placeholder="请输入管理员名称" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item label="性别：" prop="sex">
          <el-select size="medium" v-model="form.sex" placeholder="请选择性别" class="handle-input mr10">
            <el-option v-for="(item,index) in sexList" :key="index" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="头像：" class="personal-icon" prop="headportrait">
          <label for="inputId" icon="el-icon-plus">
            <img v-if="form.headportrait" :src="form.headportrait" class="img" />
            <img v-else src="~assets/img/headportrait.png" alt="">
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
      var validatorPhone = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入手机号"));
        } else {
          var isPhone = /^[1][0-9][0-9]{9}$/;
          if (!isPhone.test(value)) {
            callback(new Error("请输入正确的手机号"));
          } else {
            this.canClick = true;
            callback();
          }
        }
      };
      return {
        query: {
          state: "all",
          content: ""
        },
        tableData: [],
        rolesList: [],//角色选项       
        editVisible: false,
        title: "",
        form: {
          headportrait: "",
          username: "",
          account: "",
          password: "",
          mobile: "",
          sex: "",
          rId: ""
        },
        rules: {
          headportrait: [{ required: true, message: "请上传图片", trigger: "blur" }],
          username: [{ required: true, message: "请输入名称", trigger: "blur" }],
          account: [{ required: true, message: "请输入账号", trigger: "blur" }],
          password: [{ required: true, message: "请输入密码", trigger: "blur" }],
          mobile: [
            { required: true, message: "请输入手机号", trigger: "blur" },
            { validator: validatorPhone, trigger: "blur" }
          ],
          sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
          rId: [{ required: true, message: "请选择角色", trigger: "blur" }]
        },
        //状态选项
        statesList: [
          { id: "all", name: "全部" },
          { id: "1", name: "正常" },
          { id: "2", name: "禁用" },
        ],
        sexList: [
          { id: "1", name: "男" },
          { id: "2", name: "女" }
        ]
      };
    },
    watch: {
      editVisible() {
        if (this.editVisible) {
          this.getRoles()
        } else {
          this.form = {
            headportrait: ""
          }
        }
      }
    },
    created() {
      this.getData();
    },
    methods: {
      // 获取数据
      getData() {
        this.$post("/userinfo/getManger", this.query).then(res => {
          if (res.code == 200) {
            this.tableData = res.data;
          }
        })
      },
      //上传图片
      handleFileChange(e) {
        let file = e.target.files[0];
        let formdata = new FormData();
        formdata.append("myfile", file);
        uploadPost("/upload/pictureOrVideo", formdata).then((res) => {
          if (res.code == 200) {
            this.form.headportrait = res.data;
          }
        });
      },
      //触发新建按钮
      addManager() {
        this.editVisible = true;
        this.isAdd = true;
        this.title = "添加管理员"
      },
      //触发编辑按钮
      editManager(row) {
        this.editVisible = true;
        this.isAdd = false;
        this.title = "编辑管理员信息"
        this.form = row;
      },
      // 保存编辑
      saveEdit() {
        this.$refs.form.validate(valid => {
          if (valid) {
        this.editVisible = false;

            if (this.isAdd) {
              this.$post("/userinfo/addManger", this.form).then(res => {
                if (res.code == 200) {
                  this.$message.success(res.msg)
                  this.getData()
                }
              })
            } else {
              this.$post("/userinfo/updateManger", this.form).then(res => {
                if (res.code == 200) {
                  this.$message.success(res.msg)
                  this.getData()
                }
              })
            }
          }
        })

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
        this.$confirm("确定要重置密码吗？", "提示", {
          type: "warning"
        }).then(() => {
          this.$post("/userinfo/updatePassWord", {
            mid: row.mid,
            password: "reset",
            state: row.state
          }).then(res => {
            if (res.code == 200) {
              this.getData()
              this.$message.success(res.msg)
            }
          })
        }).catch(() => { });

      },
      //修改状态
      updateState(row) {
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
            this.$message.success(res.msg)
          }
        })
      },
      // 删除操作
      deleteManager(index, row) {
        // 二次确认删除
        this.$confirm("确定要删除该管理员吗？", "提示", {
          type: "warning"
        }).then(() => {
          this.$post("/userinfo/deleteManger", {
            mid: row.mid
          }).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg);
              this.tableData.splice(index, 1);
            }
          })
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