<template>
  <el-dialog
    v-model="flag"
    title="新增"
    width="530px"
  >
    <el-form :model="form">

      <!-- 用户名 -->
      <el-form-item
        label="用户名: "
        :label-width="formLabelWidth"
        style="marginLeft: 30px;marginBottom: 20px;"
      >
        <el-input
          v-model="form.username"
          autocomplete="off"
          placeholder="请输入用户名"
          style="width: 310px"
        />
      </el-form-item>

      <!-- 真实姓名 -->
      <el-form-item
        label="姓名: "
        :label-width="formLabelWidth"
        style="marginLeft: 30px;marginBottom: 20px;"
      >
        <el-input
          v-model="form.realName"
          autocomplete="off"
          placeholder="请输入真实姓名"
          style="width: 310px"
        />
      </el-form-item>

      <!-- 手机号 -->
      <el-form-item
        label="手机号: "
        :label-width="formLabelWidth"
        style="marginLeft: 30px;marginBottom: 20px;"
      >
        <el-input
          v-model="form.tel"
          autocomplete="off"
          placeholder="请输入手机号"
          style="width: 310px"
        />
      </el-form-item>

      <!-- 地区 -->
      <el-form-item
        label="地区: "
        :label-width="formLabelWidth"
        style="marginLeft: 30px;marginBottom: 20px;"
      >
        <city
          :title="title"
          @locationCompleted="locationCompleted"
        ></city>
      </el-form-item>

      <!-- 是否启用 -->
      <el-form-item
        label="是否启用:"
        :label-width="formLabelWidth"
        style="marginLeft: 30px;marginBottom: 20px;"
      >
        <el-radio-group
          v-model="form.isValid"
          style="marginLeft: 20px"
        >
          <el-radio :label="true">启用</el-radio>
          <el-radio :label="false">禁用</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 角色 -->
      <el-form-item
        label="角色: "
        :label-width="60"
        style="marginLeft: 30px;marginBottom: 30px;"
      >
        <div style="margin-top: -3px">
          <el-radio-group v-model="form.role">
            <el-radio-button label="系统管理员" />
            <el-radio-button label="信息管理员" />
            <el-radio-button label="用户管理员" />
          </el-radio-group>
        </div>
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
import city from "../../../components/city.vue";
export default {
  components: { city },
  props: {
    flag: {
      type: Boolean,
      default: false,
    },
    cityData: {
      type: Object,
      default: {},
    },
  },
  setup(props, { emit }) {
    // 表格宽度
    const title = ref("请选择地区");
    const formLabelWidth = ref("75px");
    // const radioValue = ref("");
    const store = useStore();
    const cateName = store.getters["category/getCateName"];
    const roleValue = ref("");
    const allCategory = reactive([]);
    setTimeout(() => {
      for (let i in cateName) {
        allCategory[i] = { category: "" };
        allCategory[i].category = cateName[i];
      }
    }, 0);

    // 要提交的新增信息
    const form = reactive({
      username: "",
      realName: "",
      tel: "",
      address: "",
      role: "",
      isValid: "",
    });

    watch(
      () => form.isValid,
      (val) => {
        console.log(val);
      }
    );

    // 完成地区的填写
    const locationCompleted = (fullLocation) => {
      console.log(fullLocation);
      form.address = fullLocation;
    };
    // 添加到state中
    const addSubmit = () => {
      const { username, realName, tel, address, role, isValid } = form;
      for (var key in form) {
        if (form[key] === "") {
          ElMessage({
            type: "error",
            message: "请填写全部信息",
          });
          return;
        }
      }
      store
        .dispatch("user/addUser", {
          username,
          realName,
          tel,
          address,
          role,
          isValid,
        })
        .then(() => {
          console.log(store.state.user.userInfo);
          // 通知父组件改值
          emit("addedUser", form.isValid);
          clearDialog();
        });
    };
    const clearDialog = () => {
      for (var key in form) {
        form[key] = "";
      }
    };

    return {
      roleValue,
      form,
      formLabelWidth,
      addSubmit,
      allCategory,
      title,
      locationCompleted,
    };
  },
};
</script>

<style lang="less" scoped>
.dialog-footer {
  text-align: center !important;
  .el-button {
    width: 150px;
    margin: 0 11px;
  }
}
:deep(.el-dialog) {
  :deep(.el-dialog__body) {
    padding: 30px 47px !important;
  }
}
</style>