<template>

  <el-dialog
    v-model="flag"
    title="编辑"
    width="580px"
  >
    <el-form :model="form">
      <el-form-item
        label="类别"
        :label-width="formLabelWidth"
      >
        <el-select
          v-model="form.category_name"
          placeholder="请选择"
        >
          <el-option
            v-for="item in allCategory"
            :label='item.category.name'
            :value="item.category.name"
          />

        </el-select>
      </el-form-item>
      <el-form-item
        label="标题"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="form.title"
          autocomplete="off"
          placeholder="请输入内容"
        />
      </el-form-item>

      <el-form-item
        label="概况"
        :label-width="formLabelWidth"
      >
        <el-input
          type="textarea"
          v-model="form.content"
          autocomplete="off"
          placeholder="请输入内容"
        />
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="flag=false">取消</el-button>
      <el-button
        type="danger"
        @click="submitEdit"
      >确认</el-button>
    </div>
  </el-dialog>

</template>

<script>
import dayjs from "dayjs";
import { useStore } from "vuex";
import { ref, watch, onMounted, reactive, computed } from "vue";
import { ElMessage } from "element-plus";

export default {
  props: {
    flag: {
      type: Boolean,
      default: false,
    },
    newsInfo: {
      type: Object,
      default: {},
    },
    newsInfoIndex: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const formLabelWidth = ref("70px");
    const store = useStore();
    const allCategory = store.state.category.categoryList

    watch(
      () => props.newsInfo,
      (newVal) => {
      },
      { immediate: true }
    );
    // 要提交的新增信息
    const form = props.newsInfo;
    // 确认提交
    const submitEdit = () => {
      console.log("submitEdit 子组件内");
      console.log(form);

      store.commit("infoList/editInfo", props.newsInfo);
      emit("submitEdit");
      ElMessage({
        message: `编辑成功`,
        type: "success",
      });
    };

    return {
      form,
      formLabelWidth,
      allCategory,
      submitEdit,
    };
  },
};
</script>s
<style lang="less" scoped>
</style>