'use strict';

function buildCartItems(tags) {
  let items = loadAllItems();
  let cartItems = [];

  for (let tag of tags) {
    let barcodeArray = tag.split('-');
    let barcode = barcodeArray[0];
    let count = parseFloat(barcodeArray[1] || 1);
    let cartItem = cartItems.find((cartItem) => {
      return cartItem.item.barcode == barcode
    });

    if (cartItem) {
      cartItem.count++;
    } else {
      let item = items.find((item) => {
        return item.barcode == barcode;
      });

      cartItems.push({item: item, count: count});
    }
  }

  return cartItems;
}
