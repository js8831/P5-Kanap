// Requête GET à l'API
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
    //Création et insertion, en boucle, des div pour chaque valeur existante
    //en appelant la fonction "buildHtml"
    values.map(function (value) {
      buildHtml(value);
    });
  })
  //Si aucun resultats, affichage de l'erreur détectée
  .catch(function (error) {
    console.log(error);
  });

function buildHtml() {
  const newCanape = document.createElement("div");
  let section = document.getElementById("items");
  section.appendChild(newCanape);
  console.log(newCanape);
}
