<template>
  <div
    id="layout"
    :class="[menuStatus === true ? 'close' : 'open']"
  >
    <layout-header></layout-header>
    <layout-nav></layout-nav>
    <layout-main></layout-main>
  </div>
</template>  

<script>
import LayoutHeader from "../Layout/Components/Layout-header.vue";
import LayoutMain from "../Layout/Components/Layout-main.vue";
import LayoutNav from "../Layout/Components/Layout-nav.vue";
import { computed, ref } from "vue";
import { useStore } from "vuex";

export default {
  components: {
    LayoutHeader,
    LayoutMain,
    LayoutNav,
  },
  setup(props, { emit }) {
    const store = useStore();

    const menuStatus = computed(() => {
      return store.state.app.isCollapse;
    });
    return {
      menuStatus,
    };
  },
};
</script>

<style lang="less" scoped>
</style>

