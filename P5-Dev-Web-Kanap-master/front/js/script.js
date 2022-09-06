// Fct qui ajoute les articles de l'API, dans la balise section
// Avec inner on insère le contenu : les liens, images, descrtiption... (variables, clés, valeurs, ``)
function buildHtml(product) {
  let section = document.getElementById("items");
  section.innerHTML += `<a href="./product.html?id=${product._id}"><article><img src="${product.imageUrl}" alt="${product.altTxt}"><h3 class="productName">${product.name}</h3><p class="productDescription">${product.description}</p></article></a>`;
}

// Affiche un message si aucun pdt est disponible.
function emptyShop() {
  let title1 = document.querySelector(".titles h1");
  let title2 = document.querySelector(".titles h2");
  title1.innerText = "Aucun produit disponible, merci de repasser plus tard :)";
  title2.innerText = "";
}

// Requête GET à l'API avec la méthode fetch et l'URL (chemin vers la ressource) en argument
// Si pas d'argument suppl. précisant le verbe = requête GET par défaut
fetch("http://localhost:3000/api/products")
  // Création de la promesse avec then et
  // typage des données en JSON s'il y a un resultat
  .then((results) => {
    if (results) {
      // JSON () pour pouvoir lire et itérer plus tard dessus, grâce a la boucle map
      return results.json();
    }
  })

  // On récupère les données typées grâce à return et à la 2ieme promesse .then et on les met dans values
  // qui est en paramètre de la fct anonyme, elle même en paramètre de la méthode "then"
  .then(function (values) {
    // on mappe les données de la promesse et on appelle la fct buildHtml pour chaque produits retournés par l'API fetch et mappé
    values.map(function (value) {
      buildHtml(value);
    });
  })
  //Si la requête est cassé, on affiche l'erreur captée dans la console et on appelle la fct décrite ci-desus.
  .catch(function (error) {
    console.log(error);
    emptyShop();
  });
