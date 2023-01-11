<template>
  <div class="main-content">
    <div>
      <div class="options">
        <div class="select-box">
          <div class="label">{{ '出没地点' }} {{ '(可搜索)' }}</div>
          <el-select v-model="zoneName" filterable clearable placeholder="选择地点" size="large" @change="selectZone">
            <el-option
              v-for="zone in zoneList"
              :key="zone"
              :label="zone"
              :value="zone"
            />
          </el-select>
        </div>
      </div>
  
      <div class="normal-custom-box">
        <div class="custom-info" v-for="custom in currentZoneCustom" :key="custom">
          <span class="custom-name">{{ custom }}</span>
          <span class="custom-tags">{{ getCustomTags(custom) }}</span>
        </div>
      </div>
    </div>

    <div class="detail-table-box">
      <el-table :data="tableData" stripe fit highlight-current-row height="100%">
        <el-table-column label="菜名" prop="mealName"></el-table-column>
        <el-table-column label="价格" prop="price" sortable></el-table-column>
        <el-table-column label="满足4Tag(人数)" prop="haveFour" sortable></el-table-column>
        <el-table-column label="满足3Tag(人数)" prop="haveThree" sortable></el-table-column>
        <el-table-column label="满足2Tag(默认排序)" prop="haveTwo" sortable></el-table-column>
        <el-table-column label="满足1Tag(人数)" prop="haveOne" sortable></el-table-column>
        <el-table-column label="tag" prop="like"></el-table-column>
        <el-table-column label="反向tag" prop="hate"></el-table-column>
        <el-table-column label="厨具" prop="cookware"></el-table-column>
      </el-table>
    </div>
  </div>


  </template>

  <script lang="ts" setup>
  import { ref, reactive  } from 'vue'

  import type { TableDataInterface_normalCostom } from '@/interface/menu.ts'
  import { zones, normal_custom_header, normal_custom_results } from '@/assets/data/normalCustom.js'
  import { meal_header, meal_results } from '@/assets/data/meal.js'

  // 选择的地点
  const zoneName = ref('')
  let tableData = reactive<typeof TableDataInterface_normalCostom[]>([])
  // 当前地点 普客列表
  let currentZoneCustom = reactive<string[]>([])

  // 地点列表
  const zoneList = reactive(zones)
  // 普客列表
  const normalCustomHeader = reactive<string[]>(normal_custom_header)
  const normalCustomResults = reactive(normal_custom_results)

  const selectZone = (val: string) => {
    currentZoneCustom = normalCustomResults.filter((f: { [x: string]: string }) => f['出没地点'].split('、').some(s => s=== val)).map((m: { [x: string]: string }) => m['名称'])
    tableData = getTableData(val)
  }

  const getCustomTags = (customName: string) => {
    const so = normalCustomResults.find(((f: { [x: string]: string }) => f['名称'] === customName))
    return so ? so['喜好·料理'] : ''
  }

  const getTableData = (zoneName: string) => {
    // 普客喜爱tag
    let customTagsList = reactive<string[][]>([])
    customTagsList = normalCustomResults.filter((f: { [x: string]: string }) => f['出没地点'].split('、').some(s => s=== zoneName)).map((m: { [x: string]: string }) => m['喜好·料理'].split('、'))
    // 满足普客tag数
    let TableData = reactive<any[]>([])
    // 菜谱满足普客的tag数
    TableData = meal_results.map((meal: { [x: string]: any }) => {
      // : { [x: string]: any }
      const temp = reactive({
        mealName: meal['名称'],
        like: meal['正特性'],
        hate: meal['反特性']??[],
        material: meal['食材'],
        cookware: meal['厨具'],
        price: meal['价格/円'],
      })
      const tagCount = reactive(customTagsList.map((tags: string[]) => {
        return meal['正特性'].split('、').reduce((init: string, cur: string) => (init += tags.includes(cur) ? 1 : 0), 0)
      }))
      // 符合普客tag 统计
      let stats = reactive<{[x: string]: number}>({ })
      for (const iterator of meal['正特性'].split('、')) {
        stats['none'] = tagCount.reduce((init: number, cur: number) => (init += (cur === 0 ? 1 : 0)), 0)
        stats['haveOne'] = tagCount.reduce((init: number, cur: number) => (init += (cur === 1 ? 1 : 0)), 0)
        stats['haveTwo'] = tagCount.reduce((init: number, cur: number) => (init += (cur === 2 ? 1 : 0)), 0)
        stats['haveThree'] = tagCount.reduce((init: number, cur: number) => (init += (cur === 3 ? 1 : 0)), 0)
        stats['haveFour'] = tagCount.reduce((init: number, cur: number) => (init += (cur === 4 ? 1 : 0)), 0)
      }
      return {...temp, ...stats, tagCount }
    }).sort((a: typeof TableDataInterface_normalCostom, b: typeof TableDataInterface_normalCostom) => b.haveTwo - a.haveTwo)
    return TableData
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
    font-size: 20px;
    font-weight: bold;
    color: rgb(230, 110, 134);
  }

  .normal-custom-box {
    width: calc(100% - 40px);
    display: flex;
    align-content: center;
    flex-wrap: wrap;
  }

  .normal-custom-box .custom-info {
    background-color: rgb(226, 215, 232);
    padding: 10px 20px;
    margin: 2px 12px;
    border-radius: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .normal-custom-box .custom-info span {
    display: inline-block;
    width: 100%;
    text-align: center;
    white-space: nowrap;
  }

  .normal-custom-box .custom-info span:first-child {
  color: #333;
  font-size: 18px;
}
.normal-custom-box .custom-info span:last-child {
  color: rgb(46, 138, 165);
  font-size: 16px;
}
  </style>
