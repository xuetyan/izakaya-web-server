import request from '@/utils/request.js'

export const getExcelDataFile = function(data) {
    return request({
        url: 'api/getExcelData',
        method: 'post',
        data
    })
}