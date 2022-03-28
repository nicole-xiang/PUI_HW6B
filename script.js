class cartItem {
    constructor(tag, title, flavor, quantity, deliveryPeriod, itemPrice) {
        this.tag = tag; // string for image
        this.title = title; // string 
        this.deliveryPeriod = deliveryPeriod; 
        this.flavor = flavor; // string
        this.quantity = quantity; // # boxes (int)  
        this.itemPrice = itemPrice; // single item price (int)
        this.total = this.quantity * this.itemPrice // item total (int)
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
    let tag = `${product.title}, ${product.flavor}`;
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
            drink.total = drink.quantity * drink.itemPrice;
        }  
    }
    else{ //empty cart, add product
        console.log("empty cart: adding new item");
        itemsInCart = {[tag]:product};
    }
    // add items into cart local storage
    localStorage.setItem('itemsInCart',JSON.stringify(itemsInCart));

    // delete function 
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
    console.log(product);
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
    // on the cart page AND exists items in cart
    if (itemsInCart && cart_products.length!=0){
        console.log(cart_products[0].innerHTML);
        // cart_products.innerHTML[0] = "";
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
              <span class="minus" ">-</span>
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
            <div class="price">${item.total}</div>
            <a class="delete" href="#" onclick="removeItem()">
              <ion-icon name="trash" class="trash_icon"></ion-icon>
            </a> 
        </div> `;
        })
    }
}
// function decrQuant(item){
//     console.log("Decreasing count");
//     // decrease item qantity AND change displayd text
//     if (item.quantity > 1){
//         item.quantity -= 1;
//         console.log(document.getElementsByClassName("quantity_num")[0]);
//         // document.getElementsByClassName("quantity_num")[0] = item.quantity;
         
//     } 
// }
window.onload = onLoadCart();

let deleteBtns = document.getElementsByClassName("delete");
let items = JSON.parse(localStorage.getItem('itemsInCart'));
let i = 0;
console.log(items);
for (item in items) {
    console.log(item.valueOf());
    deleteBtns[i].addEventListener("click", removeItem(item));
    i++; 
}

function removeItem(tag) {
    console.log(tag);
}

