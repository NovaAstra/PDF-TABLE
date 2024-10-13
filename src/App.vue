<template>
  <div id="app">
    <div class="content" v-html="html">
    </div>
  </div>
</template>
<script setup lang="ts">
import { nextTick } from "vue";
import { ellipsis } from "./blueprint/ellipsis"

const html = `
<span>{{zxczxcczxczxczxxczzxzcz}}</span>,
<span>{{sazsasa213,21cczcxz}}</span>,
<span>{{zxczxcczxczxczxxczzxzczsadddddddddddddddddddddddddsadasddddddddasdsad}}</span>
<span>{{zxczxcczxczxczxxczzxzczsadddddddddddddddddddddddddsadasddddddddasdsad}}</span>
<span>{{zxczxcczxczxczxxczzxzcz}}</span>,
`

nextTick(() => {
  ellipsis(document.querySelector('.content')!, {
    clamp: 3,
    splitOnChars: /(,(?![^{}]*}}))/,
    truncationText: '',
    truncationHTML: (low: any, segments, node, element) => {
      console.log(low, segments, element.innerHTML.match(/{{.*?}}/g))
      return `<span><span>...</span>,<span>+${low}</span></span>`
    }
  })
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
