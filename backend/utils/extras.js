
export const areSameKeyValues = (arr, keys) => {
    if(arr.length <= 1){
        return true;
    }

    for(const key of keys){
        const value = arr[0][key];
        for(const obj of arr){
            if(JSON.stringify(obj[key]) !== JSON.stringify(value)){
                return false
            }
        }
    }
    return true
}
