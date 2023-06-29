<template>
  <div class="background"></div>
  <!-- <UploadImage class="upload-bg"></UploadImage> -->
  <div class="main-contain">
    <div class="tabs">
      <div v-for="(tab, index) in tabs" :key="tab.url" class="tab" :class="{active: tabIndex === index}" @click="switchTab(tab, index)">{{ tab.name }}</div>
    </div>

    <div v-if="false" class="get-xlsx">
      <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="readXlsx">
      <span>选择文件名(选择和excel文件名称语义相近的): </span>
      <el-select v-model="fileName">
        <el-option value="meal">菜单</el-option>
        <el-option value="normalCustom">普客</el-option>
        <el-option value="rareCustom">稀客</el-option>
        <el-option value="beverages">酒水</el-option>
        <el-option value="tags">tags</el-option>
      </el-select>
    </div>

    <RouterView />
  </div>
</template>

<script lang="ts" setup name="Menu">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import * as XLSX from 'xlsx'
import { ElMessage } from 'element-plus'
// import UploadImage from '@/components/uploadBgImage.vue'
import type { routeTab } from '@/interface/menu'
import { getExcelDataFile } from '@/api/excel.js'

const router = useRouter()

const backgroundImages = Object.values(import.meta.glob('../../public/bg/*'))

let backgroundImage = ref('')

backgroundImages[0]().then((data: any) => {
  backgroundImage.value = data.default
})

const tabs: Array<routeTab> = [
  {name: '稀客', url: '/rare_custom'},
  {name: '普客', url: '/normal_custom'},
  {name: '酒水', url: '/beverages'}]
let tabIndex = ref(0)
let fileName = ref('')
const switchTab = function(tab: routeTab, index: number) {
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
  console.log(excelData)
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
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: center/contain no-repeat;
}

.upload-bg {
  position: fixed;
  top: 68px;
  right: 50px;
  z-index: 2;
}

.main-contain {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
  opacity: 0.89;
  padding-top: 12px;
}

.tabs {
  background-color: rgb(217, 217, 238);
  padding: 10px 16px;
  display: flex;
  align-items: center;
  border-radius: 50px;
  line-height: 44px;
  margin: 0 0 6px;
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