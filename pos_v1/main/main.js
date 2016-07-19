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
  return cartItems.map(cartItem => {
    let promotionType = getpromotionType(cartItem.item.barcode, promotions);
    let {subtotal,save} = discount(cartItem,promotionType);

    return {cartItem, subtotal, save};
  });
}

function discount(cartItem,promotionType) {
  let freeCount = 0;
  if(promotionType === 'BUY_TWO_GET_ONE_FREE'){
    freeCount = parseInt(cartItem.count/3);
  }
  let subtotal = (cartItem.count-freeCount)*cartItem.item.price;
  let save = freeCount*cartItem.item.price;
  
  return {subtotal, save};
}

function getpromotionType(barcode, promotions) {
  let promotion = promotions.find(promotion => {
    return promotion.barcodes.includes(barcode);
  });

  return promotion?promotion.type:"";
}
