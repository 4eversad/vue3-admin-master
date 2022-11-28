<template>
  <div id="main-wrapper">
    <div class="main-content">
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>

#main-wrapper {
  overflow-y: scroll;
  overflow-x: hidden;
  // height: 100%;
  position: fixed;
  top: 90px;
  left: @navMenu;
  right: 0;
  bottom: 0;
  // background-color: #fff !important;
  // border: 30px solid #f7f7f7;
  box-sizing: border-box;
}

.close {
  #main-wrapper {
     
    left: @navMenu - 186px;
    transition: all 0.2s linear;
  }
}
.open {
  #main-wrapper {
    left: @navMenu;
    transition: all 0.2s linear;
  }
}
</style>