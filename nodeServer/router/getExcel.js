const fs = require('fs')

const getExcel = async(ctx, next) => {
    ctx.response.body = 'success'
    writeStr = `export const header = JSON.parse('${JSON.stringify(ctx.request.body.excelData.header)}')
export const results = JSON.parse('${JSON.stringify(ctx.request.body.excelData.results)}')
    `

    fs.writeFileSync(`../../izakaya-note/src/assets/updateData/${ctx.request.body.filename||'test'}.js`, writeStr)
}

const userRoutes = [{
    type: 'post',
    url: '/getExcelData',
    method: getExcel
}]

module.exports = userRoutes