class cartItem {
    constructor(tag, title, flavor, quantity, deliveryPeriod, itemPrice) {
        this.tag = tag; // string for image
        this.title = title; // string 
        this.deliveryPeriod = deliveryPeriod; 
        this.flavor = flavor; // string
        this.quantity = quantity; // # boxes (int)  
        this.itemPrice = itemPrice; // single item price (int)
        this.total = (this.quantity * this.itemPrice).toFixed(2) // item total (int)
    }
  }

function changeImage(flavor,ele) {
    var source = "images/"+flavor+".png"
    document.getElementById("active_sel").src = source;
    var flavors = document.getElementsByClassName("f_option")
    if (flavors[ele-1].style.borderWidth == "") {
        // getting rid of previous selected 
        for (let i = 0; i<flavors.length; i++){
            flavors[i].style.border = "";
        }
        // set selected border 
        flavors[ele-1].style.border = "medium solid #FFBE0B";
    }
    else { // unclick to go back to original image 
        flavors[ele-1].style.border = "";
        document.getElementById("active_sel").src = "images/berryOriginal.png";
    }
}

function setDrinkCart(product){
    // update local storage
    let itemsInCart = localStorage.getItem('itemsInCart');
    itemsInCart = JSON.parse(itemsInCart);
    // if nonempty cart
    let tag = product.tag;
    console.log(tag); 
    if (itemsInCart != null){
        if (!(tag in itemsInCart)){
            console.log("adding new item into dict");
            itemsInCart[tag] = product; 
        }
        else{
            let drink = itemsInCart[tag];
            console.log("increasing existing item quant");
            drink.quantity += product.quantity
            drink.total = (drink.quantity * drink.itemPrice).toFixed(2);
        }  
    }
    else{ //empty cart, add product
        console.log("empty cart: adding new item");
        itemsInCart = {[tag]:product};
    }
    // add items into cart local storage
    localStorage.setItem('itemsInCart',JSON.stringify(itemsInCart));
}

function addItem(){
    // update number of items in cart logo
    console.log("setting quantity");
    setQuantity();  

    // update cart page 
    // make new drink object 
    var title = document.getElementById('drinkTitle').innerHTML;
    var quant = parseInt(document.getElementById('item_quant').value); 
    if (document.getElementById("one_time").checked == true) {
        var price = 43.99;
    } 
    else{
        var price = 35.99; 
    }
    var flavors = document.getElementsByClassName("f_option");
    flavor = "Original";
    for (let i = 0; i<flavors.length; i++){
        if (flavors[i].style.border != ""){
            flavor = flavors[i].alt;
        }
    }
    spaceIndex = title.indexOf(" ");
    var tag = `${title.substring(0, spaceIndex).toLowerCase()}${flavor}`;
    var deliveryPeriod = document.getElementById("delivery").value;
    console.log(deliveryPeriod);
    var product = new cartItem(tag, title,flavor,quant,deliveryPeriod,price);
    if (document.getElementById("one_time").checked == true) {
        product.deliveryPeriod = "N/A";
    } 
    setDrinkCart(product); // add product to cart page 
    alert("Added item to cart");
    return false;
}
function onLoadCart(){
    console.log("loading cart")
    let num_products = localStorage.getItem('num_items');
    if (num_products){
        console.log(document.getElementById("num_items"));
        document.getElementById("num_items").innerHTML = num_products;
        console.log(document.getElementById("num_items").innerHTML);
    }
    displayDrink();
    removeWrapper();
    setTotalPayment();
}
function setTotalPayment(){
    let itemsInCart = localStorage.getItem('itemsInCart');
    itemsInCart = JSON.parse(itemsInCart);
    let cart_products = document.getElementsByClassName("cart_products");
    // on the cart page AND exists items in cart
    if (itemsInCart && cart_products.length != 0){
        let total = 0;
        Object.values(itemsInCart).map(item => {
            total += parseFloat(item.total);
        })
        console.log(total);
        document.getElementById("cart_total").innerHTML = `$${total.toFixed(2)}`;
    }
 }
function removeWrapper(){
    // add delete function
    let itemsInCart = localStorage.getItem('itemsInCart');
    itemsInCart = JSON.parse(itemsInCart);
    let cart_products = document.getElementsByClassName("cart_products");
    let length = document.getElementsByClassName("cart_product").length; 
    // on the cart page AND exists items in cart
    if (itemsInCart && cart_products.length!=0){
        let i = 0; 
        let deleteBtns = document.getElementsByClassName("delete");
        let incrBtns = document.getElementsByClassName("plus");
        let decrBtns = document.getElementsByClassName("minus");
        // console.log(Object.length);
        Object.values(itemsInCart).map(item => {
            console.log(item);
            console.log(length-i);
            deleteBtns[i].addEventListener("click", ()=>{removeItem(item)});
            incrBtns[i].addEventListener("click", ()=>{changeQuant(item,"+",length-i)});
            decrBtns[i].addEventListener("click", ()=>{changeQuant(item,"-",length-i)});
            i++;
        })
    }
}

function removeItem(item) {
    let itemsInCart = localStorage.getItem('itemsInCart');
    itemsInCart = JSON.parse(itemsInCart);
    // console.log(typeof Object.values(itemsInCart)[0]);
    // go through itemsincart array
    // console.log(itemsInCart[item.tag]);
    Object.values(itemsInCart).map(drink => {
        // removing actual drink
        if (drink.tag == item.tag){
            console.log("found drink");
            delete itemsInCart[item.tag];
            console.log(itemsInCart);
        }
    })
    localStorage.setItem('itemsInCart',JSON.stringify(itemsInCart));
     
    let num_products = localStorage.getItem('num_items');
    num_products = parseInt(num_products); // convert to int
    // console.log(item.quantity);
    // console.log(num_products-item.quantity);
    localStorage.setItem('num_items',num_products-item.quantity);
    new_num = parseInt(localStorage.getItem('num_items')); // convert to int
    document.getElementById("num_items").innerHTML = new_num;
    // display drinks again
    location.reload()
}
function setQuantity(){
    console.log("setting quantity")
    let num_products = localStorage.getItem('num_items');
    num_products = parseInt(num_products); // convert to int
    let quant = parseInt(document.getElementById('item_quant').value); 
    console.log(quant);
    if (num_products){ // if exist product
        console.log("adding item to cart")
        localStorage.setItem('num_items',quant+num_products);
        document.getElementById("num_items").innerHTML = quant+num_products;
    }
    else{
        console.log("adding item to empty cart");
        localStorage.setItem('num_items',quant);
        document.getElementById("num_items").innerHTML = quant;
    }
    return false;
}

function displayDrink(){
    // get local storage drinks
    let itemsInCart = localStorage.getItem('itemsInCart');
    itemsInCart = JSON.parse(itemsInCart);
    let cart_products = document.getElementsByClassName("cart_products");
    // empty cart: display message
    if ((JSON.stringify(itemsInCart) === '{}' || itemsInCart == null) && cart_products.length!=0){
        cart_products[0].innerHTML += "<h4>Empty Cart! Start shopping <a href='explore.html' id='empty_cart_link'>here</a></h4>";
    }
    // on the cart page AND exists items in cart
    if (itemsInCart && cart_products.length!=0){
        // console.log(cart_products[0].innerHTML);
        cart_products.innerHTML = "";
        // go through items in cart to display
        console.log("output: cart items");
        Object.values(itemsInCart).map(item => {
            console.log(item.title);
            // console.log(cart_page.innerHTML);
            cart_products[0].innerHTML += `<div class="cart_product">
            <img class="product_image" src="images/${item.tag}.png">
            <div class="product_info cart_content_product"> 
                <span class="product_title">${item.title}</span>
                <br>
                <span class="product_flavor">${item.flavor}</span>
            </div>
            <div class="quantity">
              <span class="minus">-</span>
              <span class="quantity_num">${item.quantity}</span>
              <span class="plus")">+</span>
            </div>
            <div class="delivery_period">
            <select id="delivery_cart" name="delivery">
                    <option value="none" selected disabled hidden>${item.deliveryPeriod} Days</option>
                    <option value="14">14 Days</option>
                    <option value="30">30 Days</option>
                    <option value="60">60 Days</option>
            </select></div>
            <div class="price item_total">${item.total}</div>
            <a class="delete" href="#">
              <ion-icon name="trash" class="trash_icon"></ion-icon>
            </a> 
        </div> `;
        })
    }
}
function changeQuant(item,sign){
    console.log(item);
    let num_products = localStorage.getItem('num_items');
    num_products = parseInt(num_products); // convert to int
    // decrease item qantity AND change displayd text
    if (item.quantity > 1 && sign == "-"){
        console.log("decreasing quant");
        console.log(item);
        item.quantity -= 1;
        localStorage.setItem('num_items',num_products-1);
    } 
    if (sign == "+"){
        item.quantity += 1;
        console.log("increasing quant");
        localStorage.setItem('num_items',num_products+1);
    }
    // update displayed price and quantity
    item.total = (item.itemPrice*item.quantity).toFixed(2); 
    let titles = document.getElementsByClassName("product_title");
    let flavors = document.getElementsByClassName("product_flavor");
    console.log(titles);
    console.log(flavors.length);
    for (let i = 0; i<titles.length; i++){
        if (titles[i].innerHTML == item.title && flavors[i].innerHTML == item.flavor) {
            document.getElementsByClassName("quantity_num")[i].innerHTML = item.quantity;
            document.getElementsByClassName("item_total")[i].innerHTML = item.total;
    
        }
    }
    
    // update localStorage 
    let itemsInCart = localStorage.getItem('itemsInCart');
    itemsInCart = JSON.parse(itemsInCart);
    // go through itemsincart array
    Object.values(itemsInCart).map(drink => {
        if (drink.tag == item.tag){
            drink.quantity = item.quantity;
            drink.total = item.total;
        }
    })
    localStorage.setItem('itemsInCart',JSON.stringify(itemsInCart));
    new_num = parseInt(localStorage.getItem('num_items')); // convert to int
    document.getElementById("num_items").innerHTML = new_num;
    setTotalPayment();
}
window.onload = onLoadCart();

