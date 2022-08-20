// Appel des variables ou déclaration ??????

// Récuperation des produits dans le LS
let productInLocalStorage = JSON.parse(localStorage.getItem("product"));

// Récuperation des balises "section" via l'appel de variables pour des fonctions utilisées plus bas
// Remplacement du contenu de la section 1 par un message "panier vide" si aucun article dans le Ls
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
function buildHtml(v) {
  section2.innerHTML += `<article class="cart__item" data-id="${v.idProduct}" data-color="${v.colorProduct}">
                <div class="cart__item__img">
                  <img src="${v.imgUrl}" alt="Photographie d'un canapé">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${v.nameProduct}</h2>
                    <p>${v.colorProduct}</p>
                    <p>${v.priceProduct} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${v.qteProduct}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`;
}

function empty (){
// Si panier vide, on remplace son contenu par le message ci dessous
  if (productInLocalStorage.length === 0) {
    const emptyBasket = `<div class="limitedWidthBlockContainer"><span style="background-color:red">Le panier est vide, veuillez ajouter des produits.</span></div>`;
    section1.innerHTML = emptyBasket;
    
  }
}

function researchId(productApi) {
  console.log(productInLocalStorage);
  empty()
  // Si panier non vide
   if (productInLocalStorage.length !== 0) {
     // Création de l'array (vide) qui contiendra les caractéristiques des produits du panier
     let fullCart = [];
     // Récup de tous les produits dans le LS, un par un
     productInLocalStorage.forEach((p) => {
       //Récup de tous les produits de fetch, un par un
       productApi.forEach((product) => {
         // Si un id est commun au 2 objets comparés, alors on crée l'objet fullcart (paires clé - valeur)
         // et on ajoute le contenu dans l'array précedemment crée plus haut
         // Ici il sait donc que les valeurs a récup sont celles dont l'id est commun ?????? Grâce à la condition "if"
         // et il ne prend pas un id quelconque !
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
     // On récupere chaque produit individuellement du tableau "fullcart" contenant les produits du panier, on les met dans le paramètre p
     fullCart.map((p) => {
       // on appel la fonction buildHtlm utilisant les produits récupérés ci-dessus grace au paramètre p
       buildHtml(p);
     });
     // Appel des fcts suivantes, décrites en dessous
     calculTotalQuantity(fullCart);
     calculTotalPrice(fullCart);
     createEventDelete();
     createEventChangeQty();
   }

  function calculTotalQuantity(productsInCart) {
    console.log(productsInCart);
    // Appel de la méthode reduce (reduit les valeurs de l'array en une seule en faisant la somme)
    // Elle a en parametre une autre fct et la valeur initiale de 0 (0 = acc) + valeur courante, qui deviendra acc, ainsi de suite comme dans une boucle)
    // cette autre fct a en parametres (l'accumulateur et la valeur courante)
    // Est-ce bon pour les comm ?????????
    let sumQty = productsInCart.reduce(function (accu, valCurrent) {
      return accu + parseInt(valCurrent.qteProduct);
    }, 0);
    let totalQuantity = document.getElementById("totalQuantity");
    totalQuantity.innerText = sumQty;
  }

  function calculTotalPrice(productsInCart) {
    // Creation d'un array pour utiliser la méthode reduce plus tard
    let sumPriceByProduct = [];
    // Boucle qui compte le nbre de produit dans productsIncart et qui crée autant d'indice "i"
    for (let i in productsInCart) {
      // Récupération des prix de chaque produit
      let price = productsInCart[i].priceProduct;
      // Récupération des quantités pour chaque produit
      let qty = parseInt(productsInCart[i].qteProduct);
      // Multiplication du prix de chaque produit par sa quantité correspondante et ajout dans l'array
      // On obtient le prix total par produit
      sumPriceByProduct.push(price * qty);
      console.log(sumPriceByProduct);
    }
    // somme des totaux précedent
    let sumPriceTotal = sumPriceByProduct.reduce((accu, valCurrent) => {
      return accu + valCurrent;
    });
    console.log(sumPriceTotal);
    // Récupération de l'element et injection dans le dom de façon dynamique
    let totalPrice = document.getElementById("totalPrice");
    totalPrice.innerText = sumPriceTotal;
  }
}

function createEventDelete() {
  // On selectionne tous les btn delete
  let btnDelete = document.querySelectorAll(".deleteItem");

  // Pour chaque btn delete, on ajoute un evenement au click
  for (let j = 0; j < btnDelete.length; j++) {
    btnDelete[j].addEventListener("click", (e) => {
      console.log(e.target.closest("article.cart__item"));
      // On enleve le comportement par défaut (redirection du lien)
      e.preventDefault();
      // Avec target, on cible l'element ou l'objet "e" ?????? et avec closest,
      // On recherche l'article ayant la classe "cart__item le plus proche et ceci dans les parents ???????
      // en renvoyant un element ou ancetres ??????"
      let articleToDelete = e.target.closest("article.cart__item");
      // Une fois l'elt ou l'ancetre trouvé on veut obtenir la valeur contenu dans l'attribut "data-id"
      let dataId = articleToDelete.getAttribute("data-id");
      let dataColor = articleToDelete.getAttribute("data-color");
      console.log(dataId);
      console.log(dataColor);
      section2.removeChild(articleToDelete);

      delInLs(dataId, dataColor);
    });
  }
}

function createEventChangeQty() {
  let inputQty = document.querySelectorAll(".itemQuantity");
  for (let k = 0; k < inputQty.length; k++) {
    inputQty[k].addEventListener("change", (e) => {
      let articleToChangeQty = e.target.closest("article.cart__item");
      let dataId = articleToChangeQty.getAttribute("data-id");
      let dataColor = articleToChangeQty.getAttribute("data-color");
      let neWQty = inputQty[k].value;
      let obtainIndex = productInLocalStorage.findIndex(
        (elt) => elt.idProduct === dataId && elt.colorProduct === dataColor
      );
      console.log(dataId);
      console.log(dataColor);
      console.log(neWQty);
      console.log(obtainIndex);
      if (obtainIndex !== -1) {
        productInLocalStorage[obtainIndex].quantityProduct = parseInt(neWQty);
        localStorage.setItem("product", JSON.stringify(productInLocalStorage));
      }
    });
  }
}

function delInLs(dataId, dataColor) {
  productInLocalStorage = productInLocalStorage.filter(
    (el) => el.idProduct !== dataId || el.colorProduct !== dataColor
  );
  console.log(productInLocalStorage);
  localStorage.setItem("product", JSON.stringify(productInLocalStorage));
  empty()
  window.location.href = "cart.html";
}

/* let deleteInLs = productInLocalStorage[j].idProduct;
      console.log(deleteInLs); */

/* let remainingItem = document.querySelectorAll(".cart__item");
      for (let k = 0; k < remainingItem.length; k++) {
        let everyIdArticle = remainingItem[k].getAttribute("data-Id");
        console.log(everyIdArticle);
      } */
