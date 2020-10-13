<template>
  <div>
    <script id="editor" type="text/plain"></script>
  </div>
</template>
<script>
  import'../../../public/ueditor/ueditor.config.js'
　import'../../../public/ueditor/ueditor.all.min.js'
　import'../../../public/ueditor/lang/zh-cn/zh-cn.js'
　import'../../../public/ueditor/ueditor.parse.min.js'
  export default {
    name: 'UE',
    data() {
      return {
        editor: null,
        id: Math.random().toString(16).substring(2) + 'ueditorId'
      }
    },
    props: {
      defaultMsg: {
        type: String
      },
      config: {
        type: Object
      }
    },
    mounted() {
      const _this = this;
      // console.log(this.id)
      // console.log(this.$refs.editor)
      // this.$refs.editor.id = this.id;
      this.editor = UE.getEditor("editor", this.config); // 初始化UE
      this.editor.addListener("ready", function () {
        _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
      });
    },
    methods: {
      getUEContent() { // 获取内容方法
        return this.editor.getContent()
      }
    },
    destroyed() {
      this.editor.destroy();
    }
  }
</script>