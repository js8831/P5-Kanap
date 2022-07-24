// Récuperation du parametre "id" de l'url afin d'obtenir les propriétés de chaque canapé
let urlData = new URL(document.location);
console.log(urlData);
let params1 = urlData.search;
console.log(params1);
let params2 = urlData.searchParams;
console.log(params2);
let id = params2.get("id");
console.log(id);

fetch(`http://localhost:3000/api/products/${id}`)
  .then((res) => {
    if (res) {
      return res.json();
    }
  })
  .then((values) => {
    console.log(values);
    buildHtml(values);
    values.colors.map(function (value) {
      addColors(value);
      console.log(value);
    });
  })
  .catch((error) => {
    console.log(error);
  });

//ajoute les propriétes des canapes récupérées avec fetch
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
}

//ajoute les couleurs une par une
function addColors(choice) {
  let colors = document.getElementById("colors");
  colors.innerHTML += `<option value="${choice}">${choice}</option>`;
}
