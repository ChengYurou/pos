'use strict';

function buildCartItems(tags) {
  let items = loadAllItems();
  let cartItems = [];
  for (let tag of tags) {
    let barcodeArray = tag.split('-');
    let barcode = barcodeArray[0];
    let count = parseFloat(barcodeArray[1] || 1);

    let cartItem = cartItems.find((cartItem) => {
      return cartItem.item.barcode === barcode;
    });

    if (cartItem) {
      cartItem.count += count;
    } else {
      let item = items.find((item)=> {
        return item.barcode == barcode
      });
      cartItems.push({item: item, count: count});
    }
  }

  return cartItems;
}

function buildReceiptItems(promotions, cartItems) {

  return cartItems.map((cartItem) => {
    let promotion = promotions.find((promotion) => {
      return promotion.type === 'BUY_TWO_GET_ONE_FREE';
    });

    let promotionBarcode = promotion.barcodes.some((barcode) => {
      return barcode === cartItem.item.barcode;
    });
    let subtotal = parseFloat(cartItem.item.price * cartItem.count);
    let save = 0;

    if (promotionBarcode) {
      save = parseInt(cartItem.count / 3) * cartItem.item.price;
      subtotal = subtotal - save;
    }

    return {cartItem: cartItem, subtotal: subtotal, save: save};
  });
}
