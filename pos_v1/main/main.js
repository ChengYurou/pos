"use strict";

function printReceipt(tags) {
  const items = loadAllItems();
  const cartItems = buildCartItems(items,tags);

  const promotions = loadPromotions();
  const receiptItems = buildReceiptItems(promotions, cartItems);

  const receipt = buildReceipt(receiptItems);

  console.log(getText(receipt));
}

function getText(receipt) {
  const cartItemText =receipt.receiptItems.map(receiptItem => {
    const cartItem = receiptItem.cartItem;

    return `名称：${cartItem.item.name}，\
数量：${cartItem.count}${cartItem.item.unit}，\
单价：${formatMoney(cartItem.item.price)}(元)，\
小计：${formatMoney(receiptItem.subtotal)}(元)`;
  }).join('\n');

  return `***<没钱赚商店>收据***
${cartItemText}
----------------------
总计：${formatMoney(receipt.total)}(元)
节省：${formatMoney(receipt.saveTotal)}(元)
**********************`;
}

function formatMoney(money) {
  return money.toFixed(2);
}

function buildReceipt(receiptItems) {
  let total = 0;
  let saveTotal = 0;
  for (let receiptItem of receiptItems) {  //可使用reduce
    total += receiptItem.subtotal;
    saveTotal += receiptItem.save;
  }

  return {receiptItems, total, saveTotal}
}

function buildReceiptItems(promotions, cartItems) {
  return cartItems.map(cartItem => {
    let promotionType = getPromotionType(promotions, cartItem.item.barcode);
    let {subtotal, save} = discount(promotionType, cartItem.count, cartItem.item.price);

    return {cartItem, subtotal, save};
  });
}

function discount(promotionType, count, price) {
  let subtotal = count*price;
  let save = 0;

  if(promotionType === 'BUY_TWO_GET_ONE_FREE') {
    save = parseInt(count/3)*price;
  }
  subtotal -= save;

  return {subtotal, save};
}

function getPromotionType(promotions, barcode) {
  let promotion = promotions.find(promotion => {
    return promotion.barcodes.some(b => b === barcode);
  });

  return promotion ? promotion.type : undefined;
}

function buildCartItems(items,tags) {
  let cartItems = [];

  for (let tag of tags) {
    let barcodeArray = tag.split('-');
    let barcode = barcodeArray[0];
    let count = parseFloat(barcodeArray[1] || 1);

    let cartItem = cartItems.find(cartItem => cartItem.item.barcode === barcode);

    if (cartItem) {
      cartItem.count += count;
    } else {
      let item = items.find(item => item.barcode === barcode);
      cartItems.push({item, count});
    }
  }
  return cartItems;
}






