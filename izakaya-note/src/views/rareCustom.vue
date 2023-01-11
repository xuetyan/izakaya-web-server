<template>
  <div class="main-content">
    <div>
      <div class="options">
        <div class="select-box">
          <div class="label">{{ '稀客' + customRareHeader[0] }} {{ '(可搜索)' }}</div>
          <el-select v-model="rareName" filterable clearable placeholder="选择稀客" size="large" @change="selectRareCustom">
            <el-option
              v-for="item in rareList[customRareHeader[0]]||[]"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
      </div>
      <div class="custom_rare_info-box">
        <div v-for="(item, index) in Object.keys(customRareInfo)" :key="index">
          <span>{{ item }}</span>
          <span>{{ customRareInfo[item] }}</span>
        </div>
      </div>
    </div>

    <div class="detail-table-box">
      <el-table :data="tableData" stripe fit highlight-current-row height="100%">
        <el-table-column label="菜名" prop="mealName"></el-table-column>
        <el-table-column label="价格" prop="price" sortable></el-table-column>
        <el-table-column label="tag数(喜爱tag - 厌恶tag)" prop="tagNum" sortable></el-table-column>
        <el-table-column label="喜爱tag数" prop="like" sortable></el-table-column>
        <el-table-column label="厌恶tag数" prop="hate" sortable></el-table-column>
        <el-table-column label="食材" prop="material"></el-table-column>
        <el-table-column label="厨具" prop="cookware"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive  } from 'vue'

import type { TableDataInterface_rareCostom } from '@/interface/menu.ts'
import { custom_rare_header, custom_rare_results } from '@/assets/data/rareCustom.js'
import { meal_header, meal_results } from '@/assets/data/meal.js'

// 选择的稀客
const rareName = ref('')
const rareDetail = reactive({})
let tableData = reactive<typeof TableDataInterface_rareCostom[]>([])
let customRareInfo = reactive<{[x: string]: string}>({})
// 稀客 喜爱的料理 tag
let customRareInfo_like = reactive<string[]>([])
let customRareInfo_hate = reactive<string[]>([])

const customRareHeader = reactive(custom_rare_header)
const customRareResults = reactive(custom_rare_results)

// 稀客列表
const rareList: { [ x: string ]: any } = reactive({})
for (const head of customRareHeader) {
  rareList[head] = customRareResults.map((m: { [x: string]: any }) => m[head])
}

const selectRareCustom = (val: string) => {
  customRareInfo = customRareResults.find((f: { [x: string]: any }) => f[customRareHeader[0]] === val) ?? {}
  customRareInfo_like = customRareInfo[customRareHeader[2]].split('、')
  customRareInfo_hate = customRareInfo[customRareHeader[4]].split('、')
  getMeals(customRareInfo_like, customRareInfo_hate)
}

// 正特性
const getMeals = function(customRareInfo_like: string[], customRareInfo_hate: string[]):void {
  tableData = []
  for (const meal of meal_results) {
    const mealTags: string[] = meal['正特性'].split('、')
    const like: number = customRareInfo_like.reduce((init: number, cur:string) => (init += (mealTags.some((s: string) => s === cur)? 1: 0)), 0)
    if(like > 0) {
      const hate: number = customRareInfo_hate.reduce((init: number, cur:string) => (init += (mealTags.some((s: string) => s === cur)? 1: 0)), 0)
      let tableDataItem = reactive<typeof TableDataInterface_rareCostom>({
        mealName: meal['名称'],
        tagNum: like - hate,
        like: like,
        hate: hate,
        material: meal['食材'],
        cookware: meal['厨具'],
        price: meal['价格/円'],
      })
      tableData.push(tableDataItem)
    }
  }
}

</script>

<style scoped>
.main-content {
  height: calc(100% - 80px);
  display: flex;
  flex-direction: column;
}
.main-content .detail-table-box {
  height: 0;
  flex-grow: 1;
}
.options {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 20px;
}

.select-box .label {
  margin-bottom: 6px;
  width: 100%;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: rgb(230, 110, 134);
}

.custom_rare_info-box {
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
}
.custom_rare_info-box div {
  background-color: rgb(226, 215, 232);
  padding: 10px 20px;
  margin: 2px 12px;
  border-radius: 50px;
}
.custom_rare_info-box div span {
  display: inline-block;
  width: 100%;
  text-align: center;
}
.custom_rare_info-box div span:first-child {
  color: #333;
  font-size: 16px;
}
.custom_rare_info-box div span:last-child {
  color: rgb(46, 138, 165);
  font-size: 16px;
}
</style>
