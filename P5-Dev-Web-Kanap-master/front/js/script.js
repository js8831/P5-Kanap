// Requête GET à l'API via fetch
fetch("http://localhost:3000/api/products")
  // Création de la promesse avec then et
  // typage des données en JSONs'il y a un resultat
  .then((results) => {
    if (results) {
      // JSON () pour pouvoir lire et itérer dessus
      return results.json();
    }
  })

  // Ce then récupère les données de la promesse qui sont captées par
  // la fct anonyme en parametre, qui à pour paramètre, elle même, "values"
  // et les affiche sur la console
  .then(function (values) {
    //Création et insertion, en boucle, des div pour chaque valeur existante dans la boucle
    //en appelant la fonction "buildHtml"
    values.map(function (value) {
      buildHtml(value);
    });
  })
  //Si aucun resultat, affichage de l'erreur détectée dans un console.log
  .catch(function (error) {
    console.log(error);
  });

// Fct qui ajoute les articles de l'API, dans la balise section
// Avec inner on met les liens, images, descrtiption... En utilisant les valeurs qu'on a besoin
function buildHtml(product) {
  let section = document.getElementById("items");
  section.innerHTML += `<a href="./product.html?id=${product._id}"><article><img src="${product.imageUrl}" alt="${product.altTxt}"><h3 class="productName">${product.name}</h3><p class="productDescription">${product.description}</p></article></a>`;
}
