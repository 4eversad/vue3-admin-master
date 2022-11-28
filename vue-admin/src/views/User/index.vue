<template>
  <div class="wrapper">
    <el-row>
      <el-col :span="20">
        <div class="label-wrap">
          <div class="wrap-content">
            <el-row :gutter="16">
              <el-col :span="2">
                <label class="keyword">关键字：</label>
              </el-col>
              <el-col :span="5">
                <el-input placeholder="请输入搜索的关键字"></el-input>
              </el-col>
              <el-col :span="15">
                <el-button
                  type="danger"
                  @click="searchQuery"
                >搜索</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col
        :span="4"
        style="lineHeight: 50px"
      >
        <el-button
          type="danger"
          class="pull-right"
          @click="clickAddUser"
        >添加用户</el-button>
      </el-col>
    </el-row>

    <!--表格内容-->
    <div class="table">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="45"
        />
        <el-table-column
          prop="username"
          label="邮箱/用户名"
          width="180"
        />
        <el-table-column
          prop="realName"
          label="真实姓名"
          width="100"
        />
        <el-table-column
          prop="tel"
          label="手机号"
          width="200"
        />
        <el-table-column
          prop="address"
          label="地区"
          width=""
        />
        <el-table-column
          prop="role"
          label="角色"
          width="95"
        />
        <el-table-column
          prop="isValid"
          label="禁启用状态"
          width="100"
        >
          <template #default="scope">
            <el-switch
              v-model="tableData[scope.$index].isValid"
              @change="switchChange($event, tableData[scope.$index])"
              size="small"
            />
          </template>

        </el-table-column>
        <el-table-column
          prop=""
          label="操作"
          width="200"
        >
          <!-- 操作部分 -->
          <template #default="scope">
            <el-button
              type="danger"
              size="small"
              @click="deleteRow(scope.row)"
            >删除</el-button>
            <el-button
              type="success"
              size="small"
              @click="clickEdit(scope.$index, scope.row)"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!----------批量删除----------->
    <el-row>
      <el-col :span="4">
        <el-button
          size="default"
          class="batchRemove"
          @click="batchRemove"
        >批量删除</el-button>
      </el-col>
    </el-row>
  </div>
  <add-dialog
    :flag="isDialogOpen"
    ref="addDialog"
    @close="closeDialog"
    @addedUser="addedUser"
  >
  </add-dialog>
</template>

<script>
import { nextTick, onMounted, reactive, getCurrentInstance, ref } from "vue";
import { useStore } from "vuex";
import addDialog from "./components/addDialog.vue";
import { ElMessage } from "element-plus";
import City from "../../components/city.vue";

export default {
  components: {
    addDialog,
    City,
  },
  setup(props, { emit }) {
    const result = getCurrentInstance();
    const $confirm = result.appContext.config.globalProperties.$confirm;
    onMounted(() => {
      // 加载组件时先初始化列表
      initUser();
    });
    // ----------ref
    const store = useStore();
    const allUser = store.state.user.userInfo;
    const addDialog = ref(null);
    const isDialogOpen = ref(false);
    const switchValue = ref(true);

    // ---------reactive
    const tableData = reactive([]);

    // ----------function

    // 初始化表格数据
    const initUser = () => {
      tableData.splice(0, tableData.length);
      nextTick(() => {
        tableData.push(...allUser);
      });
      // console.log(allUser);
    };

    // 勾选选项时的回调函数
    const handleSelectionChange = () => {
      console.log(1);
    };

    // 点击了添加用户
    const clickAddUser = () => {
      isDialogOpen.value = true;
    };
    // 成功添加用户(emit父传子)
    const addedUser = (switchVal) => {
      initUser();
      closeDialog();

      console.log(switchVal);
    };
    // 关闭了添加的对话框
    const closeDialog = () => {
      isDialogOpen.value = false;
    };

    // 获取删除行列表
    const deleteRow = (row) => {
      $confirm({
        content: "确认删除?",
        fn: confirmDelete,
        payload: row,
      });
      /* store.dispatch("user/deleteUser", row.index).then(() => {
        ElMessage({
          type: "success",
          message: "删除成功",
        });
      }); */
    };

    // 确认删除
    const confirmDelete = (row) => {
      console.log(row);

      store.dispatch("user/deleteUser", row).then(() => {
        ElMessage({
          type: "success",
          message: "删除成功",
        });
        initUser();
      });
    };
    // 批量删除
    const batchRemove = () => {};

    // 禁启用改变
    const switchChange = (val, index) => {
      console.log(tableData);
      store.dispatch("user/updateUser", tableData);
    };
    const searchQuery = () => {};

    return {
      // ref
      switchValue,
      isDialogOpen,

      // reactive
      tableData,

      // function
      addDialog,
      batchRemove,
      handleSelectionChange,
      clickAddUser,
      closeDialog,
      switchChange,
      addedUser,
      deleteRow,
      searchQuery,
    };
  },
};
</script>

<style lang="less" scoped>
.wrapper {
  padding: 30px;
}
.label-wrap {
  line-height: 50px;
}

:deep(.el-table) tr {
  th {
    // background-color: pink ;
    text-align: center;
    font-weight: 700;
    color: #344a5f;
  }
  td {
    // background-color: pink ;
    text-align: center;
    font-size: 14px;
  }
}
.table {
  margin-top: 10px;
}
.batchRemove {
  margin-top: 10px;
}
:deep(.el-dialog__body) {
  padding: 30px 47px !important;
}
</style>