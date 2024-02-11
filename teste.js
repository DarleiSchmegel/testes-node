function Fib(n){
    if(n===0){
        console.log(n);
        return 1;
    }
    if(n===1){
        console.log(n);
        return 1;
    }
    const x = Fib(n-1) + Fib(n-2);
    console.log(x);
    return x;
}

Fib(3);