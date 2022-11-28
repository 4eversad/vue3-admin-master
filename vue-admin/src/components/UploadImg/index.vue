<template>
  <el-upload
    class="avatar-uploader"
    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img
      v-if="imageUrl"
      :src="imageUrl"
      class="avatar"
    />
    <el-icon
      v-else
      class="avatar-uploader-icon"
    >
      <Plus />
    </el-icon>
  </el-upload>
</template>

<script>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { UploadProps } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
export default {
  components: {
    Plus,
  },
  setup(props, { emit }) {
    const handleAvatarSuccess = () => {};
    const beforeAvatarUpload = () => {};
    const imageUrl = ref("");
    return {
      handleAvatarSuccess,
      beforeAvatarUpload,
      imageUrl,
    };
  },
};
</script>

<style lang="less" scoped>
.avatar-uploader-icon {
  padding: 50px;
  border: 1px dotted #ccc;
}
</style>