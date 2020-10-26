<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="150px">
    <h2>专场基本信息</h2>
    <el-form-item label="拍卖会专场状态：" prop="status">
      <el-select v-model="form.status" placeholder="请选择拍卖会专场状态" class="handle-input mr10">
        <el-option v-for="(item,index) in stateList" :key="index" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="拍卖会专场名称：" prop="name">
      <el-input v-model="form.name"  placeholder="请输入拍卖会专场名称" class="handle-input"></el-input>
    </el-form-item>
    <el-form-item label="拍卖会专场排序：" prop="orders">
      <el-input v-model="form.orders"  placeholder="请选择拍卖会专场排序" class="handle-input"></el-input>
    </el-form-item>
    <el-form-item label="拍卖会专场拍品量：" prop="total">
      <el-input v-model="form.total"  placeholder="请输入拍卖会专场拍品量" class="handle-input"></el-input>
    </el-form-item>
    <el-form-item label="拍卖会专场封面：" prop="coverPic">
      <label for="inputId" icon="el-icon-plus">
        <img v-if="form.coverPic" :src="form.coverPic" class="img" />
        <img v-else src="~assets/img/headportrait.png" class="img" alt="">
        <input style="display: none" id="inputId" ref="input" type="file"
          accept="image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="handleFileChange" />
      </label>
    </el-form-item>
    <el-form-item label="拍卖会简单描述：" class="" prop="extraInfo">
      <el-table :data="form.extraInfo" border style="width: 1000px">
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
            <el-button v-if="scope.$index" type="primary" size="mini" @click="delExtraInfo(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" size="mini" @click="addExtraInfo()">添加</el-button>
    </el-form-item>
    <el-form-item label="拍卖会详细描述：" class="" prop="detailExtraInfo">
      <el-table :data="form.detailExtraInfo" border style="width: 1000px">
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
            <el-button v-if="scope.$index" type="primary" size="mini" @click="delDetailExtraInfo(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" size="mini" @click="addDetailExtraInfo()">添加</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="$router.push({ path: '/auction', query: { rtype: 2, sessionCode: $route.query.sessionCode } })">返回</el-button>
      <el-button type="primary" @click="saveEdit">确 定</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  export default {
    props: {
      form: {
        type: Object,
        default() {
          return {}
        }
      },
      companyList: {
        type: Array,
        default() {
          return []
        }
      },
      stateList: {
        type: Array,
        default() {
          return []
        }
      },
    },
    data() {
      return {
        rules: {
          coverPic: [{ required: true, message: "请上传拍卖会专场封面", trigger: "blur" }],
          name: [{ required: true, message: "请输入拍卖会专场名称", trigger: "blur" }],
          orders: [{ required: true, message: "请输入拍卖会排序", trigger: "blur" }],
          total: [{ required: true, message: "请输入拍品数量", trigger: "blur" }],
          status: [{ required: true, message: "请选择拍卖会专场状态", trigger: "blur" }],
        }
      }
    },
    methods: {
      addDetailExtraInfo() {
        var newLine = { type: "text", label: "", text: "" };
        this.form.detailExtraInfo.push(newLine)
      },
      delDetailExtraInfo(index, row) {
        this.form.detailExtraInfo.splice(index, 1)
      },
      addExtraInfo() {
        var newLine = { type: "text", label: "", text: "" };
        this.form.extraInfo.push(newLine)
      },
      delExtraInfo(index, row) {
        this.form.extraInfo.splice(index, 1)
      },
      //上传图片
      handleFileChange(e) {
        let file = e.target.files[0];
        let formdata = new FormData();
        formdata.append("file", file);
        this.$uploadPost("/upload/pictureOrVideo", formdata).then((res) => {
          if (res.code == 200) {
            this.form.coverPic = res.data;
          }
        });
      },
      // 保存编辑
      saveEdit() {
        console.log(this.form)
        var result = true
          var message = []
          this.form.detailExtraInfo.forEach((item, index) => {
            let no = index + 1
            if (item.label == '') {
              result = result && false
              message.push('详细描述 第' + no + '行：标题不能为空')
            }
            if (item.text == '') {
              result = result && false
              message.push('详细描述 第' + no + '行：内容不能为空')
            }
          })
          this.form.extraInfo.forEach((item, index) => {
            let no = index + 1
            if (item.label == '') {
              result = result && false
              message.push('简单描述 第' + no + '行：标题不能为空')
            }
            if (item.text == '') {
              result = result && false
              message.push('简单描述 第' + no + '行：内容不能为空')
            }
          })
          if (!result) {
            var temp = '';
            message.forEach(v => {
              temp += `<div>${v}</div>`;
            })
            this.$alert(`${temp}`,"警告",{
              dangerouslyUseHTMLString: true
            });
          }
        this.$refs.form.validate(valid => {
          if (valid && result) {
            this.form.sessionCode=this.$route.query.sessionCode;
            if (this.$route.query.specialCode) {
              this.$post("/market/updateSpecials", this.form).then(res => {
                if (res.code == 200) {
                  this.$router.push({ path: '/auction', query: { rtype: 2, sessionCode: this.$route.query.sessionCode,activeAuction:"a2" } })
                  this.$message.success(res.msg)
                }
              })
            } else {
              this.$post("/market/insertSpecials", this.form).then(res => {
                if (res.code == 200) {
                  this.$router.push({ path: '/auction', query: { rtype: 2, sessionCode: this.$route.query.sessionCode,activeAuction:"a2" } })
                  this.$message.success(res.msg)
                }
              })
            }

          }
        })
      
      },

    }
  }
</script>
<style scoped>
  .handle-input {
    width: 400px;
    display: inline-block;
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