// Récuperation du parametre "id" de l'url afin d'obtenir les propriétés de chaque canapé
let urlData = new URL(document.location);
console.log(urlData);
let params1 = urlData.search;
console.log(params1);
let params2 = urlData.searchParams;
console.log(params2);
let id = params2.get("id");
console.log(id);

// Récuperation des propriétés d'un canapé par ID
fetch(`http://localhost:3000/api/products/${id}`)
  .then((res) => {
    if (res) {
      return res.json();
    }
  })
  .then((values) => {
    console.log(values);
    buildHtml(values);
    // ajouter la fct pour l'event
    addButtonEvent(values);
  })
  .catch((error) => {
    console.log(error);
  });

// Ajoute les propriétes (name, price, photo et description) d'un canape sur la page 2
function buildHtml(product) {
  let name = document.getElementById("title");
  name.innerHTML = `${product.name}`;
  let price = document.getElementById("price");
  price.innerHTML = `${product.price}`;
  let description = document.getElementById("description");
  description.innerHTML = `${product.description}`;
  let img = document.querySelector(".item__img");
  img.innerHTML = `<img src="${product.imageUrl}" alt="Photographie d'un canapé">`;
  console.log(img);
  // Récuperation des couleurs d'un canapé
  product.colors.map(function (color) {
    addColors(color);
    console.log(color);
  });
}

// Ajoute les couleurs une par une
function addColors(choice) {
  let colors = document.getElementById("colors");
  colors.innerHTML += `<option value="${choice}">${choice}</option>`;
}

// Décrire la fct
function addButtonEvent(pdts) {
  let elt = document.getElementById("addToCart");
  elt.addEventListener("click", function (event) {
    // Ici ou plus bas comme dans le sandbox ?
    event.preventDefault();
    // checkInput () avec if else ?
    addToLocalStorage(pdts);
  });
}

// function checkInput (){} à faire

// Décrire la fct
function addToLocalStorage(productInCart) {
  // Création de l'objet JS
  let optionProduct = {
    idProduct: productInCart._id,
    quantityProduct: document.getElementById("quantity").value,
    colorProduct: document.getElementById("colors").value,
  };
  console.log(optionProduct);
  // A supprimer le dernier console log ?
  // console.log(addCart);

  // Création d'une variable interrogeant le LS de la présence d'une clé "product"
  // En l'a convertissant du JSON à un objet JS pour l'afficher ???
  let productInLocalStorage = JSON.parse(localStorage.getItem("product"));
  console.log(productInLocalStorage);
  // Si oui :
  if (productInLocalStorage == null) {
    // Créer un tableau (array) dans le Dom
    (productInLocalStorage = []),
      // Y mettre la variable "optionPoduct" qui contient un objet JS
      productInLocalStorage.push(optionProduct),
      // Convertir le contenu du array en JSON afin de pouvoir le mettre dans le LS
      localStorage.setItem("product", JSON.stringify(productInLocalStorage));
    console.log(productInLocalStorage);
  }
  // Si non :
  else {
    // Si ce n'est pas "null" on capte le array dans "elt" grace à la méthode find ?
    //qui à en parametre une fct anonyme qui a elle meme en parametre "elt" (le contenant)
    productInLocalStorage.every(function (elt) {
      if (
        // On compare elt avec optionProduct
        elt.idProduct == optionProduct.idProduct &&
        elt.colorProduct == optionProduct.colorProduct
      ) {
        // Si le meme article est deja dans le panier, on incrémente
        console.log("ok");
      } else {
        // Sinon on ajoute le nouveau produit dans le panier
        productInLocalStorage.push(optionProduct),
          localStorage.setItem(
            "product",
            JSON.stringify(productInLocalStorage)
          );
        console.log(productInLocalStorage);
      }
    });
  }
}

// Mettre une alerte quand un pdt est ajouté au panier
// On peut supprimer le panier avec un setTimeOut ?
