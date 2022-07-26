// Requête GET à l'API via fetch
fetch("http://localhost:3000/api/products")
  // Création de la promesse avec then et
  // typage des données en JSONs'il y a un resultat
  .then((results) => {
    if (results) {
      return results.json();
    }
  })

  // Ce then récupère les données de la promesse qui sont captées par
  //la fct anonyme en parametre, qui à pour paramètre, elle même, "values"
  //et les affiche sur la console
  .then(function (values) {
    console.log(values);
    //Création et insertion, en boucle, des div pour chaque valeur existante dans la boucle
    //en appelant la fonction "buildHtml"
    values.map(function (value) {
      buildHtml(value);
    });
  })
  //Si aucun resultats, affichage de l'erreur détectée
  .catch(function (error) {
    console.log(error);
  });

//fct qui ajoute les div crée, dans la balise section (dom)
//ensuite avec inner on met les liens, images, descrtiption... grâce aux variables et propriétés ?
function buildHtml(product) {
  const newDiv = document.createElement("div");
  let section = document.getElementById("items");
  section.appendChild(newDiv);
  newDiv.innerHTML = `<a href="./product.html?id=${product._id}"><article><img src="${product.imageUrl}" alt="${product.altTxt}"><h3 class="productName">${product.name}</h3><p class="productDescription">${product.description}</p></article></a>`;
  console.log(newDiv);
  console.log(product);
}
