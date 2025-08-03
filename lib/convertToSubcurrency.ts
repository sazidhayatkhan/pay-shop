function convertToSubcurrency(amount:number){
    const factor = 100;
    return Math.round(amount*factor)
}

export default convertToSubcurrency;