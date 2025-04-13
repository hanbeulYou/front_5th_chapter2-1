const prodList = [
  { id: 'p1', name: '상품1', val: 10000, q: 50 },
  { id: 'p2', name: '상품2', val: 20000, q: 30 },
  { id: 'p3', name: '상품3', val: 30000, q: 20 },
  { id: 'p4', name: '상품4', val: 15000, q: 0 },
  { id: 'p5', name: '상품5', val: 25000, q: 10 },
];

const handleCartItemsContainerClick = (event) => {
  const tgt = event.target;

  if (
    tgt.classList.contains('quantity-change')
    || tgt.classList.contains('remove-item')
  ) {
    const prodId = tgt.dataset.productId;
    const itemElem = document.getElementById(prodId);
    const prod = prodList.find((p) => p.id === prodId);

    if (tgt.classList.contains('quantity-change')) {
      const qtyChange = parseInt(tgt.dataset.change);
      const newQty =
        parseInt(itemElem.querySelector('span').textContent.split('x ')[1])
        + qtyChange;

      if (
        newQty > 0
        && newQty
          <= prod.q
            + parseInt(
              itemElem.querySelector('span').textContent.split('x ')[1],
            )
      ) {
        itemElem.querySelector('span').textContent =
          itemElem.querySelector('span').textContent.split('x ')[0]
          + 'x '
          + newQty;
        prod.q -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();
        prod.q -= qtyChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (tgt.classList.contains('remove-item')) {
      const remQty = parseInt(
        itemElem.querySelector('span').textContent.split('x ')[1],
      );

      prod.q += remQty;
      itemElem.remove();
    }

    calcCart();
  }
};

const handleAddButtonClick = () => {
  const selItem = productSelect.value;
  const itemToAdd = prodList.find((p) => p.id === selItem);

  if (itemToAdd && itemToAdd.q > 0) {
    const item = document.getElementById(itemToAdd.id);

    if (item) {
      const newQty =
        parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;

      if (newQty <= itemToAdd.q) {
        item.querySelector('span').textContent =
          itemToAdd.name + ' - ' + itemToAdd.val + '원 x ' + newQty;
        itemToAdd.q--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      const newItem = document.createElement('div');

      newItem.id = itemToAdd.id;
      newItem.className = 'flex justify-between items-center mb-2';
      newItem.innerHTML = `
        <span>${itemToAdd.name} - ${itemToAdd.val}원 x 1</span>
        <div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="-1">-</button>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="1">+</button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${itemToAdd.id}">삭제</button>
        </div>
      `;
      cartItemsContainer.appendChild(newItem);
      itemToAdd.q--;
    }
    calcCart();
    lastSel = selItem;
  }
};

const productSelect = document.createElement('select');
const addButton = document.createElement('button');
const cartItemsContainer = document.createElement('div');
const totalAmountContainer = document.createElement('div');
const stockStatusContainer = document.createElement('div');

let lastSel;
let bonusPts = 0;
let totalAmt = 0;
let itemCnt = 0;

const main = () => {
  const mainRoot = document.getElementById('app');
  const mainContainer = document.createElement('div');
  const mainWrapper = document.createElement('div');
  const mainHeader = document.createElement('h1');

  productSelect.id = 'product-select';
  productSelect.className = 'border rounded p-2 mr-2';

  addButton.id = 'add-to-cart';
  addButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  addButton.textContent = '추가';
  addButton.addEventListener('click', handleAddButtonClick);

  cartItemsContainer.id = 'cart-items';
  cartItemsContainer.addEventListener('click', handleCartItemsContainerClick);

  totalAmountContainer.id = 'cart-total';
  totalAmountContainer.className = 'text-xl font-bold my-4';

  stockStatusContainer.id = 'stock-status';
  stockStatusContainer.className = 'text-sm text-gray-500 mt-2';

  mainContainer.className = 'bg-gray-100 p-8';

  mainWrapper.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';

  mainHeader.className = 'text-2xl font-bold mb-4';
  mainHeader.textContent = '장바구니';

  updateSelOpts();

  mainWrapper.appendChild(mainHeader);
  mainWrapper.appendChild(cartItemsContainer);
  mainWrapper.appendChild(totalAmountContainer);
  mainWrapper.appendChild(productSelect);
  mainWrapper.appendChild(addButton);
  mainWrapper.appendChild(stockStatusContainer);
  mainContainer.appendChild(mainWrapper);
  mainRoot.appendChild(mainContainer);

  calcCart();

  setTimeout(() => {
    setInterval(() => {
      const luckyItem = prodList[Math.floor(Math.random() * prodList.length)];

      if (Math.random() < 0.3 && luckyItem.q > 0) {
        luckyItem.val = Math.round(luckyItem.val * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelOpts();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(() => {
    setInterval(() => {
      if (lastSel) {
        const suggest = prodList.find(
          (item) => item.id !== lastSel && item.q > 0,
        );

        if (suggest) {
          alert(
            suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!',
          );
          suggest.val = Math.round(suggest.val * 0.95);
          updateSelOpts();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
};

const updateSelOpts = () => {
  productSelect.innerHTML = '';
  prodList.forEach((item) => {
    const opt = document.createElement('option');

    opt.value = item.id;
    opt.textContent = item.name + ' - ' + item.val + '원';
    if (item.q === 0) opt.disabled = true;

    productSelect.appendChild(opt);
  });
};

const calcCart = () => {
  totalAmt = 0;
  itemCnt = 0;

  const cartItems = cartItemsContainer.children;
  let subTot = 0;

  for (let i = 0; i < cartItems.length; i++) {
    let curItem;

    for (let j = 0; j < prodList.length; j++) {
      if (prodList[j].id === cartItems[i].id) {
        curItem = prodList[j];
        break;
      }
    }

    const q = parseInt(
      cartItems[i].querySelector('span').textContent.split('x ')[1],
    );
    const itemTot = curItem.val * q;
    let disc = 0;

    itemCnt += q;
    subTot += itemTot;

    if (q >= 10) {
      if (curItem.id === 'p1') disc = 0.1;
      else if (curItem.id === 'p2') disc = 0.15;
      else if (curItem.id === 'p3') disc = 0.2;
      else if (curItem.id === 'p4') disc = 0.05;
      else if (curItem.id === 'p5') disc = 0.25;
    }

    totalAmt += itemTot * (1 - disc);
  }

  let discRate = 0;

  if (itemCnt >= 30) {
    const bulkDisc = totalAmt * 0.25;
    const itemDisc = subTot - totalAmt;

    if (bulkDisc > itemDisc) {
      totalAmt = subTot * (1 - 0.25);
      discRate = 0.25;
    } else {
      discRate = (subTot - totalAmt) / subTot;
    }
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }
  if (new Date().getDay() === 2) {
    totalAmt *= 1 - 0.1;
    discRate = Math.max(discRate, 0.1);
  }

  totalAmountContainer.textContent = '총액: ' + Math.round(totalAmt) + '원';

  if (discRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discRate * 100).toFixed(1) + '% 할인 적용)';
    totalAmountContainer.appendChild(span);
  }

  updateStockInfo();
  renderBonusPts();
};

const renderBonusPts = () => {
  let ptsTag = document.getElementById('loyalty-points');

  if (!ptsTag) {
    ptsTag = document.createElement('span');
    ptsTag.id = 'loyalty-points';
    ptsTag.className = 'text-blue-500 ml-2';
    totalAmountContainer.appendChild(ptsTag);
  }

  bonusPts = Math.floor(totalAmt / 1000);
  ptsTag.textContent = '(포인트: ' + bonusPts + ')';
};

const updateStockInfo = () => {
  let infoMsg = '';

  prodList.forEach((item) => {
    if (item.q < 5) {
      infoMsg +=
        item.name
        + ': '
        + (item.q > 0 ? '재고 부족 (' + item.q + '개 남음)' : '품절')
        + '\n';
    }
  });

  stockStatusContainer.textContent = infoMsg;
};

main();
