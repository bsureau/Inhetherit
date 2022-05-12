export const sortNullishValues = (arr: [] = []) => {
    const assignValue = val => {
       if(val !== null){
          return Infinity;
       }
       else{
          return val;
       };
    };
    const sorter = (a, b) => {
       return assignValue(a.fundsTransferedTx) - assignValue(b.fundsTransferedTx);
    };
    arr.sort(sorter);
 }
