<template>
  <div>
    <button size="primary" type="info" icon="plus" @click="getContent">获取内容</button>
    <UEditor ref="ueditor"></UEditor>
  </div>
</template>

<script>
  import UEditor from '@/components/ueditor.vue'

  export default {
    components: { UEditor },
    data() {
      return {
        
      }
    },
    methods: {
      //获取文档内容
      getContent() {
        let content = this.$refs.ueditor.getUEContent();
        console.log(content);
        alert(content);
      }
    }
  }

</script>