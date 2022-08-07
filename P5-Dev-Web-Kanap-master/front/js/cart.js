fetch("http://localhost:3000/api/products")
  .then((res) => {
    if (res) {
      return res.json();
    }
  })
  .then((values) => {
    console.log(values);
  })
  .catch((err) => {
    console.log(err);
  });

let productInLocalStorage = JSON.parse(localStorage.getItem("product"));
let section1 = document.querySelector("#cartAndFormContainer section.cart");
let section2 = document.getElementById("cart__items");

if (productInLocalStorage !== null) {
  productInLocalStorage.map(function (product) {
    console.log(product);
    console.log(product.idProduct);
    console.log(productInLocalStorage[0].idProduct);
    optionProductInCart(product);
  });
}

function research() {}

function optionProductInCart(pdt) {
  let productInCart = {
    // comment faire le lien entre les pdts du LS et le nom, prix, image du fetch ? et comment mettre tout dans une variable ?
    //nameProduct: val.name,
    //priceProduct: val.price,
    idProduct: pdt.idProduct,
    colorProduct: pdt.colorProduct,
    qteProduct: pdt.quantityProduct,
  };
  console.log(productInCart);
}

// Si panier vide
if (productInLocalStorage === null) {
  const emptyBasket = `<div class="limitedWidthBlockContainer"><span style="background-color:red">Le panier est vide, veuillez ajouter des produits.</span></div>`;
  section1.innerHTML = emptyBasket;
  // Si panier non vide
} else {
  console.log("je ne suis pas vide");
  productInLocalStorage.map(function (product) {
    buildHtml(product);
  });
}

function buildHtml(zzz) {
  section2.innerHTML = `<article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
                <div class="cart__item__img">
                  
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>Nom du produit</h2>
                    <p>Vert</p>
                    <p>42,00 €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`;
}

//<img src="../images/product01.jpg" alt="Photographie d'un canapé">
