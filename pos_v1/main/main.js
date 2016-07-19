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
  let receiptItems = [];

  for (let cartItem of cartItems) {
    let promotionBarcode = promotions[0].barcodes.find((barcode) => {
      return barcode === cartItem.item.barcode;
    });

    let moreSubtotal = parseFloat(cartItem.item.price * cartItem.count);

    if (promotionBarcode) {
      let subtotal = (parseInt(cartItem.count / 3) * 2) * cartItem.item.price +
        parseInt(cartItem.count % 3) * cartItem.item.price;
      let save = moreSubtotal - subtotal;
      receiptItems.push({cartItem: cartItem, subtotal: subtotal, save: save});
    } else {
      receiptItems.push({cartItem: cartItem, subtotal: moreSubtotal, save: 0})
    }
  }

  return receiptItems;
}
