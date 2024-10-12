<template>
  <div id="app">
    <div class="content">
      1212123122311212 asadasdsadasd13asa
      1212123122311212 asadasdsadasd2
      1212123122311212 asadasdsadasd34
      1212123122311212 asadasdsadasd
      1212123122311212 asadasdsadasd
      1212123122311212 asadasdsadasd
      1212123122311212 asadasdsadasd
      1212123122311212 asadasdsadasd
      1212123122311212 asadasdsadasd
      1212123122311212 asadasdsadasd
      <div>12312321</div>
      <a href="#">zxz2133333333</a>
      <!-- <a href="#">zxz</a> -->
      <iframe src="" frameborder="0"></iframe>
      <div>
        12123312312312312312123312 czxczxczxczxczxczx asdasdasdasd
        12123312312312312312123312 czxczxczxczxczxczx asdasdasdasd
        12123312312312312312123312 czxczxczxczxczxczx asdasdasdasd
        <div>
          12123312312312312312123312 czxczxczxczxczxczx asdasdasdasd
          12123312312312312312123312 czxczxczxczxczxczx asdasdasdasd
        </div>
        <div>
          12123312312312312312123312 czxczxczxczxczxczx asdasdasdasd
          12123312312312312312123312 czxczxczxczxczxczx asdasdasdasd1
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { nextTick } from "vue";
import { ellipsis } from "./blueprint/ellipsis"

nextTick(() => {
  ellipsis(document.querySelector('.content')!)
})
</script>

<style lang="css">
.content {
  width: 100px;
  height: 80px;
  border: 1px solid red;
  word-break: break-all;
  word-wrap: break-word;
}
</style>
