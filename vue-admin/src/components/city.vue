<template >
  <div class="city">
    <div
      class="location"
      @click.stop="toggle"
    >
      <span
        class="detail-location"
        v-if="!locationData.fullLocation"
      >{{title}}</span>
      <span
        class="detail-location"
        v-else
      >{{locationData.fullLocation}}</span>
      <div
        class="options"
        ref="target"
        v-if="isShow"
      >
        <!-- 显示的详细地区 -->
        <span
          class="detail"
          v-for="item in currentList"
          @click="changeItem(item)"
        >{{item.name}}</span>
      </div>

    </div>
  </div>
</template>

<script>
import axios from "axios";
import { reactive, ref, computed, nextTick } from "vue";
import { onClickOutside } from "@vueuse/core";

export default {
  props: {
    title: {
      type: String,
      default: "请选择地区",
    },
  },
  // 省: province
  // 市:city
  // 区:district
  setup(props, { emit }) {
    const isShow = ref("");
    const allCityData = ref([]);
    const target = ref("");
    let isClickOutside = ref(false);
    const locationData = reactive({
      provinceCode: "",
      provinceName: "",
      cityCode: "",
      cityName: "",
      districtCode: "",
      dostrictName: "",
      fullLocation: "",
    });

    const currentList = computed(() => {
      let list = allCityData.value;
      if (locationData.provinceCode && locationData.provinceName) {
        list = list.find(
          (item) => item.code == locationData.provinceCode
        ).areaList;
      }
      if (locationData.cityCode && locationData.cityName) {
        list = list.find(
          (item) => item.code === locationData.cityCode
        ).areaList;
      }

      return list;
    });

    // 点击地区以后
    const changeItem = (item) => {
      if (item.level == 0) {
        locationData.provinceCode = item.code;
        locationData.provinceName = item.name;
      }

      if (item.level == 1) {
        locationData.cityCode = item.code;
        locationData.cityName = item.name;
      }
      if (item.level == 2) {
        locationData.districtCode = item.code;
        locationData.dostrictName = item.name;
        locationData.fullLocation = `${locationData.provinceName} ${locationData.cityName} ${locationData.dostrictName}`;
        close(true);
        emit("locationCompleted", locationData.fullLocation);
      }
    };

    const getLocation = () => {
      return new Promise((resolve, reject) => {
        if (window.cityData) {
          resolve(window.cityData);
        } else {
          const url =
            "https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json";
          axios.get(url).then((res) => {
            window.cityData = res.data;
            resolve(res.data);
          });
        }
      });
    };
    // 切换
    const toggle = (e) => {
      if (!isShow.value && !isClickOutside.value) {
        open();

        for (let key in locationData) {
          locationData[key] = "";
        }
      } else {
        isClickOutside.value = false;
      }
    };
    // 点击元素外部关闭城市选择框
    onClickOutside(target, () => {
      // 只有点击了元素外部才会触发该事件
      close(true);
      setTimeout(() => {
        isClickOutside.value = false;
      }, 0);
    });
    const open = () => {
      console.log("open");

      isShow.value = true;
      getLocation().then((res) => {
        allCityData.value = res;
      });
    };
    const close = (param) => {
      isClickOutside.value = param;
      isShow.value = false;
      console.log("close");
    };
    return {
      getLocation,
      locationData,
      allCityData,
      toggle,
      isShow,
      currentList,
      changeItem,
      target,
    };
  },
};
</script>

<style lang="less" scoped>
.location {
  position: relative;
  .detail-location {
    border-radius: 5px;
    border: 1px solid #ccc;
    padding: 8px 20px;
  }
  .options {
    z-index: 999;
    padding: 20px 10px;
    display: flex;
    position: absolute;
    top: -100px;
    left: 130px;
    width: 450px;
    // height: 210px;
    background-color: #f7f7f7;
    border: 1px solid #ccc;

    flex-wrap: wrap;
    justify-content: space-around;
    .detail {
      padding: 4px 10px;
      font-size: 14px;
      color: #666;
      cursor: pointer;
      &:hover {
        background-color: #eee;
        border-radius: 5px;
      }
    }
  }
}
</style>