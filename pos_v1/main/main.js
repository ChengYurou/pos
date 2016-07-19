"use strict";

function printReceipt(receipt) {
  let cartItemText = getCartItemText(receipt.receiptItems);
  let receiptText = getReceiptText(receipt);
  let text = "***<没钱赚商店>收据***" + cartItemText
    + "\n----------------------" + receiptText + "\n**********************";

  console.log(text);
}

function getReceiptText(receipt) {

  return '\n总计：' + receipt.total.toFixed(2)
    + '(元)\n节省：' + receipt.summarySave.toFixed(2) + '(元)';
}

function getCartItemText(receiptItems) {
  let cartItemText = "";

  for (let receiptItem of receiptItems) {
    let cartItem = receiptItem.cartItem;
    cartItemText += '\n名称：' + cartItem.item.name
      + '，数量：' + cartItem.count + cartItem.item.unit
      + '，单价：' + cartItem.item.price.toFixed(2)
      + '(元)，小计：' + receiptItem.subtotal.toFixed(2) + '(元)';
  }

  return cartItemText;
}

function buildCartItems(tags) {
  let cartItems = [];
  let items = loadAllItems();

  for (let tag of tags) {
    let barcodeArray = tag.split('-');
    let barcode = barcodeArray[0];
    let count = parseFloat(barcodeArray[1] || 1);

    let cartItem = cartItems.find(cartItem => cartItem.item.barcode === barcode);

    if (cartItem) {
      cartItem.count++;
    } else {
      let item = items.find(item => item.barcode === barcode);
      cartItems.push({item, count});
    }
  }
  return cartItems;
}

function buildReceiptItems(promotions, cartItems) {
  return cartItems.map(cartItem => {
    let promotionType = getPromotionType(cartItem.item.barcode, promotions);
    let {subtotal, save} = discount(cartItem, promotionType);

    return {cartItem, subtotal, save};
  });
}

function discount(cartItem, promotionType) {
  let freeCount = 0;
  if (promotionType === 'BUY_TWO_GET_ONE_FREE') {
    freeCount = parseInt(cartItem.count / 3);
  }

  let subtotal = (cartItem.count - freeCount) * cartItem.item.price;
  let save = freeCount * cartItem.item.price;

  return {subtotal, save};
}

function getPromotionType(barcode, promotions) {
  let promotion = promotions.find(promotion => {
    return promotion.barcodes.includes(barcode);
  });
  return promotion ? promotion.type : '';
}

function buildReceipt(receiptItems) {
  let total = 0;
  let summarySave = 0;
  for (let receiptItem of receiptItems) {
    total += receiptItem.subtotal;
    summarySave += receiptItem.save;
  }

  return {receiptItems, total, summarySave}
}

