// Appel des variables ou déclaration ??????

// Récuperation des produits dans le LS
let productInLocalStorage = JSON.parse(localStorage.getItem("product"));
/* let idProductIncart = productInLocalStorage.map(function (product) {
  return product.idProduct;
});*/

// Récuperation des balises "section" via l'appel de variables pour des fonctions utilisées plus bas
// Remplacement du contenu de cette section par un message "panier vide" si aucun article dans le Ls
let section1 = document.querySelector("#cartAndFormContainer section.cart");
// Section à remplir dynamiquement en cas d'article dans le Ls
let section2 = document.getElementById("cart__items");

fetch("http://localhost:3000/api/products")
  .then((res) => {
    if (res) {
      return res.json();
    }
  })
  .then((values) => {
    // Appel de la fct researchId pour les pdts extraits de fetch
    researchId(values);
  })
  .catch((err) => {
    console.log(err);
  });

// Fct qui sera appelé pour ajouter les articles dans le panier en incrementant chaque article présent dans le LS
function buildHtml(p) {
  section2.innerHTML += `<article class="cart__item" data-id="{}" data-color="{product-color}">
                <div class="cart__item__img">
                  <img src="${p.imgUrl}" alt="Photographie d'un canapé">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${p.nameProduct}</h2>
                    <p>${p.colorProduct}</p>
                    <p>${p.priceProduct} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${p.qteProduct}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`;
}

// Si panier vide
if (productInLocalStorage === null) {
  const emptyBasket = `<div class="limitedWidthBlockContainer"><span style="background-color:red">Le panier est vide, veuillez ajouter des produits.</span></div>`;
  section1.innerHTML = emptyBasket;
  // Si panier non vide
} else {
  function researchId(productApi) {
    // Création de l'array (vide) qui contiendra les caractéristiques des produits du panier
    let fullCart = [];
    // Récup de tous les produits dans le LS, un par un
    productInLocalStorage.forEach((p) => {
      //Récup de tous les produits de fetch, un par un
      productApi.forEach((product) => {
        // Si un id est commun, alors creation d'objet (paires clé - valeur) et ajout du contenu dans l'array précedemment crée plus haut
        // Ici il sait donc que les valeurs a récup sont celles dont l'id est commun ?????? Grâce à la condition "if"
        // et non pas un id quelconque !
        if (p.idProduct === product._id) {
          console.log(product.name);
          fullCart.push({
            nameProduct: product.name,
            priceProduct: product.price,
            imgUrl: product.imageUrl,
            idProduct: p.idProduct,
            colorProduct: p.colorProduct,
            qteProduct: p.quantityProduct,
          });
        }
      });
    });
    console.log(fullCart);
    // Pour chaque produit du tableau nouvellement crée, cad pour les produits du panier,
    // on appel la fct builHtml qui incrémente au lieu de remplacer
    fullCart.map((p) => {
      buildHtml(p);
    });
  }
}
