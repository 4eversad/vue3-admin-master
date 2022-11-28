<template>
  <div class="info-list">
    <!-----------类型选择-------------->
    <el-row :gutter="20">
      <el-col :span="4">
        <el-form-item
          label="类型:"
          style="width: 150px"
        >
          <el-select
            v-model="categoryValue"
            class="m-2"
            placeholder="请选择"
            @change='searchByKeyword'
            clearable
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <!-----------日期选择-------------->
      <el-col :span="9">
        <el-form-item label="日期:">
          <el-date-picker
            v-model="dateValue"
            @change="dateChange"
            type="daterange"
            range-separator="到"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-col>
      <!-----------关键字选择---------->
      <el-col :span="3">
        <el-form-item
          label="关键字:"
          style="width: 140px"
        >
          <el-select
            v-model="search_key"
            placeholder="请选择"
            @change="keywordChange"
            clearable
          >
            <el-option
              v-for="item in searchOption"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <!----------关键字搜索----------->
      <el-col :span="3">
        <el-input
          clearable
          v-model="search_keyword"
          placeholder="搜索关键词"
          @clear='clearInput'
          @input="inputChange"
        />
      </el-col>
      <!----------搜索----------->
      <el-col :span="2">
        <el-button
          type="danger"
          @click="searchKeyword"
        >搜索</el-button>
      </el-col>
      <!----------新增----------->
      <el-col :span="3">
        <el-button
          type="danger"
          @click="isDialogVisible=true"
        >新增</el-button>
      </el-col>
    </el-row>

    <!----------表格数据----------->
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
        prop="title"
        label="标题"
      />
      <el-table-column
        prop="category_name"
        label="分类"
        width="100"
      />
      <el-table-column
        prop="date"
        label="日期"
        width="130"
      />
      <el-table-column
        prop="administrator"
        label="管理员"
        width="200"
      />
      <el-table-column
        prop=""
        label="操作"
        width=""
      >
        <template #default="scope">
          <el-button
            type="danger"
            size="small"
            @click="deleteItem(scope.row)"
          >删除</el-button>

          <el-button
            type="success"
            size="small"
            @click="clickEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <router-link :to="{path: 'infoDetail'
            , query: {id:scope.row.index}}">
            <el-button
              type="warning"
              size="small"
              style="marginLeft: 12px"
            >信息详情</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <!----------批量删除----------->
    <el-row>
      <el-col :span="4">
        <el-button
          size="default"
          class="batchRemove"
          @click="batchDelete"
        >批量删除</el-button>
      </el-col>
      <!----------分页----------->
      <el-col :span="18">
        <!--  <el-pagination
          class="pull-right"
          background
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="1000"
        >
        </el-pagination> -->
      </el-col>
    </el-row>

    <!----------新增弹窗----------->
    <info-dialog
      :flag="isDialogVisible"
      ref="dialog"
      @close="close"
      @addNewCategory="addNewCategory"
      @submitAdd="submitAdd"
    ></info-dialog>

    <!----------编辑弹窗----------->
    <edit-dialog
      :flag="isEditDialogVisible"
      :newsInfo="editRow"
      :newsInfoIndex="editIndex"
      @close="editDialogClose"
      @submitEdit="submitEdit"
    ></edit-dialog>
  </div>
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
import InfoDialog from "./dialog/info-dialog.vue";
import { useStore } from "vuex";
import EditDialog from "./dialog/editDialog.vue";
import { ElMessage } from "element-plus";

export default {
  components: {
    InfoDialog,
    EditDialog,
  },
  setup(props, { emit }) {
    // ref
    const result = getCurrentInstance();
    const $confirm = result.appContext.config.globalProperties.$confirm;
    const categoryValue = ref("");
    let isDialogVisible = ref(false);
    let isEditDialogVisible = ref(false);
    const dateValue = ref("");
    const search_key = ref("");
    const dialog = ref(null);
    const store = useStore();
    const showInfo = store.state.infoList.category_info;
    const editIndex = ref(0);
    let editRow = reactive({});
    let batchDeleteIndex = store.state.infoList.batchDeleteIndex;
    const showInfoList = reactive([]);
    const dayjs = require("dayjs");
    const keywordMode = ref(false);
    const dateSelectMode = ref(false);
    const searchMode = ref(false);
    const dateUnix = reactive([]);
    let dateVal = [];
    const cateName = store.getters["category/getCateName"];
    const options = reactive([]);
    const kword = ref("");
    let currWord = "";
    // 搜索关键词
    const search_keyword = ref(null);
    setTimeout(() => {
      for (let i in cateName) {
        options[i] = { value: "", label: "" };
        options[i].value = cateName[i];
        options[i].label = cateName[i];
      }
    }, 0);

    const searchOption = reactive([{ value: "title", label: "标题" }]);
    let tableData = reactive([]);
    onMounted(() => {
      showInfo.forEach((item) => {
        tableData.push(item);
      });
    });

    // function

    // ----------修改关键词的选项----------
    const keywordChange = (val) => {
      kword.value = val;
      search_keyword.value = "";
      if (!val) {
        searchMode.value = false;
        initInfo();
        nextTick(() => {
          getFinalInfo(dateVal);
        });
      } else {
        searchMode.value = true;
        initInfo();
        nextTick(() => {
          getFinalInfo(dateVal);
        });
      }
    };

    // ----------关键词搜索 点击搜索----------
    const searchKeyword = () => {
      initInfo();

      if (keywordMode.value) {
        getKeywordCategory();
      }
      if (dateSelectMode.value) {
        getDateCategory(dateVal);
      }

      if (!kword.value) {
        ElMessage({
          type: "warning",
          message: "请选择关键词!",
        });
        return;
      }
      if (!search_keyword.value) {
        ElMessage({
          type: "warning",
          message: "请输入关键词!",
        });
        return;
      }
      const reg = new RegExp(currWord);
      const keywordInfo = tableData.filter((item) => {
        return reg.test(item[kword.value]);
      });

      tableData.splice(0, tableData.length);
      nextTick(() => {
        tableData.push(...keywordInfo);
      });
    };
    //---------- 输入框的值改变----------
    const inputChange = (val) => {
      currWord = val;
    };

    // ----------清除输入框----------
    const clearInput = () => {
      initInfo();
      getFinalInfo(dateVal);
    };

    // ----------修改日期----------
    const dateChange = (val) => {
      // console.log(val);
      // 如果取消日期选择
      if (val === null) {
        dateSelectMode.value = false;
        initInfo();
        getFinalInfo(dateVal);
      } else {
        dateSelectMode.value = true;
        initInfo();
        nextTick(() => {
          getFinalInfo(val);
        });
      }
    };

    // ----------获取日期分类信息列表----------
    const getDateCategory = (val) => {
      // 清空数组
      dateVal = val;
      dateUnix.splice(0, dateUnix.length);
      val.forEach((item) => {
        const unixdate = dayjs(item).unix();
        dateUnix.push(unixdate);
      });
      const startTime = dateUnix[0];
      const endTime = dateUnix[1];
      const dateSelectedInfo = tableData.filter((item) => {
        const unix = dayjs(item.date).unix();
        return startTime <= unix && endTime >= unix;
      });

      tableData.splice(0, tableData.length);
      // nextTick(() => {
      tableData.push(...dateSelectedInfo);
      // });
    };

    // ----------类型搜索(改变类型选择/取消选择)----------
    //
    const searchByKeyword = () => {
      search_keyword.value = "";
      if (!categoryValue.value) {
        keywordMode.value = false;
        initInfo();
        nextTick(() => {
          getFinalInfo(dateVal);
        });
      } else {
        // 开启筛选模式
        keywordMode.value = true;
        initInfo();
        nextTick(() => {
          getFinalInfo(dateVal);
        });
      }
    };

    // ----------获取类型选择的信息列表----------

    const getKeywordCategory = () => {
      const filterInfo = tableData.filter(
        (item) => item.category_name === categoryValue.value
      );
      tableData.splice(0, tableData.length);
      // nextTick(() => {
      tableData.push(...filterInfo);
      // });
    };

    // ----------获取最终结果----------
    const getFinalInfo = (val) => {
      if (keywordMode.value == true) {
        getKeywordCategory();
      }
      if (dateSelectMode.value == true) {
        getDateCategory(val);
      }
      if (searchMode.value == true) {
        if (search_keyword.value) {
          searchKeyword(search_keyword);
        }
      }
    };

    // ----------添加分类----------
    const addNewCategory = () => {
      tableData.splice(0, tableData.length);
      tableData.push(...showInfo);
      setTimeout(() => {
        getFinalInfo(dateVal);
      }, 0);
    };

    // ----------初始化tableData----------
    const initInfo = () => {
      // 放入state中的信息列表
      tableData.splice(0, tableData.length);
      // nextTick(() => {
      tableData.push(...showInfo);
      // });
    };

    // ----------关闭对话框(添加)----------
    const close = () => {
      isDialogVisible.value = false;
    };

    // ----------关闭对话框(添加)----------
    const submitAdd = () => {
      isDialogVisible.value = false;
    };
    // ----------编辑框关闭----------
    const editDialogClose = () => {
      isEditDialogVisible.value = false;
    };

    // ----------提交编辑----------
    const submitEdit = () => {
      isEditDialogVisible.value = false;
    };
    // ----------删除弹框弹出------------
    const deleteItem = (row) => {
      $confirm({
        content: "确认删除此信息?",
        fn: confirmDelete,
        payload: row,
      });
    };

    // ----------获取被删除行的index值----------
    const getDeleteIndex = (row) => {
      // console.log(row);
      confirmDelete(row.index);
    };
    // ----------删除----------
    const confirmDelete = (row, showMessage) => {
      console.log("要删除的index: ", row.index);
      store.dispatch("infoList/deleteInfo", row.index).then(() => {
        if (showMessage) {
          ElMessage({
            type: "success",
            message: "删除成功",
          });
        }
        addNewCategory();
      });
    };

    // ----------点击了编辑----------
    const clickEdit = (index, row) => {
      isEditDialogVisible.value = true;
      editIndex.value = index;
      for (var key in row) {
        editRow[key] = row[key];
      }
      console.log(editIndex.value);
      console.log(editRow);
    };

    // ----------添加分类的函数----------
    const handleSelectionChange = (val) => {
      // console.log(val);
      batchDeleteIndex = [];
      val.forEach((item) => {
        batchDeleteIndex.push(item.index);
      });
      // console.log(batchDeleteIndex);
    };

    // ----------批量删除----------
    const batchDelete = () => {
      if (!batchDeleteIndex.length) {
        ElMessage({
          type: "warning",
          message: "请选择要删除的信息",
        });
        return;
      }
      batchDeleteIndex.forEach((index) => {
        confirmDelete(index, false);
      });
      ElMessage({
        type: "success",
        message: "删除成功",
      });
    };

    return {
      // ref
      categoryValue,
      dateValue,
      search_key,
      search_keyword,
      isDialogVisible,
      isEditDialogVisible,
      dialog,
      showInfo,
      editRow,
      editIndex,
      batchDeleteIndex,
      keywordMode,
      dateSelectMode,
      dateVal,
      searchMode,

      // reactive
      options,
      searchOption,
      tableData,
      showInfoList,
      dateUnix,

      // function
      close,
      deleteItem,
      batchDelete,
      addNewCategory,
      submitAdd,
      confirmDelete,
      editDialogClose,
      submitEdit,
      clickEdit,
      handleSelectionChange,
      getDeleteIndex,
      searchByKeyword,
      dateChange,
      initInfo,
      getKeywordCategory,
      getDateCategory,
      getFinalInfo,
      searchKeyword,
      keywordChange,
      clearInput,
      inputChange,
    };
  },
};
</script>

<style lang="less" scoped>
.info-list {
  border: 30px solid #f7f7f7;
}
:deep(.info-list) {
  background-color: #fff !important;
}
.left {
  background-color: #ccc;
}
.right {
  background-color: pink;
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
.pull-right {
  margin-top: 36px;
  float: right;
}
.batchRemove {
  margin-top: 36px;
}
:deep(.el-dialog__body) {
  padding: 30px 47px !important;
}

:deep(.dialog-footer) {
  text-align: center !important;
  .el-button {
    width: 150px;
    margin: 0 11px;
  }
}
</style>