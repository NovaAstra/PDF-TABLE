<template>
  <div id="app">
    <div class="view-item" style="width: 296mm; height: 209mm;">
      <div class="vue-grid-layout" style="height: 209mm;">
        <div class="vue-grid-item" style="top: 40px;left: 10px;width: 1095px;height: 250px;position: absolute;">
          <div class="gridnew_gadget_tempalte">
            <el-table :data="list" height="250">
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { nextTick } from "vue";

import list from "./data.json";


nextTick(() => {

})
</script>

<style lang="css">
*,
:after,
:before {
  box-sizing: border-box;
}

.view-item {
  box-shadow: 0 2px 4px 0 #0000000a;
  border: 2px solid #0000000f;
  background: #f7f7f7;
  margin: 0 auto 12px;
  overflow: hidden;
}

.vue-grid-layout {
  position: relative;
  transition: height .2s ease;
}

.widget-item {
  background: rgba(0, 0, 0, .02);
  border-radius: 4px 4px 4px 4px;
  border: 2px dashed rgba(0, 0, 0, .06);
  color: rgba(0, 0, 0, .45);
  font-size: 12px;
  cursor: pointer;
}

.gridnew_gadget_tempalte {
  width: 100%;
  height: 100%;
}

.el-table .el-table__cell {
  vertical-align: top;
}
</style>
