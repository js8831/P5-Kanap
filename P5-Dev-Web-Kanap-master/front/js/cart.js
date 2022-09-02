//-------LE PANIER-------

//-------Déclaration des variables-------

// Récuperation des produits dans le LS
let productInLocalStorage = JSON.parse(localStorage.getItem("product"));
// Création du tableau à remplir
let products = [];
// Récuperation des balises "section" pour des fonctions utilisées plus bas
let section1 = document.querySelector("#cartAndFormContainer section.cart");
let section2 = document.getElementById("cart__items");
// Création du tableau à remplir
let fullCart = [];

//-------Fetch-------

fetch("http://localhost:3000/api/products")
  .then((res) => {
    if (res) {
      return res.json();
    }
  })
  .then((values) => {
    // Appel de la fct init pour les pdts extraits via "fetch"
    init(values);
  })
  .catch((err) => {
    console.log(err);
  });

//-------Les fonctions-------

// Incrémente dans le DOM, les articles dynamiquement crées avec fullCart.map
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

// Si le panier est vide, on affiche le message ci-dessous dans la section1
function empty() {
  if (productInLocalStorage == 0 || productInLocalStorage === null) {
    const emptyBasket = `<div class="limitedWidthBlockContainer"><span style="background-color:red">Le panier est vide, veuillez ajouter des produits.</span></div>`;
    section1.innerHTML = emptyBasket;
  }
}

// Fonction qui push dans l'array fullCart un objet de 6 propriétés (paires clé - valeur) pour chaque article dans le LS
function createFullCart(productApi, fullCart) {
  productInLocalStorage.forEach((p) => {
    // Remplissage du tableau products avec les id
    products.push(p.idProduct);
    //Récup. de tous les produits du serveur un par un
    productApi.forEach((product) => {
      // Si un id est commun au 2 objets comparés
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
}

// Initialise tout
function init(productApi) {
  empty();
  // Si panier non vide
  if (productInLocalStorage !== null) {
    createFullCart(productApi, fullCart);
    // On récupere chaque produit individuellement du tableau "fullcart" contenant les produits du panier, on les met dans le paramètre "p"
    fullCart.map((p) => {
      // on appel la fonction buildHtlm utilisant les produits récupérés ci-dessus grâce au paramètre "p"
      buildHtml(p);
    });
    // Appel des fcts suivantes, décrites en dessous
    calculTotalPrice(fullCart);
    createEventDelete(fullCart);
    createEventChangeQty(fullCart);
    calculTotalQuantity();
  }
}

// Calcule la quantité totale
function calculTotalQuantity() {
  // Appel de la méthode reduce (reduit les valeurs de l'array en une seule en faisant la somme)
  // Elle a en parametre une autre fct et la valeur initiale de 0 (0 = acc) + valeur courante, qui deviendra acc, ainsi de suite comme dans une boucle)
  // cette autre fct a en parametres (l'accumulateur et la valeur courante)
  let sumQty = productInLocalStorage.reduce(function (accu, valCurrent) {
    return accu + parseInt(valCurrent.quantityProduct);
  }, 0);
  let totalQuantity = document.getElementById("totalQuantity");
  totalQuantity.innerText = sumQty;
}

// Calcule le prix total
function calculTotalPrice(fullCart) {
  // Creation d'un array pour utiliser la méthode reduce plus tard
  let sumPriceByProduct = [];
  // Boucle qui index les produits dans le LS
  for (let i in productInLocalStorage) {
    // Récupération du prix de chaque produit du panier en fonction de l'index récupéré
    // (ce sont des arrays ayant les même produits et dans le même ordre)
    let price = fullCart[i].priceProduct;
    // Récupération des quantités de chaque produit par index
    let qty = parseInt(productInLocalStorage[i].quantityProduct);
    // Multiplication du prix par sa quantité correspondante et ajout dans l'array précedement crée
    // On obtient le prix total par produit
    sumPriceByProduct.push(price * qty);
  }
  // Somme des totaux précedent
  let sumPriceTotal = sumPriceByProduct.reduce((accu, valCurrent) => {
    return accu + valCurrent;
  });
  // Récupération de l'element et injection de la somme total dynamiquement
  let totalPrice = document.getElementById("totalPrice");
  totalPrice.innerText = sumPriceTotal;
}

// Supprime
function createEventDelete(fullCart) {
  // On selectionne tous les btn delete en les indexant
  let btnDelete = document.querySelectorAll(".deleteItem");

  // Pour chaque btn "delete", on ajoute un evenement au click
  for (let j = 0; j < btnDelete.length; j++) {
    btnDelete[j].addEventListener("click", (e) => {
      // On enleve le comportement par défaut (redirection du lien)
      e.preventDefault();
      // Avec target, on cible l'objet à l'origine de l'evenement
      // Avec closest, on recherche l'article le plus proche ayant la classe "cart__item en remontant jusqu'aux parents
      // Cela Renvoie l'ancetre le plus proche de l'element courant correpondant aux critères
      let articleToDelete = e.target.closest("article.cart__item");
      // Ensuite on veut les valeurs des attributs "data-id" et "data-color" dans le résultat precedemment obtenu
      let dataId = articleToDelete.getAttribute("data-id");
      let dataColor = articleToDelete.getAttribute("data-color");
      // Suppression de l'article au click dans le dom
      section2.removeChild(articleToDelete);
      // Recherche dans fullCart de l'index de l'article ayant l'id et la couleur de l'article supprimé du dom afin de
      // de le supprimer dans l'array
      const resultIndex = fullCart.findIndex(
        (e) => e.idProduct === dataId && e.colorProduct === dataColor
      );
      /* console.log("resultIndex", resultIndex); */
      fullCart.splice(resultIndex, 1);
      productInLocalStorage.splice(resultIndex, 1);
      localStorage.setItem("product", JSON.stringify(productInLocalStorage));
      // Si le panier est vide on supprime la clé product du ls, sinon on recalcule tout
      if (productInLocalStorage == null || productInLocalStorage == 0) {
        empty();
        localStorage.removeItem("product");
      } else {
        calculTotalQuantity();
        calculTotalPrice(fullCart);
      }
    });
  }
}

// Change la qté
function createEventChangeQty(fullcart) {
  // On selectionne tous les input liés à la qty
  let inputQty = document.querySelectorAll(".itemQuantity");
  for (let k = 0; k < inputQty.length; k++) {
    // chaque fois que l'on fait un chgt, on veut cibler l'obj afin d'obtenir son id et sa couleur
    inputQty[k].addEventListener("change", (e) => {
      let articleToChangeQty = e.target.closest("article.cart__item");
      let dataId = articleToChangeQty.getAttribute("data-id");
      let dataColor = articleToChangeQty.getAttribute("data-color");
      // On veut la nouvelle qty dans l'input
      let neWQty = inputQty[k].value;
      // On veut l'index du produit dans le ls correpondant au pdt dont la qty a changé (grace a la couleur et l'id recuperé)
      let obtainIndex = productInLocalStorage.findIndex(
        (elt) => elt.idProduct === dataId && elt.colorProduct === dataColor
      );
      if (obtainIndex !== -1) {
        // Si on l'obtient, on recupere la qty et on la change,
        // On ecrase ensuite l'ancienne entrée en renvoyant la nouvelle dans le ls et on recalcule les totaux
        productInLocalStorage[obtainIndex].quantityProduct = parseInt(neWQty);
        localStorage.setItem("product", JSON.stringify(productInLocalStorage));
        calculTotalQuantity();
        calculTotalPrice(fullcart);
      }
    });
  }
}

//------------------- FORMULAIRE -------------------------

//-------Regex-------

let matchName = /^(?=.{2,40}$)[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$/; // comprendre //
let matchAddress = /^[0-9A-Za-zÀ-ÖØ-öø-ÿ\-\'\ ]{5,30}$/; // comprendre //
let matchCity = matchName;
let matchEmail = /^[_\w-]+@[\w-]+(\.[a-z]{2,3})$/;

//-------Les variables-------

// Objet qui servira à contrôler si tout le formulaire est bien rempli grâce a "true" dans la fct checkInput
let allInputsCheck = {
  firstName: false,
  lastName: false,
  address: false,
  city: false,
  email: false,
};

let fNameErrMsg = document.getElementById("firstNameErrorMsg");
let fName = document.getElementById("firstName");

let lNameErrMsg = document.getElementById("lastNameErrorMsg");
let lName = document.getElementById("lastName");

let emailErrMsg = document.getElementById("emailErrorMsg");
let email = document.getElementById("email");

let cityErrMsg = document.getElementById("cityErrorMsg");
let city = document.getElementById("city");

let addressErrMsg = document.getElementById("addressErrorMsg");
let address = document.getElementById("address");

let msgCity =
  "Invalide, veuillez renseigner un nom de ville compris entre 2 et 20 caractères";
let msgEmail =
  "Invalide, veuillez renseigner une adresse email de type : nom@domaine.extension";
let msgFname =
  "Invalide, veuillez renseigner un prénom compris entre 2 et 20 caractères";
let msgLname =
  "Invalide, veuillez renseigner un nom compris entre 2 et 20 caractères";
let msgAddress = "Invalide, veuillez renseigner une adresse complète";

//-------Les Fonctions-------

function checkInput(inputName, match, errMsg, contentErrMsg) {
  // Au chgt de chaque input on test si le regex match avec le contenu
  // Si oui on renvoit true et aucun msg d'erreur sinon l'inverse
  inputName.addEventListener("input", function (e) {
    // Sert à obtenir l'id de chaque input qui correspond au nom de clé de chaque paire dans l'objet "allInputsCheck"
    const myInput = inputName.getAttribute("id");
    if (match.test(inputName.value)) {
      errMsg.innerText = "";
      allInputsCheck[myInput] = true;
    } else {
      errMsg.innerText = contentErrMsg;
      allInputsCheck[myInput] = false;
    }
  });
}

checkInput(fName, matchName, fNameErrMsg, msgFname);
checkInput(lName, matchName, lNameErrMsg, msgLname);
checkInput(email, matchEmail, emailErrMsg, msgEmail);
checkInput(city, matchName, cityErrMsg, msgCity);
checkInput(address, matchAddress, addressErrMsg, msgAddress);

// Fct qui enclenche la requête POST
async function submitOrder(order) {
  // Déclaration du paramètre de la fct fetch pour la requête
  const options = {
    method: "POST",
    // il faut convertir le corps (le contenu de la requête) en JSON
    body: JSON.stringify(order),
    // En tête qui précise le type de contenu (JSON)
    headers: { "Content-Type": "application/json" },
  };
  fetch("http://localhost:3000/api/products/order", options)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data, data.orderId);
      confirmation(data.orderId)

    })
    .catch((error) => {
      console.log(error);
    });
}

// Redirection
function confirmation (id) {
  document.location.href = `confirmation.html?order=${id}`;
}

// Création de l'evenement au clique sur le bouton "commander"
function createEventOrder() {
  let btnOrder = document.getElementById("order");
  btnOrder.addEventListener("click", function (e) {
    e.preventDefault();
    // Dès que l'on clique sur le bouton commander, cela crée l'objet suivant :
    let contact = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      email: document.getElementById("email").value,
    };
    // Création de la commande avec les noms exactes ! sinon erreur 400
    const order = { contact, products };
    // On suppose que tout le formulaire est bien rempli
    let formOk = true;
    // Pour chaque entrée de l'obj "allInputsCheck" on veut la paire clé/valeur
    for (const [key, value] of Object.entries(allInputsCheck)) {
      // S'il y a un seul false dans les valeurs, le form passe à false. C'est une boucle qui vérifie chaque paire
      if (!value) {
        formOk = false;
      }
    }
    console.log("le formulaire est", formOk);
    // Si le form reste "true" on envoie
    if (formOk) {
      submitOrder(order);
    } else {
      alert("Les champs sont mal remplis");
    }
  });
}

createEventOrder();

/* fetch("http://localhost:3000/api/products/order")
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
  }); */