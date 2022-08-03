window.onscroll = () => {
  let navbar = document.querySelector("header");
  this.scrollY > 20
    ? navbar.classList.add("sticky")
    : navbar.classList.remove("sticky");
};
var DataofJSON = [];
var cartProdCount = [];
if (window.localStorage.getItem("cart") != null) {
  cartProdCount = JSON.parse(window.localStorage.getItem("cart"));
}
function loadDataNav() {
  while (DataofJSON.length > 0) {
    let Total_count = 0;
    let TotalPrice = 0;
    for (let i = 0; i < cartProdCount.length; i++) {
      Total_count += cartProdCount[i].count;
      TotalPrice +=
        cartProdCount[i].count * DataofJSON[getIndex(cartProdCount[i].id)].price;
    }
    document.getElementById("cart-counter").innerHTML = Total_count;
    document.getElementsByClassName("money")[0].innerHTML = TotalPrice;
    document.getElementById("Total_Amount").innerHTML = TotalPrice;
    cartProdexpand();
    break;
  }
}

function getJSONData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      //console.log("hello");
      $.getJSON("data.json", (jd) => {
        DataofJSON = jd;
      });
      resolve();
    });
  }, 500);
}
function cartProdexpand() {
  let Ans = "";
  for (let i = 0; i < cartProdCount.length; i++) {
    Ans += `
    <div class="iteam">
      <div class="product-img-section">
        <img src="${DataofJSON[getIndex(cartProdCount[i].id)].src}" alt="">
        <div class="item-close" onclick="removeparent(this,${
          cartProdCount[i].id
        })" data-count="${
      DataofJSON[getIndex(cartProdCount[i].id)].price
    }" style="user-select: auto;">
          <a style="user-select: auto;">
            <i class="sli sli-close" style="user-select: auto;"></i>
          </a>
        </div>
      </div>
      <div class="shopping-cartproduct-title">
        <h4>${DataofJSON[getIndex(cartProdCount[i].id)].name}</h4>
        <span>${cartProdCount[i].count} * $${
      DataofJSON[getIndex(cartProdCount[i].id)].price
    }</span>
      </div>
    </div>`;
  }
  document.getElementById("shop_products").innerHTML = Ans;
}
let product_links = document.querySelectorAll("div.product-links>a");
product_links.forEach((a) => {
  a.addEventListener("click", () => {
    product_links.forEach((A) => {
      A.classList.remove("active");
    });

    a.classList.add("active");
    getJSONData().then(
      PrintJSONONHOME(document.getElementById("swiper2-wrapper"))
    );
  });
});
function getCartProduct_struct(id,q=1) {
  let flag = 0;
  if (cartProdCount.length > 0) {
    for (let i = 0; i < cartProdCount.length; i++) {
      if (cartProdCount[i].id == id) {
        cartProdCount[i].count += q;
        flag = 1;
        break;
      }
    }
  }
  if (flag == 0 || cartProdCount.length == 0) {
    let obj = {
      id: id,
      count: q,
    };
    cartProdCount.push(obj);
  }
  if (window.localStorage.getItem("cart"))
    window.localStorage.removeItem("cart");
  window.localStorage.setItem("cart", JSON.stringify(cartProdCount));
  cartProdexpand();
}
let addtoCart = (e,q=1) => {
  let id = Number(e.getAttribute("data-count"));
  getCartProduct_struct(id,q);
  let counter = document.getElementById("cart-counter");
  counter.innerHTML = Number(counter.innerHTML) + q;
  let TotalAm = document.getElementsByClassName("money")[0].innerHTML;
  document.getElementsByClassName("money")[0].innerHTML =
    (parseFloat(TotalAm) + parseFloat(DataofJSON[getIndex(id)].price))*q;
  document.getElementById("Total_Amount").innerHTML =
  (parseFloat(TotalAm) + parseFloat(DataofJSON[getIndex(id)].price))*q;
};
function removeparent(E, id) {
  let totalProduct = 0;
  let cutPrice = 0;
  let counter = document.getElementById("cart-counter");
  for (let i = 0; i < cartProdCount.length; i++) {
    if (cartProdCount[i].id == id) {
      cutPrice = parseFloat(DataofJSON[getIndex(id)].price) * cartProdCount[i].count;
      cartProdCount.splice(i, 1);
      if (window.localStorage.getItem("cart"))
        window.localStorage.removeItem("cart");

      window.localStorage.setItem("cart", JSON.stringify(cartProdCount));
    }
  }

  cartProdCount.forEach((element) => {
    totalProduct += element.count;
  });
  counter.innerHTML = totalProduct;
  let TotalAm = document.getElementsByClassName("money")[0].innerHTML;
  document.getElementsByClassName("money")[0].innerHTML =
    parseFloat(TotalAm) - cutPrice == 0
      ? "0.00"
      : parseFloat(TotalAm) - cutPrice;
  document.getElementById("Total_Amount").innerHTML =
    parseFloat(TotalAm) - cutPrice == 0
      ? "0.00"
      : parseFloat(TotalAm) - cutPrice;
  E.parentElement.parentElement.remove();
}
function getIndex(id) {
  for (let i = 0; i < DataofJSON.length; i++) {
    if (DataofJSON[i].id == id) return i;
  }
}

function printJSONProduct() {
  setTimeout(() => {
    loadDataNav();
    let id = window.localStorage.getItem("activeProduct");
    //console.log(DataofJSON);
    if (DataofJSON.length > 0) {
      document.getElementById("Main").innerHTML = `
       <div class="page-title-outter">
       <div class="page-title-inner">
           <div class="container">
               <h4><span>HOME </span>/ <span>PRODUCTS </span>/ <span id="topTitle">${
                  DataofJSON[getIndex(id)].name
               }</span></h4>
           </div>
       </div>
   </div>
   <div class="container">
       <div class="row" >
           <div class="Product_img col-lg-6 col-md-6 col-sm-12 ">
               <img id="prodImgesrc" src="IMAGES/Product/${id}.jpg" alt="">
           </div>
           <div class="Product_info col-lg-6 col-md-6 col-sm-12">
               <div class="Prod_category">
                   <p id="catagory">${DataofJSON[getIndex(id)].catagory}</p>
               </div>
               <div class="Prod_title">
                   <h1 id="title">${DataofJSON[getIndex(id)].name}</h1>
               </div>
               <div class="Prod_desc">
                   <p id="description">${
                     DataofJSON[getIndex(id)].description
                   }</p>
               </div>
               <div class="rating">
                   <div class="review">
                       <i class="fa-solid fa-star"></i>
                       <i class="fa-solid fa-star"></i>
                       <i class="fa-solid fa-star"></i>
                       <i class="fa fa-star-o"></i>
                       <i class="fa fa-star-o"></i>
                   </div>
               </div>
               <div class="Prod_price">
                   <h2>$ <span id="price">${
                     DataofJSON[getIndex(id)].price
                   }</span></h2>
               </div>
               <div class="Prod_counting">
                   <button class="button-count no-active" disabled>-</button>
                   <input data-count="${id}" id="Prod_count_add" type="text" readonly class="number-product" value="1">
                   <button class="button-count">+</button>
               </div>
               <div class="addtocart_btn">
                   <button id="prodCartadd" type="button">Add To Cart</button>
               </div>
           </div>
       </div>
   </div>`;
        document.getElementById('prodCartadd').addEventListener('click',()=>{
          let e = document.getElementById("Prod_count_add");
          addtoCart(e,parseInt(e.value));
        })

        var num;

        $('.button-count:first-child').click(function () {
            num = parseInt($('input:text').val());
            if (num > 1) {
                $('input:text').val(num - 1);
            }
            if (num == 2) {
                $('.button-count:first-child').prop('disabled', true);
            }
            if (num == 10) {
                $('.button-count:last-child').prop('disabled', false);
            }
        });

        $('.button-count:last-child').click(function () {
            num = parseInt($('input:text').val());
            if (num < 10) {
                $('input:text').val(num + 1);
            }
            if (num > 0) {
                $('.button-count:first-child').prop('disabled', false);
            }
            if (num == 9) {
                $('.button-count:last-child').prop('disabled', true);
            }
        });
        
      // document.getElementById('topTitle').innerHTML = DataofJSON[getIndex(id)].name;
      // document.getElementById('prodImgesrc').setAttribute('src',`IMAGES/Product/${id}.jpg`)
      // document.getElementById('catagory').innerHTML = DataofJSON[getIndex(id)].catagory
      // document.getElementById('title').innerHTML = DataofJSON[getIndex(id)].name;
      // document.getElementById('description').innerHTML = DataofJSON[getIndex(id)].description;
      // document.getElementById('price').innerHTML = DataofJSON[getIndex(id)].price;
    }
  }, 800);
}
function PrintJSONONSHOP(element) {
  setTimeout(() => {
    loadDataNav();
    let Ans = "";
    for (let i = 0; i < DataofJSON.length; i++) {
      Ans += `
      <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
        <div class="product-all-outer">
            <div class="col-md-12" style="padding: 0;">
                <div class="product-outer">
                    <div class="product-wrapper">
                        <div class="product-img-wrapper">
                            <a href="#" class="inner-product-links">
                                <img src="${DataofJSON[i].src}" alt="" class="">
                            </a>
                            <div class="product-action">
                            <ul class="product-action-list">
                            <li><a><i class="sli sli-heart" style="user-select: auto;"></i></a></li>
                            <li><a href="Product.html" class="showProduct" data-count = "${DataofJSON[i].id}"><i class="sli sli-eye" style="user-select: auto;"></i></a></li>
                            <li><a class="addtobag" data-count = "${DataofJSON[i].id}"><i class="sli sli-bag"  style="user-select: auto;"></i></a></li>                                                                            
                        </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="product-content">
                <div class="product-content_all">
                    <div class="product-catagoty">
                    <a href="#">${DataofJSON[i].catagory}</a>
                    </div>
                    <h4 class="product-content-title">
                        <a href="#">${DataofJSON[i].name}</a>
                    </h4>
                    <div class="Product-price">
                        <h3>
                            <span>$</span>${DataofJSON[i].price}
                        </h3>
                    </div>
                    <div class="review">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa fa-star-o"></i>
                        <i class="fa fa-star-o"></i>
                    </div>
                    </div>
                    
                </div>
            </div>
        </div>
      </div>
      
      `;
    }
    element.innerHTML = Ans;

    document.getElementById("ShowingResults").innerHTML = `Showing
    1 - 36
    of
    36
    result`;
    $(".addtobag").click(function (event) {
      event.preventDefault();
    });
    document.querySelectorAll(".addtobag").forEach((e) => {
      e.addEventListener("click", () => {
        // console.log("Hello")
        addtoCart(e);
      });
    });
    document.querySelectorAll(".showProduct").forEach((element) => {
      element.addEventListener("click", () => {
        if (window.localStorage.getItem("activeProduct")) {
          window.localStorage.removeItem("activeProduct");
        }
        window.localStorage.setItem(
          "activeProduct",
          element.getAttribute("data-count")
        );
      });
    });
  }, 700);
}

function PrintJSONONHOME(element) {
  setTimeout(() => {
    loadDataNav();
    let Ans = "";
    for (let i = 0; i < DataofJSON.length; i++) {
      Ans += `
        <div class="swiper-slide">
          <div class="product-all-outer" ">
              <div class="col-md-12" style="padding: 0;">
                  <div class="product-outer">
                      <div class="product-wrapper">
                          <div class="product-img-wrapper">
                              <a href="#" class="inner-product-links">
                                  <img src="${DataofJSON[i].src}" alt="" class="">
                              </a>
                              <div class="product-action">
                                  <ul class="product-action-list">
                                      <li><a><i class="sli sli-heart" style="user-select: auto;"></i></a></li>
                                      <li><a href="Product.html" class="showProduct" data-count = "${DataofJSON[i].id}"><i class="sli sli-eye" style="user-select: auto;"></i></a></li>
                                      <li><a class="addtobag" data-count = "${DataofJSON[i].id}"><i class="sli sli-bag"  style="user-select: auto;"></i></a></li>                                                                            
                                  </ul>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="product-content">
                      <div class="product-catagoty">
                          <a href="#">${DataofJSON[i].catagory}</a>
                      </div>
                      <h4 class="product-content-title">
                          <a href="#">${DataofJSON[i].name}</a>
                      </h4>
                      <div class="Product-price">
                          <h3>
                              <span>$</span>${DataofJSON[i].price}
                          </h3>
                      </div>
                      <div class="review">
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                          <i class="fa fa-star-o"></i>
                          <i class="fa fa-star-o"></i>
                      </div>
                  </div>
              </div>
          </div>
        </div>
        
        `;
    }
    if (element != null) element.innerHTML += Ans;
    $(".addtobag").click(function (event) {
      event.preventDefault();
    });
    document.querySelectorAll(".addtobag").forEach((e) => {
      e.addEventListener("click", () => {
        addtoCart(e);
      });
    });
    document.querySelectorAll(".showProduct").forEach((element) => {
      element.addEventListener("click", () => {
        if (window.localStorage.getItem("activeProduct")) {
          window.localStorage.removeItem("activeProduct");
        }
        window.localStorage.setItem(
          "activeProduct",
          element.getAttribute("data-count")
        );
      });
    });
  }, 800);
}

if (document.getElementById("product-all-show-inner-row") != null) {
  getJSONData().then(
    PrintJSONONSHOP(document.getElementById("product-all-show-inner-row"))
  );
} else if (document.getElementById("Main") != null) {
  getJSONData().then(printJSONProduct());
}

else 
{
  getJSONData().then(
    PrintJSONONHOME(document.getElementById("swiper2-wrapper"))
  );
}

function decendAplha(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  return a < b ? 1 : a > b ? -1 : 0;
}
function acendAplha(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  return a < b ? -1 : a > b ? 1 : 0;
}
function sorting(element) {
  let data = DataofJSON;
  //let sort = element;
  if (element == 1) {
    data.sort((a, b) => {
      return acendAplha(a.name, b.name);
    });
  } else if (element == 2) {
    data.sort((a, b) => {
      return decendAplha(a.name, b.name);
    });
  } else if (element == 3) {
    data.sort((a, b) => a.price - b.price);
  } else if (element == 4) {
    data.sort((a, b) => b.price - a.price);
  } else if (element == 0) {
    getJSONData().then(
      PrintJSONONSHOP(document.getElementById("product-all-show-inner-row"))
    );
  }
  PrintJSONONSHOP(document.getElementById("product-all-show-inner-row"));
}
function FilterResultShow(element, Arr) {
  let Ans = "";
  for (let i = 0; i < Arr.length; i++) {
    Ans += `
      <div class="col-xl-3 col-lg-3 col-md-6 col-sm-12">
        <div class="product-all-outer">
            <div class="col-md-12" style="padding: 0;">
                <div class="product-outer">
                    <div class="product-wrapper">
                        <div class="product-img-wrapper">
                            <a href="#" class="inner-product-links">
                                <img src="${Arr[i].src}" alt="" class="">
                            </a>
                            <div class="product-action">
                                <ul class="product-action-list">
                                <li><a><i class="sli sli-heart" style="user-select: auto;"></i></a></li>
                                <li><a href="Product.html" class="showProduct" data-count = "${Arr[i].id}"><i class="sli sli-eye" style="user-select: auto;"></i></a></li>
                                <li><a class="addtobag" data-count = "${Arr[i].id}"><i class="sli sli-bag"  style="user-select: auto;"></i></a></li>  
                                </ul>                                                                          
                            </div>
                        </div>
                    </div>
                </div>
                <div class="product-content">
                    <div class="product-catagoty">
                        <a href="#">${Arr[i].catagory}</a>
                    </div>
                    <h4 class="product-content-title">
                        <a href="#">${Arr[i].name}</a>
                    </h4>
                    <div class="Product-price">
                        <h3>
                            <span>$</span>${Arr[i].price}
                        </h3>
                    </div>
                    <div class="review">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa fa-star-o"></i>
                        <i class="fa fa-star-o"></i>
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      `;
  }
  element.innerHTML = Ans;
}
function Filter() {
  let input = document.getElementById("searchbar").value.toLowerCase();
  let Result = [];
  for (let i = 0; i < DataofJSON.length; i++) {
    if (DataofJSON[i].name.toLowerCase().indexOf(input) > -1) {
      Result.push(DataofJSON[i]);
    }
  }
  document.getElementById("ShowingResults").innerHTML = `Found
  ${Result.length}
  from
  15
  Products`;

  if (Result.length == 0) {
    document.getElementById("product-all-show-inner-row").innerHTML = `
    <h1 style = "text-align:center;">No Data Found</h1>
    `;
  } else {
    FilterResultShow(
      document.getElementById("product-all-show-inner-row"),
      Result
    );
  }
}
// document.getElementById('searchbar').addEventListener('blur',()=>{
//   document.getElementById('searchbar').value = ""
// })

if (document.getElementById("maincart") != null) {
  document.getElementById("maincart").addEventListener("click", () => {
    document.getElementById("shoppingcartwrapper").classList.add("show");
  });
}

if (document.getElementsByClassName("cart-close")[0] != null) {
  document
    .getElementsByClassName("cart-close")[0]
    .addEventListener("click", () => {
      document.getElementById("shoppingcartwrapper").classList.remove("show");
    });
}
// document.getElementById('chcek-out-btn').addEventListener('click',()=>{

// })

// function checkout() {
//   if (
//     Number(
//       document.getElementById("cart-counter").getAttribute("data-count")
//     ) != 0
//   ) {
//     window.localStorage.setItem(
//       "TA",
//       document.getElementsByClassName("money")[0].innerHTML
//     );
//     window.location.href = "../payment.html";
//   }
// }
