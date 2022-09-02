// Récuperation des propriétés de l'URL
let urlData = new URL(document.location);
// Récuperation des paramètres de l'URL
let params1 = urlData.search;
// ?????????????????????????????
let params2 = urlData.searchParams;
// Récuperation de l'ID de l'URL dans le paramètre afin d'obtenir les propriétés de chaque canapé
let order = params2.get("order");

function numberOrder(order) {
  let orderId = document.getElementById("orderId");
  orderId.innerText = order;
}
numberOrder(order);

function deleteAllLs() {
  localStorage.clear();
}

deleteAllLs();
