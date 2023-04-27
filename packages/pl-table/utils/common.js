// 判断类型
export const typeIs = (basic) => {
    let type = Object.prototype.toString.call(basic).slice(8,-1)
    return type.toLowerCase()
}
// 判断数组
export const isArrayFn = (value) => {
    if (typeof Array.isArray === 'function') {
        return Array.isArray(value);
    } else {
        return Object.prototype.toString.call(value) === '[object Array]';
    }
}
// 转换高度
export const parseHeight = (height) => {
    if (typeof height === 'number') {
        return height;
    }
    if (typeof height === 'string') {
        if (/^\d+(?:px)?$/.test(height)) {
            return parseInt(height, 10);
        } else {
            return height;
        }
    }
    return null;
}
// 数组对象去重的方法
export const removalDataObj = (arr, key) => {
    if (this.isArrayFn(arr)) {
        let result = [];
        let obj = {};
        for(let i =0; i<arr.length; i++){
            if(!obj[arr[i].row[key]]){
                result.push(arr[i]);
                obj[arr[i].row[key]] = true;
            }
        }
        return result
    } else {
        throw new Error('需要的是数组');
    }
}
