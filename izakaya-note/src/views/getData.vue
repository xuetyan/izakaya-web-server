<template>
  <div class="tabs">
    <div v-for="(tab, index) in tabs" :key="tab.url" class="tab" :class="{active: tabIndex === index}" @click="switchTab(tab, index)">{{ tab.name }}</div>
  </div>

  <div v-if="true" class="get-xlsx">
    <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="readXlsx">
    <span>选择文件名(选择和excel文件名称语义相近的): </span>
    <el-select v-model="fileName">
      <el-option value="meal">菜单</el-option>
      <el-option value="normalCustom">普客</el-option>
      <el-option value="rareCustom">稀客</el-option>
    </el-select>
  </div>

  <RouterView />
</template>

<script lang="ts" setup name="Menu">
import { ref, reactive  } from 'vue'
import { useRouter } from 'vue-router'
import * as XLSX from 'xlsx'
import { ElMessage } from 'element-plus'
import type { routeTab } from '@/interface/menu.ts'
import { getExcelDataFile } from '@/api/excel.js'

const router = useRouter()

const tabs: Array<typeof routeTab> = [{name: '稀客', url: '/rare_custom'}, {name: '普客', url: '/normal_custom'}]
let tabIndex = ref(0)
let fileName = ref('')
const switchTab = function(tab: typeof routeTab, index: number) {
  tabIndex.value = index
  router.push({ path: tab.url })
}

const excelData = {
  header: null,
  results: null
}

const readXlsx = function(e: any) {
  const files = e.target.files
  const rawFile = files[0] // only use files[0]
  if (!rawFile) return
  upload(rawFile)
}

const upload = function(rawFile: any) {
  readerData(rawFile)
}

const readerData = function(rawFile: Blob) {
  return new Promise<void>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      const data = e?.target?.result
      const workbook = XLSX.read(data, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const header = getHeaderRow(worksheet)
      const results = XLSX.utils.sheet_to_json(worksheet)
      generateData({ header, results })
      resolve()
    }
    reader.readAsArrayBuffer(rawFile)
  })
}

const generateData = function({ header, results }: any) {
  excelData.header = header
  excelData.results = results
  // getExcelDataFile(JSON.parse(decodeURIComponent(window.atob(excelData))))
  if (!fileName.value) {
    ElMessage({type: 'warning',message: '请先选择文件名' })
  } else {
    getExcelDataFile(JSON.stringify({ excelData, fileName: fileName.value }))
  }
}

const getHeaderRow = function(sheet: any) {
  const headers = []
  const range = XLSX.utils.decode_range(sheet['!ref'])
  let C
  const R = range.s.r
  /* start in the first row */
  for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
    const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
    /* find the cell in the first row */
    let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
    if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
    headers.push(hdr)
  }
  return headers
}

</script>

<style scoped>
.tabs {
  background-color: rgb(217, 217, 238);
  padding: 10px 16px;
  display: flex;
  align-items: center;
  border-radius: 50px;
  line-height: 44px;
  margin: 12px 0 6px;
}

.tab {
  width: 30px;
  height: 30px;
  overflow: hidden;
  text-align: center;
  line-height: 30px;
  margin: 0 10px;
  font-size: 16px;
  color: rgba(90, 90, 150, 0.8);
  background-color: rgba(255, 145, 183, 0.5);
  border-radius: 50%;
  cursor: pointer;
  transition-duration: 280ms;
}

.tab.active {
  width: 60px;
  border-radius: 50px;
}

.get-xlsx {
  width: 100%;
  height: 40px;
  line-height: 40px;
  background-color: pink;
  margin-bottom: 50px;
  text-align: center;
}
</style>