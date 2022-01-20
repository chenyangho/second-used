
window.addEventListener( "pageshow", function ( event ) {
    var historyTraversal = event.persisted || ( typeof window.performance != "undefined" &&  window.performance.navigation.type === 2 );
    if ( historyTraversal ) {
      // Handle page restore.
      window.location.reload();
    }
});

// ************************************************
// Shopping Cart API
// ************************************************

var shoppingCart = (function () {
    // =============================
    // Private methods and propeties
    // =============================
    cart = [];

    // Constructor
    function Item(uniID, npcID, count) {
      this.uniID = uniID;
      this.npcID = npcID
      // console.log(uniID, npcID)
      for (var i in data) {
        if (data[i].unique_id == (uniID)) {
          this.bookname = data[npcID].bookname;
        }
      }
      this.count = count;
    }

    // Save cart
    function saveCart() {
      sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
    }

    // Load cart
    function loadCart() {
      cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
    }
    if (sessionStorage.getItem("shoppingCart") != null) {
      loadCart();
    }


    // =============================
    // Public methods and propeties
    // =============================
    var obj = {};

    // Add to cart
    obj.addItemToCart = function (uniID, npcID, count) {
      for (var item in cart) {
        if (cart[item].uniID === uniID) {
          cart[item].count++;
          saveCart();
          return;
        }
      }
      var item = new Item(uniID, npcID, count);
      cart.push(item);
      saveCart();
    }
    // Set count from item
    obj.setCountForItem = function (uniID, count) {
      for (var i in cart) {
        if (cart[i].uniID === uniID) {
          cart[i].count = count;
          break;
        }
      }
    };
    // Remove item from cart
    obj.removeItemFromCart = function (delID) {
      for (var item in cart) {
        if (cart[item].uniID === delID) {
          cart[item].count--;
          if (cart[item].count === 0) {
            cart.splice(item, 1);
          }
          break;
        }
      }
      saveCart();
    }

    // Remove all items from cart
    obj.removeItemFromCartAll = function (delID) {
      for (var item in cart) {
        if (cart[item].uniID === delID.toString()) {
          cart.splice(item, 1);
          break;
        }
      }
      saveCart();
    }

    // Clear cart
    obj.clearCart = function () {
      cart = [];
      saveCart();
    }

    // Count cart 
    obj.totalCount = function () {
      var totalCount = 0;
      for (var item in cart) {
        totalCount += cart[item].count;
      }
      return totalCount;
    }

    // Total cart
    obj.totalCart = function () {
      var totalCart = 0;
      for (var item in cart) {
        totalCart += cart[item].price * cart[item].count;
      }
      return Number(totalCart.toFixed(2));
    }

    // List cart
    obj.listCart = function () {
      var cartCopy = [];
      for (i in cart) {
        item = cart[i];
        itemCopy = {};
        for (p in item) {
          itemCopy[p] = item[p];

        }
        itemCopy.total = Number(item.price * item.count).toFixed(2);
        cartCopy.push(itemCopy)
      }
      return cartCopy;
    }

    // cart : Array
    // Item : Object/Class
    // addItemToCart : Function
    // removeItemFromCart : Function
    // removeItemFromCartAll : Function
    // clearCart : Function
    // countCart : Function
    // totalCart : Function
    // listCart : Function
    // saveCart : Function
    // loadCart : Function
    return obj;
    })();


  // *****************************************
  // Triggers / Events
  // ***************************************** 
  // Add item
  $('.add-to-cart').click(function (event) {
    var uniID = document.getElementById("add-btn").getAttribute("data-uniID")
    var npcID = document.getElementById("add-btn").getAttribute("data-npcid")
    var check = check_in_cart_or_not()
    if (check) {
      event.preventDefault();
      // var uniID = $(this).data('uniid');
      shoppingCart.addItemToCart(uniID, npcID, 1);
      displayCart();
    } else {
      alert("already exist in cart!!");
    }
  });

  // Clear items
  $('.clear-cart').click(function () {
    shoppingCart.clearCart();
    displayCart();
  });

  function check_in_cart_or_not() {
    if (!cart[0]) {
      return true
    } else {
      for (var item in cart) {
        if (cart[item].bookname === document.getElementById("name").innerHTML) {
          return false
        }
      }
      return true
    }
  }


  function displayCart() {
    var cartArray = shoppingCart.listCart();
    var output = "";
    for (var i in cartArray) {
      output += "<tr>"
        + "<td>" + cartArray[i].bookname + "</td>"
        + "<td><button type='button' class='btn btn-danger delete-item' data-delectid=" + cartArray[i].uniID + " style='    background-color: #dc3545;'>X</button></td>"
        + "</tr>";
    }
    $('.show-cart').html(output);
    $('.total-cart').html(shoppingCart.totalCart());
    $('.total-count').html(shoppingCart.totalCount());
  }

  // Delete item button

  $('.show-cart').on("click", ".delete-item", function (event) {
    var uniID = $(this).data('delectid')
    shoppingCart.removeItemFromCartAll(uniID);
    displayCart();
  })


//   // -1
//   $('.show-cart').on("click", ".minus-item", function (event) {
//     var uniID = $(this).data('uniID')
//     shoppingCart.removeItemFromCart(uniID);
//     displayCart();
//   })
//   // +1
//   $('.show-cart').on("click", ".plus-item", function (event) {
//     var uniID = $(this).data('uniID')
//     shoppingCart.addItemToCart(uniID);
//     displayCart();
//   })

  // Item count input
  $('.show-cart').on("change", ".item-count", function (event) {
    var uniID = $(this).data('uniID');
    var count = Number($(this).val());
    shoppingCart.setCountForItem(uniID, count);
    displayCart();
  });

  $('.order-books').on("click", function (event) {
    if(cart.length == 0){
      alert("Nothing in shopping cart!!")
    }else if(confirm('このページからチェックページへ移動しますか？')) {
        // location.href="./check?cart=" + encodeURIComponent(JSON.stringify(cart));
        location.href="./check"
    }
  });


  displayCart();



// -----------search book
function search_book() {
    var search_book = document.getElementById('site_search').value.toString()
    for (let i = 0; i < data.length; i++) {
      if (data[i].bookname.toString() === search_book.toString()) {
        document.getElementById('search_book').style.visibility = 'visible'
        document.getElementById('iteam_url').style.visibility = 'hidden'
        document.getElementById('test').innerHTML = "在庫あり"
        document.getElementById("img2").src = data[i].picture
        document.getElementById("name2").innerHTML = data[i].bookname
        document.getElementById("owner2").innerHTML = data[i].owner
        document.getElementById("price2").innerHTML = data[i].price
        document.getElementById("sold2").innerHTML = data[i].sold
        return
      } else {
        document.getElementById('test').innerHTML = "売り切れ😢\nアマゾンで商品を探してみませんか"
        document.getElementById('search_book').style.visibility = "hidden"
        document.getElementById('iteam_url').style.visibility = 'visible'
        document.getElementById('iteam_url').href = "https://www.amazon.co.jp/s?k=" + search_book
      }
    }
  }