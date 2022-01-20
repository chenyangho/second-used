if(!sessionStorage["shoppingCart"]){
    var len_in_cart = 0;
    document.getElementById("number").innerHTML = len_in_cart;
}else{
    var len_in_cart = (JSON.parse(sessionStorage["shoppingCart"])).length;
    document.getElementById("number").innerHTML = len_in_cart;
}