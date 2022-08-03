// Récuperation des propriétés de l'URL
let urlData = new URL(document.location);
// Récuperation des paramètres de l'URL
let params1 = urlData.search;
// ?????????????????????????????
let params2 = urlData.searchParams;
// Récuperation de l'ID de l'URL afin d'obtenir les propriétés de chaque canapé
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
  // Création de l'objet JS contenant l'ID, la qté et la couleur
  let optionProduct = {
    idProduct: val._id,
    quantityProduct: document.getElementById("quantity").value,
    colorProduct: document.getElementById("colors").value,
  };
  // Vérification si la qté est comprise entre 0 et 100
  if (
    optionProduct.quantityProduct > 0 &&
    optionProduct.quantityProduct < 100
  ) {
    // Si oui, appel de la fct qui permet d'ajouter dans le LS
    addToLocalStorage(optionProduct);
  } else {
    // Si non, une alerte apparaît
    alert("Ajouter une quantité, merci :)");
  }
}

// Contenu de addToLocalStorage
function addToLocalStorage(optionProduct) {
  // Création d'une variable interrogeant le LS sur la présence de la clé "product"
  // En convertissant le résultat du JSON à un objet JS pour l'afficher ???????????????????????
  let productInLocalStorage = JSON.parse(localStorage.getItem("product"));
  // Si le LS est vide, on ajoute un nouveau produit dans le LS avec la clé "product" via un array.
  // Pourquoi passer par un array ????????????
  if (productInLocalStorage == null) {
    productInLocalStorage = [];
    productInLocalStorage.push(optionProduct),
      localStorage.setItem("product", JSON.stringify(productInLocalStorage));
    console.log("Nouveau produit ajouté avec succès");
    // Sinon si le LS contient des produits, on crée une variable qui recherche si le nouveau produit
    // à ajouter existe deja dans le LS (id et couleur) en nous renvoyant son index
  } else {
    if (productInLocalStorage !== null) {
      let obtainIndex = productInLocalStorage.findIndex(
        (elt) =>
          elt.idProduct === optionProduct.idProduct &&
          elt.colorProduct === optionProduct.colorProduct
      );
      // Si c'est le cas, on ecrase l'ancienne clé en
      // ajoutant la nouvelle, avec les quantités ajustées du produit
      // parseInt permet de convertir les strings en entier
      if (obtainIndex !== -1) {
        productInLocalStorage[obtainIndex].quantityProduct =
          parseInt(productInLocalStorage[obtainIndex].quantityProduct) +
          parseInt(optionProduct.quantityProduct);
        localStorage.setItem("product", JSON.stringify(productInLocalStorage));
        alert("Produit déjà ajouté, la quantité sera ajustée");
        // Si ce n'est pas le cas, on ajoute le nouveau produit
      } else {
        productInLocalStorage.push(optionProduct),
          localStorage.setItem(
            "product",
            JSON.stringify(productInLocalStorage)
          );
        alert("Nouveau produit ajouté avec succès");
      }
    }
  }
}

// On peut supprimer le panier avec un setTimeOut ?
// Effacer les console log et refaire les commentaires
// function checkInput (){} pour le SVP
