let k
let result = 0;

for (k = 0; k < 5; k++) {
    if(k%3===1){
        result = result+ k;
    }else  {
        result = result+ 1;
    }
}

console.log(result);