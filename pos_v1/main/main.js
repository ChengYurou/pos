'use strict';

function buildCartItems(barcodes) {
  let cartItems = [];

  barcodes.forEach(function (barcode) {
    let barcodeArray = barcode.split("-");

    if(barcodeArray.length > 1){
      for(let i=0; i<parseInt(barcodeArray[1]); i++){
        barcodes.splice(barcodes.indexOf(barcode),0,barcodeArray[0]);
      }
      barcodes.splice(barcodes.indexOf(barcode),1);
    }
  });

  barcodes.forEach(function (barcode) {
    let existedItem = findItem(barcode);
    let existedCartItem = findExistCartItem(existedItem,cartItems);

    if (existedCartItem) {
      existedCartItem.count++;
    } else {
      cartItems.push({item: existedItem, count: 1})
    }
  });

  return cartItems;
}

function findExistCartItem(existedItem,cartItems) {
  let existedCartItem = false;

  cartItems.forEach(function (cartItem) {
    if(cartItem.item.barcode === existedItem.barcode){
      existedCartItem = cartItem;
    }
  });

  return existedCartItem;
}

function findItem(barcode) {
  let existedItem;
  const items = loadAllItems();

  items.forEach(function (item) {
    if(item.barcode === barcode){
      existedItem = item;
    }
  });

  return existedItem;
}
