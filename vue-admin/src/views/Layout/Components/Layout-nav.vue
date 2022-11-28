<template >
  <div id="nav-wrapper">
    <h1 class="logo">
      <img
        src="@/assets/images/logo.png"
        alt=""
      />
    </h1>
    <el-menu
      ref="menu"
      default-active="2"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      background-color="transparent"
      text-color="#fff"
      router
      @open="openMenu"
    >
      <!--一级菜单-->
      <template v-for="(item, index) in allRouter">
        <el-sub-menu
          v-if="!item.hidden"
          :index="index + ''"
          :key="item.id"
        >
          <template #title>
            <span :class="item.meta.classname"> </span>
            <span class="menuName">{{ item.meta.name }}</span>
          </template>
          <!--子级菜单-->
          <template v-for="(subItem, index) in item.children">
            <el-menu-item
              :id="item.id"
              :index="subItem.path"
              v-if="!subItem.hidden"
            >{{ subItem.meta.name }}</el-menu-item>
          </template>
        </el-sub-menu>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  setup(props, { emit }) {
    const store = useStore();
    const isCollapse = computed(() => store.state.app.isCollapse);
    const router = useRouter();
    const openIndex = computed(() => store.state.app.openMenuIndex);
    // 获取所有的一级路由
    const allRouter = router.options.routes;

    const openMenu = (path) => {
      store.commit("app/changeMenuIndex", path);
    };

    return {
      isCollapse,
      allRouter,
      openMenu,
    };
  },
};
</script>

<style lang="less" scoped>
#nav-wrapper {
  // z-index: 99;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 250px;
  background-color: #344a5f;
}
.logo {
  img {
    margin: 0 auto;
    width: 70px;
  }
}
.iconfont {
  font-size: 20px;
  margin-right: 10px;
  color: #eee;
}
:deep(.el-menu-item.is-active) {
  background-color: @mainColor;
  color: #fff;
}
.el-menu {
  border: none;
}
.el-menu-item {
  padding-left: 50px !important;
}
.el-sub-menu {
  :deep(.el-tooltip__trigger) {
    // background-color: blue !important;
    z-index: 9;
    .iconfont {
      z-index: 99;
      color: #fff;
      visibility: visible;
      overflow: visible;
      text-align: center;
    }
  }
}

.el-sub-menu {
  /*  :deep(.el-sub-menu__title:hover) {
  background-color: @mainColor !important;
} */
  :deep(.el-sub-menu__title) {
    align-items: flex-start !important;
  }
}

.el-menu--popup-right-start {
  .el-menu-item {
    color: #000 !important;
  }
  .el-menu-item:hover {
    background-color: #eee !important;
  }
}

.open {
  // 取消合并的样式
  #nav-wrapper {
    .logo {
      img {
        margin-top: 20px !important;
        width: 70px;
        transition: all 0.1s linear;
      }
    }
    width: 250px;
    transition: all 0.2s linear;

    .menuName {
      visibility: visible;
      color: #eee !important;
    }
    svg {
      display: visible;
    }
  }
}

.close {
  // 合并时样式
  #nav-wrapper {
    .logo {
      img {
        width: 40px;
        transition: all 0.1s linear;
      }
    }
    overflow: hidden;
    z-index: 99;
    width: 64px;
    transition: all 0.2s linear;
    .iconfont {
      color: #eee !important;
    }
    .menuName {
      visibility: hidden;
      color: #eee !important;
    }
    svg {
      display: none;
    }
  }
}
</style>