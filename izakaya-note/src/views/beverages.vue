<template>
  <div class="main-content">
    <div>
      <div class="options">
        <div class="select-box">
          <div class="label">酒水tag (可搜索)</div>
          <el-select v-model="beveragesTag" filterable clearable size="large" @change="selectTag">
            <el-option v-for="tag in beveragesTags" :value="tag" :label="tag" :key="tag"></el-option>
          </el-select>
        </div>
      </div>

      <div class="custom-box"></div>
    </div>

    <div class="detail-table-box">
      <el-table :data="tableData" stripe fit highlight-current-row height="100%">
        <el-table-column label="酒水名" prop="name"></el-table-column>
        <el-table-column label="价格(默认排序)" prop="price"></el-table-column>
        <el-table-column label="tag" prop="tags"></el-table-column>
        <!-- <el-table-column label="来源" prop="from"></el-table-column> -->
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue"
import {  header as beverages_header, results as beverages_results } from "@/assets/data/beverages.js"

// 选中的tag
const beveragesTag = ref('')

let tableData = reactive([])

let beveragesTags = [...new Set(beverages_results.reduce((init: string[], cur: { [x: string]: any }) => {
    init = init.concat(cur['特性'].split('、'))
    return init
}, []))]

const selectTag = (tag: string) => {
    tableData = beverages_results.filter((f:  { [x: string]: any }) => f['特性'].includes(tag)).sort((a: { [x: string]: any }, b: { [x: string]: any }) => (b['价格'] - a['价格'])).map((m: {[x: string]: any }) => {
        return {
            name: m['名称'],
            price: m['价格'],
            tags: m['特性'],
            from: m['获取方式（仅采集和购买）'],
        }
    })
}



</script>

<style scoped>
 @import url('../assets/style/searchTable.css');
</style>