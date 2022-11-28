<template>
  <el-form
    ref="form"
    :model="form"
    label-width="120px"
    v-if="info"
  >

    <el-form-item label="信息分类：">
      <el-select v-model="selectValue">
        <el-option
          v-for="item in info"
          :value="item.category.name"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="新闻标题：">
      <el-input v-model="titleValue"></el-input>
    </el-form-item>

<!--     <el-form-item label="缩略图：">
      <UploadImg></UploadImg>
    </el-form-item> -->

    <el-form-item label="发布日期：">
      <el-date-picker
        v-model="timeValue"
        type="date"
        placeholder="选择日期"
        disabled
      ></el-date-picker>
    </el-form-item>

    <el-form-item label="详细内容：">
    </el-form-item>
    <div class="editor-container">
      <editor
        :init="{ language: 'zh_CN', plugins: 'lists link image table code help wordcount' }"
        api-key='9tpxsmttzfes3ssp4tn9yjgqkbdk5gb5di0gg0rc0if8rvha'
        v-model="contentValue"
      ></editor>
    </div>

    <el-form-item class="save">
      <el-button
        type="primary"
        @click="saveInfo"
      >保存</el-button>
    </el-form-item>
  </el-form>

</template>
 
 <script>
import {
  reactive,
  ref,
  watch,
  getCurrentInstance,
  onMounted,
  nextTick,
} from "vue";
import { useRoute } from "vue-router";
import Editor from "@tinymce/tinymce-vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import UploadImg from "@/components/UploadImg";
// 富文本编辑器

export default {
  components: {
    Editor,
    UploadImg,
  },
  setup(props, { emit }) {
    const route = useRoute();
    const store = useStore();
    // state里面的category
    const info = store.state.category.categoryList;
    const allDetailInfo = store.state.infoList.category_info;
    // 路由id
    const queryIndex = route.query.id;
    // 当前详细信息
    const detailInfo = allDetailInfo.find((item) => item.index == queryIndex);
    // 获取当前路由携带的参数
    console.log(route.query);
    // 分类信息列表
    console.log(detailInfo);
    const selectValue = ref(detailInfo.category_name);
    // 标题值
    const titleValue = ref(detailInfo.title);
    // 内容绑定值
    const contentValue = ref(detailInfo.content);
    // 时间值
    const timeValue = ref(detailInfo.date);
    const form = [];
    const saveInfo = () => {
      const data = reactive({
        category_name: selectValue.value,
        title: titleValue.value,
        content: "",
        index: queryIndex,
        content: contentValue.value,
      });
      console.log(data);

      store.dispatch("infoList/editInfo", data).then(() => {
        ElMessage({
          type: "success",
          message: "保存成功",
        });
      });
    };

    return {
      form,
      selectValue,
      queryIndex,
      detailInfo,
      allDetailInfo,
      info,
      titleValue,
      timeValue,
      saveInfo,
      contentValue,
    };
  },
};
</script>

<style lang="less" scoped>
.editor-container {
  width: 1000px;
  margin-left: 120px;
}
.save {
  margin-top: 20px;
  margin-left: 0px !important;
}
</style>