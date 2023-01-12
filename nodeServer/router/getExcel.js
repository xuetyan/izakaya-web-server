const fs = require('fs')

const getExcel = async(ctx, next) => {
    writeStr = `export const header = JSON.parse('${JSON.stringify(ctx.request.body.excelData.header)}')
    export const results = JSON.parse('${JSON.stringify(ctx.request.body.excelData.results)}')
    `
    console.log(ctx.request.body.fileName)
    fs.writeFileSync(`../izakaya-note/src/assets/data/${ctx.request.body.fileName||'test'}.js`, writeStr)
    ctx.response.body = 'success'
}

const userRoutes = [{
    type: 'post',
    url: '/getExcelData',
    method: getExcel
}]

module.exports = userRoutes