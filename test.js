

for(let j=0; j< n-1; j++){
    for(let k=0; k< n-j-1; k++){
        if(A[k]< A[k-1])
        Swap(A[k], A[k-1]);
    }
}