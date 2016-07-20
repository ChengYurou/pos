"use strict";

function printReceipt(inputs) {
  const promotions = loadPromotions();
  let cartItems = buildCartItems(inputs);
  let receiptItems = buildReceiptItems(promotions, cartItems);
  let receipt = buildReceipt(receiptItems);
  let text = getText(receipt);

  console.log(text);
}

function getText(receipt) {
  let cartItemText = getCartItemText(receipt.receiptItems);
  let receiptText = getReceiptText(receipt);

  return "***<没钱赚商店>收据***" + cartItemText
    + "\n----------------------" + receiptText + "\n**********************";
}

function getReceiptText(receipt) {

  return '\n总计：' + receipt.total.toFixed(2)
    + '(元)\n节省：' + receipt.summarySave.toFixed(2) + '(元)';
}

function getCartItemText(receiptItems) {
  
  return receiptItems.map(receiptItem => {
    let cartItem = receiptItem.cartItem;

    return '\n名称：' + cartItem.item.name
      + '，数量：' + cartItem.count + cartItem.item.unit
      + '，单价：' + cartItem.item.price.toFixed(2)
      + '(元)，小计：' + receiptItem.subtotal.toFixed(2) + '(元)';
  }).join('');
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

function buildReceipt(receiptItems) {
  let total = 0;
  let summarySave = 0;
  for (let receiptItem of receiptItems) {
    total += receiptItem.subtotal;
    summarySave += receiptItem.save;
  }

  return {receiptItems, total, summarySave}
}

function buildReceiptItems(promotions, cartItems) {
  return cartItems.map(cartItem => {
    let promotionType = getPpromotionType(promotions, cartItem.item.barcode);
    let {subtotal, save} = discount(promotionType, cartItem);

    return {cartItem, subtotal, save};
  });
}

function discount(promotionType, cartItem) {
  let freeCount = 0;

  if (promotionType === 'BUY_TWO_GET_ONE_FREE') {
    freeCount = parseInt(cartItem.count / 3);
  }

  let subtotal = (cartItem.count - freeCount) * cartItem.item.price;
  let save = freeCount * cartItem.item.price;

  return {subtotal, save}
}

function getPpromotionType(promotions, barcode) {
  let promotion = promotions.find(promotion => {
    return promotion.barcodes.includes(barcode);
  });

  return promotion ? promotion.type : '';
}

