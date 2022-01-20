var before_cart = JSON.parse(sessionStorage["shoppingCart"])
var now_cart = []
for (var i in before_cart) {
for (var j in data) {
    if (data[j].unique_id == before_cart[i].uniID) {
    now_cart.push(data[j])
    }
}
}

var star = ""
var output = "";

// document.getElementById("test").innerHTML = JSON.stringify(before_cart)

for (var i = 0; i < now_cart.length; i++) {
star = " "
for (var j = 0; j < stardata.length; j++) {
    if (now_cart[i].owner == stardata[j].username) {
    for (var z = 0; z < stardata[j].star; z++) {
        if (star == "★★★★★") {
        star = "★★★★★"
        } else {
        star += "★";
        }
    }
    }
}
output +=
    "<div class='row'>"
    + "<div class='col-3'>"
    + "<div id='d_left'>"
        + "<img id='img1' referrerpolicy='no-referrer' src=" + now_cart[i].picture +" alt=" + now_cart[i].bookname + ">"
    + "</div>"
    + "</div>"
    + "<div class='col' id='font_area'>"
    + "<div id='d_middle'>"
        + "<p>Name : <span id='name'>" + now_cart[i].bookname + "</span></p>"
        + "<p>Owner : <span id='owner'>" + now_cart[i].owner + "</span></p>"
        + "<p>Price : <span id='price'>¥" + now_cart[i].price + "</span></p>"
        + "<p>Sold : <span id='sold'>" + now_cart[i].sold + "</span></p>"
    + "</div>"
    + "</div>"
    + "<div class='col-5'>"
    + "<div class='d_right'>"
        + "<div class='row'>"
        + "<div class='col'>"
            + "<div class='d_l_inside'>"
            + "<p class='seller'>出品者<button type='button' class='btn btn-danger delete-item' data-uniid=" + now_cart[i].unique_id +" style='float: right; margin-top: -10px;'>X</button></p>"
            + "<hr class='hr1'>"
            + "<p class='seller_name'>" + now_cart[i].owner + "</p>"
            + "<p class='stars'>" + star + "</p>"
            + "<button type='button' class='btn btn-danger buy-button' data-uniid='"+now_cart[i].unique_id+"'>購入手続き</button>"
            + "</div>"
        + "</div>"

        + "<div class='col col-r' id='display_area"+now_cart[i].unique_id+"'>"
            + "<div class='d_r_inside'>"
            // + "<button class='btn1 btn btn-secondary' id=" + now_cart[i].unique_id + ">Lineで連絡</button>"
            + "<p class='alert'>注意：チャットを押すと本が保留になります、販売者に連絡してください</p>"
            + "<button class='btn2 btn btn-primary' data-uniid='"+now_cart[i].unique_id+"' onclick=location.href='/buy"+now_cart[i].unique_id+"'>保留する！</button>"
            + "<button class='cancel btn btn-danger' data-uniid='"+now_cart[i].unique_id+"'>取り消し</button>"
            + "</div>"
        + "</div>"

        + "</div>"
    + "</div>"
    + "</div><br>"
    + "</div>"
    + "<hr>"
}
$('.show-cart').html(output);


$('.buy-button').on("click", function (event) {
    var bookuniID = $(this).data().uniid
    document.getElementById("display_area"+bookuniID).style.transition = "1s";
    document.getElementById("display_area"+bookuniID).style.visibility = "visible";
    document.getElementById("display_area"+bookuniID).style.opacity = "1";
    document.getElementById("display_area"+bookuniID).style.zIndex = "10";
    document.getElementById("display_area"+bookuniID).style.position = "relative";
});

$('.cancel').on("click", function (event) {
    var bookuniID = $(this).data().uniid
    document.getElementById("display_area"+bookuniID).style.transition = "0s";
    document.getElementById("display_area"+bookuniID).style.position = "absolute";
    document.getElementById("display_area"+bookuniID).style.visibility = "hidden";
    document.getElementById("display_area"+bookuniID).style.opacity = "0";
    document.getElementById("display_area"+bookuniID).style.zIndex = "0";
});


$('.btn2').on("click", function (event) {
    var bookuniID = $(this).data().uniid
    sessionStorage.removeItem(bookuniID)
    removeItemFromCart(bookuniID)
    console.log(bookuniID)
});


$('.delete-item').on("click", function (event) {
    var bookuniID = $(this).data().uniid;
    sessionStorage.removeItem(bookuniID)
    removeItemFromCart(bookuniID)
    window.location.reload();
});

function saveCart() {
    sessionStorage.setItem('shoppingCart', JSON.stringify(before_cart));
}


function removeItemFromCart(delID) {
    for (var item in before_cart) {
        if (before_cart[item].uniID === delID.toString()) {
            before_cart[item].count--;
            if (before_cart[item].count === 0) {
                before_cart.splice(item, 1);
            }
            break;
        }
    }
    saveCart();
}
