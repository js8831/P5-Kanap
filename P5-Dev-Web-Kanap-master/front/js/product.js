// Récuperation des propriétés de l'URL
let urlData = new URL(document.location);
// Récuperation des paramètres de l'URL
let params1 = urlData.search;
// ?????????????????????????????
let params2 = urlData.searchParams;
// Récuperation de l'ID de l'URL dans le paramètre afin d'obtenir les propriétés de chaque canapé
let id = params2.get("id");

// Récuperation des propriétés d'un canapé par ID
fetch(`http://localhost:3000/api/products/${id}`)
  .then((res) => {
    if (res) {
      return res.json();
    }
  })
  .then((values) => {
    // On appelle les 2 fcts suivantes :
    buildHtml(values);
    addButtonEvent(values);
  })
  .catch((error) => {
    console.log(error);
  });

// Crée une div avec id placé avant le btn "ajouter"
function createMsgElt() {
  // On récupère l'element "quantity"
  let target = document.getElementById("quantity");
  // On crée une div
  let div = document.createElement("div");
  // On donne un id=msg à cette div
  div.setAttribute("id", "msg");
  // On met la div avant le bouton "ajouter" ?
  target.after(div);
}

// Cache le message en ecoutant l'evenement "input"
// Peut on optimiser ???????
function hideMsg() {
  let quantity = document.getElementById("quantity");
  let color = document.getElementById("colors");
  quantity.addEventListener("input", function () {
    let errorElement = document.getElementById("msg");
    errorElement.innerText = "";
  });
  color.addEventListener("input", function () {
    let errorElement = document.getElementById("msg");
    errorElement.innerText = "";
  });
}

// Affiche le paramètre dans la div ayant pour id=msg 
function displayMsg(text) {
  let errorElement = document.getElementById("msg");
  errorElement.innerHTML = text;
}

// Ajoute les couleurs une par une
function addColors(choice) {
  let colors = document.getElementById("colors");
  colors.innerHTML += `<option value="${choice}">${choice}</option>`;
}

// Ajoute les valeurs (name, price, photo et description) d'un canape sur la page 2
function buildHtml(product) {
  // Récuperation de l'élément par l'id
  let name = document.getElementById("title");
  // Une fois l'élément recupéré : ajout des valeurs de "product" via "innerHTML"
  name.innerHTML = `${product.name}`;
  let price = document.getElementById("price");
  price.innerHTML = `${product.price}`;
  let description = document.getElementById("description");
  description.innerHTML = `${product.description}`;
  let img = document.querySelector(".item__img");
  img.innerHTML = `<img src="${product.imageUrl}" alt="Photographie d'un canapé">`;
  // Récuperation des couleurs d'un canapé, une par une grace à map qui itère (boucle)
  product.colors.map(function (color) {
    addColors(color);
  });
}

// Fct qui récupere le boutton par l'id,
// Ecoute l'evenement : au clic, la fonction callback qui a pour paramètre "event" est déclenchée
// Cette callback annule le comportement par défaut du lien et appelle la fct "checkIf"
function addButtonEvent(pdts) {
  let elt = document.getElementById("addToCart");
  elt.addEventListener("click", function (event) {
    // Ici ou plus bas comme dans le sandbox ?
    event.preventDefault();
    checkIf(pdts);
  });
}

// Contenu de checkIf
function checkIf(val) {
  // Appel des fct créees plus haut
  createMsgElt();
  hideMsg();

  // Création de l'objet JS contenant l'ID, la qté et la couleur
  let optionProduct = {
    idProduct: val._id,
    quantityProduct: document.getElementById("quantity").value,
    colorProduct: document.getElementById("colors").value,
  };
  // Vérification si la qté est comprise entre 0 et 100
  if (
    optionProduct.quantityProduct > 0 &&
    optionProduct.quantityProduct < 100 &&
    optionProduct.colorProduct !== ""
  ) {
    // Si oui, appel de la fct qui permet d'ajouter dans le LS
    addToLocalStorage(optionProduct);
  } else if (optionProduct.quantityProduct == 0) {
    // Si non, des alertes apparaîssent
    displayMsg(
      `<span style="background-color:red"> Ajouter une quantité comprise entre 0 et 100, merci :)</span>`
    );
  } else if (optionProduct.quantityProduct > 100) {
    displayMsg(
      `<span style="background-color:red"> Ajouter une quantité comprise entre 0 et 100, merci :)</span>`
    );
  } else if (document.getElementById("colors").value === "") {
    displayMsg(
      `<span style="background-color:red"> Ajouter une couleur, merci :)</span>`
    );
  }
}

// Contenu de addToLocalStorage
function addToLocalStorage(optionProduct) {
  // Récupération de la clé produit (avec toutes ses valeurs) dans le LS si elle existe
  // Cela en convertissant le résultat de JSON à objet JS pour l'afficher ???????????????????????
  let productInLocalStorage = JSON.parse(localStorage.getItem("product"));
  // Si le LS est vide, on y ajoute une nouvelle clé produit avec ses valeurs via un array.
  // Pourquoi passer par un array ???????????? pour y mettre plusieurs objets JS ou du json ?
  if (productInLocalStorage == null) {
    productInLocalStorage = [];
    productInLocalStorage.push(optionProduct),
      localStorage.setItem("product", JSON.stringify(productInLocalStorage));
    createMsgElt();
    displayMsg(
      `<span style="background-color:#3DED97">Nouveau produit ajouté avec succès</span>`
    );
    setHide();
    // Sinon si le LS contient des produits, on compare si le nouveau produit
    // à ajouter existe deja dans le LS (id et couleur) en nous renvoyant son index SI OUI.
  } else {
    if (productInLocalStorage !== null) {
      let obtainIndex = productInLocalStorage.findIndex(
        (elt) =>
          elt.idProduct === optionProduct.idProduct &&
          elt.colorProduct === optionProduct.colorProduct
      );
      // Si c'est le cas, on ajuste la qté du produit en question dans le LS qu'on avait appelé precedement ligne 87
      // et on renvoie le nouveau array en écrasant l'ancien car ils portent le meme nom de clé ?????????
      // parseInt permet de convertir les strings en entier
      if (obtainIndex !== -1) {
        productInLocalStorage[obtainIndex].quantityProduct =
          parseInt(productInLocalStorage[obtainIndex].quantityProduct) +
          parseInt(optionProduct.quantityProduct);
        localStorage.setItem("product", JSON.stringify(productInLocalStorage));
        createMsgElt();
        displayMsg(
          `<span style="background-color:#3DED97">Produit déjà ajouté, la quantité sera ajustée</span>`
        );
        setHide();
        // Si ce n'est pas le cas, on ajoute le nouveau produit
      } else {
        productInLocalStorage.push(optionProduct),
          localStorage.setItem(
            "product",
            JSON.stringify(productInLocalStorage)
          );
        createMsgElt();
        displayMsg(
          `<span style="background-color:#3DED97">Nouveau produit ajouté avec succès</span>`
        );
        setHide();
      }
    }
  }
}

// On peut supprimer le panier avec un setTimeOut ?

// Cache les msg d'ajout dans le panier 
function hideAddMsg() {
  let errorElement = document.getElementById("msg");
  errorElement.innerText = "";
}

// Disparition des msg d'ajout dans un délai de 2s
function setHide() {
  setTimeout(() => {
    hideAddMsg();
  }, 2000);
}



