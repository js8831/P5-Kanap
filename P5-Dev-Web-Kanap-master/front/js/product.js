// Récuperation complète des propriétés de l'URL en créant un objet URL ({})
// avec pour paramètre : l'url du document en cours et le tout dans une variable
let urlData = new URL(document.location);
// Récuperation du ou des paramètre(s) de l'URL que l'on a inséré sur la page d'accueil "script"
// en mettant l'id dans le lien de redirection après la chaine d'interrogation (search = ? = chaine d'interrogation/recherche)
let params1 = urlData.search;
// la propriété URL.searchParams permet d'analyser plus facilement les paramètres passés à la chaîne de recherche
let params2 = urlData.searchParams;
// Récuperation de la valeur de la variable "id" dans le paramètre d'URL afin d'obtenir les propriétés du canapé correspondant
let id = params2.get("id");
// On récupère l'element possedant l'id "quantity" et "color"
let quantity = document.getElementById("quantity");
let color = document.getElementById("colors");

// Récuperation par fetch des propriétés du canapé ciblé grâce à l'id dans l'URL
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
    createMsgElt();
  })
  .catch((error) => {
    console.log(error);
  });

// Création d'une div avec un id "msg" et que l'on place aprés l'input "quantity" qui permettra l'ajout ou non de message
function createMsgElt() {
  // On crée un élément de type div
  let div = document.createElement("div");
  // On donne un id="msg" à cette div
  div.setAttribute("id", "msg");
  // On met la div après l'input "quantity"
  quantity.after(div);
}

// Vide la div ayant l'id "msg" en ecoutant l'évenement "input" si par exemple il y a correction d'erreur
function hideMsg() {
  let errorElement = document.getElementById("msg");
  errorElement.innerText = "";
}

// Affiche l'argument dans la div ayant pour id "msg"
function displayMsg(text) {
  let errorElement = document.getElementById("msg");
  errorElement.innerHTML = text;
}

// Incrémente les couleurs une par une dans l'input colors
function addColors(choice) {
  color.innerHTML += `<option value="${choice}">${choice}</option>`;
}

// Ajoute les valeurs (name, price, photo et description) d'un canape sur la page 2
function buildHtml(product) {
  // Récuperation de l'élément par l'id
  let name = document.getElementById("title");
  // Une fois l'élément recupéré : ajout des valeurs de "array.key" via "innerHTML"
  name.innerHTML = product.name;
  let price = document.getElementById("price");
  price.innerHTML = product.price;
  let description = document.getElementById("description");
  description.innerHTML = product.description;
  let img = document.querySelector(".item__img");
  img.innerHTML = `<img src="${product.imageUrl}" alt="Photographie d'un canapé">`;
  // Récuperation des couleurs d'un canapé, une par une grace à map qui itère en boucle sur la clé colors
  product.colors.map(function (everyColor) {
    addColors(everyColor);
  });
}

// Fct qui récupere le boutton par l'id,
// Ecoute l'evenement : au clic, la fonction callback qui a pour paramètre "event" est déclenchée
// Cette callback annule le comportement par défaut du lien et appelle la fct "checkIf"
function addButtonEvent(pdts) {
  let elt = document.getElementById("addToCart");
  elt.addEventListener("click", function (event) {
    event.preventDefault();
    checkIf(pdts);
  });
}

// Contenu de checkIf qui vérifie si les valeurs sont bien renseignées
function checkIf(val) {
  // Appel des fct créees plus haut en suposant que tout est ok.
  hideMsg();

  // Création de l'objet JS contenant l'id, la qté et la couleur qui sera stocké dans le LS si tout est ok, pour la page cart
  let optionProduct = {
    idProduct: val._id,
    quantityProduct: document.getElementById("quantity").value,
    colorProduct: document.getElementById("colors").value,
  };
  // Vérification si la qté est comprise entre 0 et 100 et si la couleur est renseigné
  if (
    optionProduct.quantityProduct > 0 &&
    optionProduct.quantityProduct < 101 &&
    optionProduct.colorProduct !== ""
  ) {
    // Si oui, appel de la fct (décrite plus bas) qui permet d'ajouter dans le LS : l'objet "optionProduct"
    addToLocalStorage(optionProduct);
    // Si non, des alertes apparaîssent si la qté = 0, si la qté est sup. à 100 et s'il n'y a pas de couleur renseigné
  } else if (optionProduct.quantityProduct == 0) {
    displayMsg(
      `<span style="background-color:red"> Ajouter une quantité comprise entre 1 et 100, merci :)</span>`
    );
  } else if (optionProduct.quantityProduct > 100) {
    displayMsg(
      `<span style="background-color:red"> Ajouter une quantité comprise entre 1 et 100, merci :)</span>`
    );
  } else if (document.getElementById("colors").value === "") {
    displayMsg(
      `<span style="background-color:red"> Ajouter une couleur, merci :)</span>`
    );
  }
  if (
    optionProduct.quantityProduct == 0 &&
    document.getElementById("colors").value === ""
  ) {
    displayMsg(
      `<span style="background-color:red"> Ajouter une couleur et une quantité comprise entre 1 et 100, merci :)</span>`
    );
  }
}

// Contenu de la fct "addToLocalStorage" qui ajoute au ls
function addToLocalStorage(optionProduct) {
  // Récupération de la clé produit (avec toutes ses propriétés) dans le LS si elle existe
  // Cela en convertissant le résultat de JSON à objet JS pour l'afficher et travailler dessus plus facilement.
  let productInLocalStorage = JSON.parse(localStorage.getItem("product"));
  // Si le LS est vide, on y ajoute une clé produit avec l'objet JS qu'on push dans un array
  if (productInLocalStorage == null) {
    productInLocalStorage = [];
    productInLocalStorage.push(optionProduct),
      localStorage.setItem("product", JSON.stringify(productInLocalStorage));
    // Création et message par ajout de pdts grâce aux fcts ci-dessus

    displayMsg(
      `<span style="background-color:#3DED97">Nouveau produit ajouté avec succès</span>`
    );
    // Ajout d'un timer pour la disparition des msgs d'ajout
    timeHide();
    // Sinon si le LS contient deja des produits, on compare si le nouveau produit
    // à ajouter existe deja dans le LS (en comparant les id et les couleur) grace à findIndex
    // Si il y'a des valeurs identiques, cela nous renvoit l'index du premier produit correspondant aux critères de tri
  } else {
    if (productInLocalStorage !== null) {
      let obtainIndex = productInLocalStorage.findIndex(
        (elt) =>
          elt.idProduct === optionProduct.idProduct &&
          elt.colorProduct === optionProduct.colorProduct
      );
      // Si c'est le cas (diff de -1), on ajuste la qté du produit identique dans le LS grace à son index
      // et on renvoie le nouveau array en écrasant l'ancien car ils portent le meme nom de clé
      // parseInt permet de convertir les strings en entier pour faire une addition de la qté du produit a ajouter avec le pdt deja présent dans le LS
      if (obtainIndex !== -1) {
        productInLocalStorage[obtainIndex].quantityProduct =
          parseInt(productInLocalStorage[obtainIndex].quantityProduct) +
          parseInt(optionProduct.quantityProduct);
        localStorage.setItem("product", JSON.stringify(productInLocalStorage));

        displayMsg(
          `<span style="background-color:#3DED97">Produit déjà ajouté, la quantité sera ajustée</span>`
        );
        timeHide();
        // Si ce n'est pas le cas (le ls n'est pas vide et le produit à ajouter n'est pas identique),
        // on ajoute le nouveau produit en écrasant également
      } else {
        productInLocalStorage.push(optionProduct),
          localStorage.setItem(
            "product",
            JSON.stringify(productInLocalStorage)
          );

        displayMsg(
          `<span style="background-color:#3DED97">Nouveau produit ajouté avec succès</span>`
        );
        timeHide();
      }
    }
  }
}

// Cache les msg d'ajout dans le panier
function hideAddMsg() {
  let errorElement = document.getElementById("msg");
  errorElement.innerText = "";
}

// Disparition des msg d'ajout dans un délai de 2s
function timeHide() {
  setTimeout(() => {
    hideAddMsg();
  }, 2000);
}
