class DataComparator {
    constructor() {
        this.fields = NaN;
    }

    init(fields) {
        this.fields = fields;
    }

    findChangedValues(oldValues, newValues) {
        const changedValues = {};

        for (const key in oldValues) {
            if (oldValues.hasOwnProperty(key) && newValues.hasOwnProperty(key)) {
                if (Array.isArray(oldValues[key]) && Array.isArray(newValues[key])) {
                    if (oldValues[key].length === 0 && newValues[key].length === 0) {
                        continue;
                    }
                    let oldValue = this.arrayDifference(oldValues[key], newValues[key]);
                    let newValue = this.arrayDifference(newValues[key], oldValues[key]);
                    if (oldValue.length === 0 && newValue.length === 0) {
                        continue;
                    }
                    changedValues[key] = {
                        oldValue: oldValue,
                        newValue: newValue,
                    };
                } else 
                if (oldValues[key] != newValues[key]) {
                    changedValues[key] = {
                        oldValue: oldValues[key],
                        newValue: newValues[key],
                    };
                }
            }
        }

        return changedValues;
    }

    getChangedValuesAsString(changedValues) {
        let resultString = "";
        let isChanging = false;
        for (const key in changedValues) {
            if (changedValues.hasOwnProperty(key)) {
                isChanging = true;
                const change = changedValues[key];
                resultString += `
                    [TR]
                        [TD]${key}[/TD]
                        [TD]${change.oldValue}[/TD]
                        [TD]${change.newValue}[/TD]
                    [/TR]
                `;
            }
        }

        if (!isChanging) {
            return "";
        }

        return `
            [TABLE]
                [TR]
                    [TD][B]Свойство[/B][/TD]
                    [TD][B]Старое значение[/B][/TD]
                    [TD][B]Новое значение[/B][/TD]
                [/TR]
                ${resultString}
            [/TABLE]
        `;
    }

    arrayDifference(arr1, arr2) {
        const difference = [];
    
        for (const item of arr1) {
            if (!arr2.some(elem => item == elem)) {
                difference.push(item);
            }
        }
    
        return difference;
    }

    findChagedInProducts(oldProducts, newProducts) {
        // console.log("oldProducts = ", oldProducts);
        // console.log("newProducts = ", newProducts);
        if (!Array.isArray(oldProducts) && !Array.isArray(newProducts)) {
            return "";
        }


        const changedProductsArray = [];

        for (let i = 0; i < newProducts.length; i++) {
            const newItem = newProducts[i];
            const oldItem = oldProducts.find(item => item.id === newItem.id);
            let changeObj = {};
            
            // console.log("newItem = ", newItem);
            // console.log("oldItem = ", oldItem);
            if (oldItem) {
                
                const changedValues = this.findChangedValues(oldItem, newItem);
                if (Object.keys(changedValues).length > 0) {
                    changeObj[newItem.id] = changedValues;
                    changedProductsArray.push(changeObj);
                }
            } else {
                changeObj[newItem.id] = {};
                changedProductsArray.push(changeObj);
            }
        }

        return changedProductsArray;
    }

}

export {DataComparator};
