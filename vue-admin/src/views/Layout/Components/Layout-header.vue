<template>
  <div id="header-wrapper">
    <div class="header-icon">
      <!-- 头部左侧 -->
      <span
        class="pull-left iconfont icon-caidan"
        @click="changeMenuStatus"
      ></span>
      <!-- 头部右侧 -->
      <div class="pull-right">
        <img
          class="user"
          src="@/assets/images/face.jpg"
          alt=""
        />
        <i class="username">{{username}}</i>
        <span
          class="iconfont icon-dianyuan"
          @click="exit"
        ></span>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue-demi";
import { useStore } from "vuex";
import { useRouter } from "vue-router" 
export default {
  setup(props, { emit }) {
    const store = useStore();
    const router = useRouter()
    const username = computed(() => store.state.app.username);
    const exit = () => {
      store.dispatch('app/logout').then(() => {

        router.push("/login");
        console.log(store.state.app);
        
      })
    };

    // 收起/打开菜单
    const changeMenuStatus = () => {
      store.dispatch("app/setMenuStatus");
    };
    return {
      changeMenuStatus,
      store,
      username,
      exit,
    };
  },
};
</script>

<style lang="less" scoped>
#header-wrapper {
  position: fixed;
  left: @navMenu;
  right: 0;
  height: 75px;
  background-color: #fff;
  box-shadow: 0 3px 16px 0 rgba(0, 0, 0, 0.1);
  z-index: -1;
  // border-bottom: 1px solid #000;
  margin-bottom: 1px;
  .header-icon {
    z-index: -1;
    line-height: 75px;
    display: flex;
    padding: 0 35px;
    justify-content: space-between;
    span {
      font-size: 26px;
    }
    .pull-left {
      cursor: pointer;
    }
    .pull-right {
      display: flex;
      align-items: center;
      .username {
        margin-right: 15px;
      }
      .icon-dianyuan {
        padding: 0 10px;
        border-left: 1px solid #ccc;
        cursor: pointer;
      }
      .user {
        margin-right: 15px;
        display: inline-block;
        line-height: 75px;
        width: 36px;
        height: 36px;
        background-color: pink;
        cursor: pointer;
      }
    }
  }
}
.close {
  #header-wrapper {
    left: @navMenu - 186px;
    transition: all 0.2s linear;
  }
}
.open {
  #header-wrapper {
    left: @navMenu;
    transition: all 0.2s linear;
  }
}

/* .user {
  position: absolute;
  display: inline-block;
  right: 70px;
  } */
</style>