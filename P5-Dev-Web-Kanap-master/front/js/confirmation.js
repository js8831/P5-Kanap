let urlData = new URL(document.location);
let params = urlData.searchParams;
let order = params.get("order");

function numberOrder(order) {
  let orderId = document.getElementById("orderId");
  orderId.innerText = order;
}
numberOrder(order);

function deleteAllLs() {
  localStorage.clear();
}
deleteAllLs();
