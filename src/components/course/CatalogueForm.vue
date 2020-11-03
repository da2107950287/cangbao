<template>
  <div>
    <div style="display: flex;align-items: center;margin-bottom: 20px;">
      <img src="~assets/img/goback.png" @click="goback" class="mr10">
      <h3 v-if="$route.query.catId">查看目录</h3>
      <h3 v-else>添加目录</h3>
    </div>
    <el-divider></el-divider>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">

      <el-form-item label="目录名称：" prop="catName">
        <el-input v-model="form.catName" placeholder="请输入课程名称" class="handle-input"></el-input>
      </el-form-item>
      <el-form-item label="目录类型：" prop="catType">
        <el-select v-model="form.catType" placeholder="请选择状态" class="handle-select mr10">
          <el-option v-for="(item,index) in catalogType" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课程状态：" prop="state">
        <el-select v-model="form.state" placeholder="请选择状态" class="handle-select mr10">
          <el-option v-for="(item,index) in stateList" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目录内容：" prop="content" style="width: 1000px;">
        <label v-if="form.catType==1" for="inputId" icon="el-icon-plus">
          <video v-if="form.content" :src="form.content" controls style="width: 200px;height: 100px;"></video>
          <div v-else style="color: #fff;
        padding:0 5px;background-color: #1296db;width: 60px;border-radius: 5px;">上传视频</div>
          <input style="display: none" id="inputId" ref="input" type="file" @change="handleFileChange" />
        </label>
        <UEditor v-else ref="ueditor"></UEditor>
      </el-form-item>
      <el-form-item>
        <el-button @click="goback">返 回</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import UEditor from '@/components/ueditor.vue'
  export default {
    props: {
      form: {
        type: Object,
        default() {
          return {}
        }
      },
      stateList: {
        type: Array,
        default() {
          return []
        },
      },
      dictionarysList: {
        type: Array,
        default() {
          return []
        },
      }
    },

    data() {
      var validateContent = (rule,value,callback) => {
        if (!this.$refs.ueditor.getUEContent()) {
          return callback(new Error("请输入目录内容"))
        }else{
          return callback();
        }
      }
      return {
        catalogType: [
          { id: "1", name: "视频" },
          { id: "2", name: "图文" }
        ],
        rules: {
          catType: [{ required: true, message: "请选择课程类型", trigger: "blur" }],
          catName: [{ required: true, message: "请输入课程名称", trigger: "blur" }],
          content: [{ required: true, validator: validateContent, trigger: "blur" }],
          state: [{ required: true, message: "请输入选择状态", trigger: "blur" }],
        },
      }
    },
    watch: {
      form() {
        this.$refs.ueditor.setUEContent(this.form.content)
      }
    },
    methods: {
      //上传图片
      handleFileChange(e) {
        let file = e.target.files[0];
        let formdata = new FormData();
        formdata.append("file", file);
        this.$uploadPost("/upload/pictureOrVideo", formdata).then((res) => {
          if (res.code == 200) {
            this.form.content = res.data;
          }
        });
      },
      //修改/添加目录
      saveEdit() {
        if (this.form.catType == 2) {
          this.form.content = this.$refs.ueditor.getUEContent();
        }
        this.form.couId = this.$route.query.couId;
        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.$route.query.catId) {
              this.$post("/course/updateCatalogue", this.form).then(res => {
                if (res.code == 200) {
                  this.$message.success(res.msg)
                  this.goback()
                }
              })
            } else {
              this.$post("/course/insertCatalogue", this.form).then(res => {
                if (res.code == 200) {
                  this.$message.success(res.msg)
                  this.goback()

                }
              })
            }
          }
        })
      },
      goback() {
        this.$router.push({ path: '/course', query: { couId: this.$route.query.couId, type: 2 } })
      }
    },
    components: {
      UEditor
    }
  }
</script>
<style scoped>
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
</style>