<template>
  <div id="category">
    <el-button
      type="danger"
      @click="addCategory"
    >添加分类 </el-button>
    <hr style="margin-top: 20px; margin-bottom: 10px; border:none ; border-bottom: 1px solid #e9e9e9;" />
    <div>
      <el-row :gutter="30">
        <!-- 左栏 -->
        <el-col :span="8">
          <div class="category-wrapper">
            <!-- 分类1 -->
            <div
              class="category"
              v-for="item in $store.state.category.categoryList"
              :key="item.id"
            >
              <h4>
                <i class="iconfont icon-tianjia1"></i>
                {{item.category.name}}
                <div class="button-group">
                  <!-- 编辑一级分类 -->
                  <el-button
                    type="danger"
                    size="small"
                    round
                    @click="editCategory(item.category.id)"
                  >编辑</el-button>
                  <el-button
                    type="success"
                    size="small"
                    round
                    @click="addSubCategory(item.category.id)"
                  >添加子级</el-button>
                  <el-button
                    size="small"
                    round
                    @click="removeCategory(item.category.id)"
                  >删除</el-button>
                </div>
              </h4>
              <ul>
                <!-- 子级分类 -->
                <template v-for="subItem in item.category.subCategory">
                  <li v-if="subItem.name">
                    {{subItem.name}}
                    <div class="button-group">
                      <el-button
                        type="danger"
                        size="small"
                        round
                        @click="editSubCategory(item.category.id,subItem.id)"
                      >编辑</el-button>
                      <el-button
                        size="small"
                        round
                        @click="removeSubCategory(item.category.id,subItem.id)"
                      >删除</el-button>
                    </div>
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </el-col>

        <!-- 右栏 -->
        <el-col :span="16">
          <div v-show="isEditShow">
            <div class="menu-title">
              {{title}}
            </div>
            <!-- 表单部分 -->
            <el-form
              label-width="142px"
              :model="formLabelAlign"
              style="max-width: 460px"
              class="form"
            >
              <div class="form-item">
                <div v-if="isCategoryInputShow">
                  <el-form-item label="一级分类">
                    <el-input
                      clearable
                      v-model="formLabelAlign.categoryName"
                      v-if="isCategoryInputShow"
                    />
                  </el-form-item>
                </div>
                <div v-if="isSubCategoryInputShow">
                  <el-form-item label="子级分类">
                    <el-input
                      clearable
                      v-model="formLabelAlign.subCategoryName"
                      v-if="isSubCategoryInputShow"
                    />
                  </el-form-item>
                </div>
                <el-form-item>
                  <el-button
                    type="danger"
                    @click="submit"
                  >确定</el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
import { reactive, ref, watch } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";

export default {
  setup(props, { emit }) {
    const store = useStore();
    const labelPosition = ref("right");
    const isEditShow = ref(true);
    const mode = ref("addCategory");
    const isCategoryInputShow = ref(true);
    const isSubCategoryInputShow = ref(true);
    const currentIndex = ref(null);
    const subCurrentIndex = ref(null);
    const formLabelAlign = reactive({
      categoryName: "",
      subCategoryName: "",
    });
    const title = ref("添加分类");
    const state_category = store.state.category.categoryList;
    // console.log(state_category);
    const resetForm = () => {
      for (var key in formLabelAlign) {
        formLabelAlign[key] = "";
      }
    };
    // 提交新增分类
    const submit = () => {
      // 提交编辑后的分类
      if (mode.value == "editCategory") {
        if (checkForm(mode.value) == false) {
          return;
        }
        store
          .dispatch("category/updateCategory", {
            data: formLabelAlign,
            index: currentIndex.value,
          })
          .then(() => {
            ElMessage({
              type: "success",
              message: "编辑成功",
            });
          });
        resetForm();
        changeToAdd();

        return;
      }
      // 提交编辑后的子级
      if (mode.value == "editSubCategory") {
        if (checkForm(mode.value) == false) {
          return;
        }
        store
          .dispatch("category/updateSubCategory", {
            data: formLabelAlign,
            index: currentIndex.value,
            subIndex: subCurrentIndex.value,
          })
          .then(() => {
            resetForm();
            ElMessage({
              type: "success",
              message: "编辑成功",
            });
            changeToAdd();
          });
        return;
      }
      // 添加子级分类
      if (mode.value == "addSubCategory") {
        if (checkForm(mode.value) == false) {
          return;
        }
        store
          .dispatch("category/addSubCategory", {
            data: formLabelAlign,
            index: currentIndex.value,
          })
          .then(() => {
            resetForm();
            ElMessage({
              type: "success",
              message: "添加子级成功",
            });
            changeToAdd();
          });

        return;
      }
      if (mode.value == "addCategory") {
        if (checkForm(mode.value) == false) {
          return;
        }
        store.dispatch("category/addToCategory", formLabelAlign).then(() => {
          ElMessage({
            type: "success",
            message: "添加成功",
          });
          resetForm();
          changeToAdd();
        });
        return;
      }
    };
    // 添加分类
    const addCategory = () => {
      mode.value = "addCategory";
      changeAttribute(mode.value);
    };

    // 添加子级分类
    const addSubCategory = (index) => {
      mode.value = "addSubCategory";
      currentIndex.value = index;
      changeAttribute(mode.value);
    };

    // 编辑分类
    const editCategory = (index) => {
      mode.value = "editCategory";
      changeAttribute(mode.value);
      currentIndex.value = index;
      const editedCategory = state_category.find(
        (item) => item.category.id == index
      );
      formLabelAlign.categoryName = editedCategory.category.name;
    };

    // 编辑子级分类
    const editSubCategory = (index, subIndex) => {
      mode.value = "editSubCategory";
      changeAttribute(mode.value);
      currentIndex.value = index;
      subCurrentIndex.value = subIndex;
      const editCategory = state_category.find(
        (item) => item.category.id == index
      );
      const editedSubCategory = editCategory.category.subCategory.find(
        (i) => i.id == subIndex
      );
      formLabelAlign.subCategoryName = editedSubCategory.name;
      console.log(editedSubCategory);
    };

    // 判断添加/编辑分类/子级分类,改变属性
    const changeAttribute = (mode) => {
      resetForm();
      if (mode == "addCategory") {
        isEditShow.value = true;
        title.value = "添加分类";
        isCategoryInputShow.value = true;
        isSubCategoryInputShow.value = true;
        resetForm();
      }
      if (mode == "addSubCategory") {
        title.value = "添加子级分类";
        isCategoryInputShow.value = false;
        isSubCategoryInputShow.value = true;
      }
      if (mode == "editCategory") {
        title.value = "编辑一级分类";
        isCategoryInputShow.value = true;
        isSubCategoryInputShow.value = false;
      }
      if (mode == "editSubCategory") {
        title.value = "编辑子级分类";
        isCategoryInputShow.value = false;
        isSubCategoryInputShow.value = true;
      }
    };
    const changeToAdd = () => {
      mode.value = "addCategory";
      changeAttribute(mode.value);
    };

    // 删除大分类
    const removeCategory = (index) => {
      currentIndex.value = index;
      store.dispatch("category/removeCategory", currentIndex.value).then(() => {
        ElMessage({
          type: "success",
          message: "删除成功",
        });
      });
    };

    // 删除子级分类
    const removeSubCategory = (index, subIndex) => {
      store
        .dispatch("category/removeSubCategory", { index, subIndex })
        .then(() => {
          ElMessage({
            type: "success",
            message: "删除成功",
          });
        });
    };
    const checkForm = (mode) => {
      // 添加分类
      if (mode == "addCategory") {
        if (!formLabelAlign.categoryName) {
          checkCategoryMessage();
          return false;
        }
        if (!formLabelAlign.subCategoryName) {
          checkSubCategoryMessage();
          return false;
        }
      }

      // 添加子级分类
      if (mode == "addSubCategory") {
        if (!formLabelAlign.subCategoryName) {
          checkSubCategoryMessage();

          return false;
        }
      }

      // 编辑分类
      if (mode == "editCategory") {
        if (!formLabelAlign.categoryName) {
          checkCategoryMessage();
          return false;
        }
      }

      // 编辑子级分类;
      if (mode == "editSubCategory") {
        if (!formLabelAlign.subCategoryName) {
          checkSubCategoryMessage();
          return false;
        }
      }
    };
    // 添加分类提示
    const checkCategoryMessage = () => {
      ElMessage({
        type: "warning",
        message: "请输入分类",
      });
    };

    // 添加子级分类提示
    const checkSubCategoryMessage = () => {
      ElMessage({
        type: "warning",
        message: "请输入子级分类",
      });
    };

    return {
      // ref
      labelPosition,
      isEditShow,
      mode,
      title,
      isCategoryInputShow,
      isSubCategoryInputShow,
      currentIndex,
      subCurrentIndex,

      // reactive
      formLabelAlign,

      // function
      submit,
      addCategory,
      editCategory,
      editSubCategory,
      addSubCategory,
      removeCategory,
      removeSubCategory,
    };
  },
};
</script>

<style lang="less" scoped>
#category {
  height: 100vh;
  // overflow-y: scroll;
  border: 30px solid #f7f7f7;
  border-right: 0;
}
.form {
  width: 410px;
  .form-item {
    margin-top: 18px;
  }
}
.menu-title {
  line-height: 44px;
  padding-left: 22px;
  background-color: #f3f3f3;
}
.category-wrapper {
  div:nth-child(1) {
    &:before {
      top: 20px;
    }
  }
  div:last-child {
    &:before {
      bottom: 20px;
    }
  }
  .category {
    line-height: 44px;
    position: relative;
    &:before {
      content: "";
      position: absolute;
      left: 23px;
      top: 0;
      bottom: 0;
      width: 32px;
      border-left: 1px dotted #000;
    }

    h4 {
      padding-left: 40px;
      position: relative;
      i {
        position: absolute;
        top: 0px;
        left: 16px;
      }
    }
    li {
      position: relative;
      padding-left: 36px;
      margin-left: 24px;
      &:before {
        content: "";
        position: absolute;
        left: 0;
        top: 22px;
        width: 32px;
        border-bottom: 1px dotted #000;
      }
    }
  }
}
h4,
li {
  &:hover {
    background-color: #f3f3f3;
    transition: all 0.2s linear 0s;
    .button-group {
      display: block;
    }
  }
}
.button-group {
  display: none;
  position: absolute;
  right: 11px;
  top: 0;
  z-index: 2;
}
</style>