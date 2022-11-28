<template>

  <el-dialog
    v-model="flag"
    title="新增"
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
            :label='item.category'
            :value="item.category"
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
        @click="addSubmit"
      >确认</el-button>
    </div>
  </el-dialog>

</template>

<script>
import dayjs from "dayjs";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import { ref, watch, onMounted, reactive, toRefs } from "vue";
export default {
  props: {
    flag: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    // 表格宽度
    const formLabelWidth = ref("70px");
    const store = useStore();
    const cateName = store.getters["category/getCateName"];
    console.log(cateName);

    const allCategory = reactive([]);
    setTimeout(() => {
      for (let i in cateName) {
        allCategory[i] = { category: "" };
        allCategory[i].category = cateName[i];
      }
    }, 0);

    // 要提交的新增信息
    const form = reactive({
      category_name: "",
      title: "",
      content: "",
      /*       date: "",
      administrator: "", */
    });

    // 添加到state中
    const addSubmit = () => {
      const date = dayjs().format("YYYY-MM-DD");
      const administrator = store.getters["infoList/administratorName"];
      const { category_name, title, content } = form;
      for (var key in form) {
        if (form[key] == "") {
          ElMessage({
            type: "error",
            message: "清填写全部信息",
          });
          return;
        }
      }
      store
        .dispatch("infoList/addInfo", {
          category_name,
          title,
          content,
          date: date,
          administrator,
        })
        .then(() => {
          // console.log(store.state.infoList.category_info);
          // 传递给父组件
          emit("addNewCategory", {
            category_name,
            title,
            content,
            date,
            administrator,
          });
          for (var key in form) {
            form[key] = "";
          }
          emit("submitAdd");
          ElMessage({
            message: `添加成功`,
            type: "success",
          });
        });
    };

    return {
      form,
      formLabelWidth,
      addSubmit,
      allCategory,
    };
  },
};
</script>

<style lang="less" scoped>
</style>