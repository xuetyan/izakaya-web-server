<template>
  <div class="main-content">
    <div>
      <div class="options">
        <div class="select-box">
          <div class="label">{{ '稀客' + customRareHeader[0] }} {{ '(可搜索)' }}</div>
          <el-select v-model="rareName" filterable clearable placeholder="选择稀客" size="large" @change="selectRareCustom">
            <el-option
              v-for="item in rareList['名称']||[]"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
        <div class="select-box">
          <div class="label">满足tag数(方便价格排序)</div>
          <el-select v-model="satisfiedTagsNum" filterable clearable placeholder="选择" size="large" @change="selectTags">
            <el-option
              v-for="item in 5"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
      </div>

      <div class="custom-box">
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
        <el-table-column label="喜爱tag" prop="like"></el-table-column>
        <el-table-column label="可额外添加tag" prop="extra"></el-table-column>
        <el-table-column label="厌恶tag" prop="hate"></el-table-column>
        <el-table-column label="食材" prop="material"></el-table-column>
        <el-table-column label="厨具" prop="cookware"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive  } from 'vue'

import type { TableDataInterface_rareCostom } from '@/interface/menu'
import { header as custom_rare_header, results as custom_rare_results } from '@/assets/data/rareCustom.js'
import { header as meal_header, results as meal_results } from '@/assets/data/meal.js'

// 选择的稀客
const rareName = ref('')
const satisfiedTagsNum = ref(0)

let allTableData = reactive<TableDataInterface_rareCostom[]>([])
let tableData = reactive<TableDataInterface_rareCostom[]>([])
let customRareInfo = reactive<{[x: string]: string}>({})
// 稀客 喜爱的料理 tag
let customRareInfo_like = reactive<string[]>([])
let customRareInfo_hate = reactive<string[]>([])

const customRareHeader = reactive(custom_rare_header)
const customRareResults = reactive(custom_rare_results)

// 稀客列表
const rareList: { [x: string]: any } = reactive({})
rareList['名称'] = customRareResults.map((m: { [x: string]: any }) => m['名称'])

const selectRareCustom = (val: string) => {
  if(!val) {
    allTableData = []
    tableData = []
    return
  }
  customRareInfo = customRareResults.find((f: { [x: string]: any }) => f[customRareHeader[0]] === val) ?? {}
  customRareInfo_like = customRareInfo[customRareHeader[2]].split('、')
  customRareInfo_hate = customRareInfo[customRareHeader[4]].split('、')
  getMeals(customRareInfo_like, customRareInfo_hate)
}

const selectTags = (num: number | string) => {
  if (typeof num === 'number') {
    allTableData.sort((a: { [x: string]: number }, b: { [x: string]: number }) => b.price - a.price)
    tableData = allTableData.filter(f => f.tagNum === num)
  } else {
    allTableData.sort((a: { tagNum: number }, b: { tagNum: number }) => b.tagNum - a.tagNum)
    tableData = allTableData
  }
}

// 正特性
const getMeals = function(customRareInfo_like: string[], customRareInfo_hate: string[]): void {
  allTableData = []
  for (const meal of meal_results) {
    const mealTags: string[] = meal['正特性'].split('、')
    const likeNum: number = customRareInfo_like.reduce((init: number, cur:string) => (init += (mealTags.includes(cur)? 1: 0)), 0)
    if(likeNum > 0) {
      const hateNum: number = customRareInfo_hate.reduce((init: number, cur:string) => (init += (mealTags.includes(cur) ? 1: 0)), 0)
      // 可额外添加的喜爱的tag
      let extra = reactive<string[]>([])
      extra = customRareInfo_like.filter(f => (!mealTags.includes(f) && !(meal['反特性']?.split('、')??[]).includes(f)))

      let tableDataItem = reactive<TableDataInterface_rareCostom>({
        mealName: meal['名称'],
        tagNum: likeNum - hateNum,
        like: mealTags.filter(f => customRareInfo_like.includes(f)).join('、'),
        hate: mealTags.filter(f => customRareInfo_hate.includes(f)).join('、'),
        extra: extra.join('、'),
        material: meal['食材'],
        cookware: meal['厨具'],
        price: meal['价格/円'],
      })
      allTableData.push(tableDataItem)
    }
  }

  if (typeof satisfiedTagsNum.value === 'number') {
    allTableData.sort((a: { [x: string]: number }, b: { [x: string]: number }) => b.price - a.price)
  } else {
    allTableData.sort((a: { tagNum: number }, b: { tagNum: number }) => b.tagNum - a.tagNum)
  }
  tableData = typeof satisfiedTagsNum.value === 'number' ? allTableData.filter(f => f.tagNum === satisfiedTagsNum.value) : allTableData
}

</script>

<style scoped>
 @import url('../assets/style/searchTable.css');

.custom-box > div > span {
  min-width: 100px;
}
</style>
