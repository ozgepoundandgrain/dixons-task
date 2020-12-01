// COT-158-psa
export const getAccessories = (fupid, cb) => {
    const URL =
      `https://api.currys.co.uk/store/api/products/${fupid}/popup_style_attach/visitors/0`;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', URL, true);
    xhr.send();
    xhr.onload = () => {
      const res = JSON.parse(xhr.response);
      cb(res.payload);
    }
};
  
export const getBasketCount = cb => {
    const URL = window.sCartItemCountURL;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', URL, true);
    xhr.send();
    xhr.onload = () => {
      const res = JSON.parse(xhr.response);
      cb(res.content);
    }
};
  
export const extractInfo = DOM => {
    const prdEl = DOM.querySelector('.alertSuccess .stepProduct');
    const count = DOM.querySelector('.alertSuccess h4')
      .textContent.match(/\d+/g)[0];
    const data = {
      name: prdEl.querySelector('.productTitle').textContent.trim(),
      img: prdEl.querySelector('.productLink img').src,
      price: prdEl.querySelector('.currentPrice').textContent,
      itemsCount: parseInt(count)
    };
    return data;
};
  
export const loadConfirmation = (url, cb) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send();
    xhr.responseType = 'document';
    xhr.onload = () => {
      cb(
        extractInfo(xhr.responseXML.documentElement),
        xhr.responseXML.documentElement
      );
    };
}
  
export const addProductToBasket = (fupid, cb) => {
    const URL = `${location.protocol}//${location.host}/api/cart/addProduct`;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', URL, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({ fupid: fupid, quantity: 1, careplan: 0 }));
    xhr.onload = res => {
      if (xhr.status === 200) {
        const resJSON = JSON.parse(res.target.response);
        loadConfirmation(resJSON.redirectUrl, res => {
          cb(res);
        });
      } else {
        window.location.href = `https://www.currys.co.uk/app/basket`;
      }
    }
};
  
export const removeProductFromBasket = (fupid, cb) => {
    const URL = `${location.protocol}//${location.host}/gbuk/s/${fupid}/product_confirmation.html`;
    const params =
      `subaction=product_confirmation&sFUPID=${fupid}&action=deleteStepPage`;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', URL, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'document';
    xhr.send(params);
    xhr.onload = () => cb();
};

export const addToBasket = (FUPID) => {
    fetch(`${​​​​​​​location.protocol}​​​​​​​//${​​​​​​​location.host}​​​​​​​/api/cart/addProduct`, {​​​​​​​
        method: 'POST',
        headers: {​​​​​​​
        'Content-Type': 'application/json'
        }​​​​​​​,
        body: JSON.stringify({​​​​​​​ fupid: FUPID, quantity: 1, careplan: 0 }​​​​​​​)
    }​​​​​​​)
    
}

export const getListingPageData = () => {
    window.appState.getState('listingPage').listingPage
}


export const fetchProductRatings = (sku) => {
    const URL = `https://mark.reevoo.com/reevoomark/embeddable_reviews?filter=all&locale=en-GB&page=1&per_page=1&per_page=1&sku=${sku}&trkref=CYS`;
    fetch(URL)
      .then(res => res.text())
      .then((data) => {
        if (data) {
          const dataHtmlEl = document.createElement('div');
          dataHtmlEl.innerHTML = data;
        }
      });
  };


export const getListingPageBasedOnFilters = (base64JSON) => {
  fetch(`https://www.currys.co.uk/api/shopping/product-listing/page/json/${btoa(JSON.stringify(base64JSON))}`, {
    method: 'GET',
    mode: 'no-cors'
  }).then(res => res.text()).then((data) => {
    window.location.href = `http://www.currys.co.uk${JSON.parse(data).pagination.pageList[0].url}`;
  });
}
// EXAMPLE base64JSON for listing page filtering functionality:
// You can find the base64 string in the api request url in networks tab and convert it to the JSON object using an online tool, in
// order to get a live example of the below object.
// const appState = window.appState.getState('listingPage').listingPage;
// const attributesObject = {};
// const sortDirection = (appState.pageSetup.sortByOptions.selectedOptionValue.includes('asc') && 'ascending') || (this.appState.pageSetup.sortByOptions.selectedOptionValue.includes('desc') && 'descending') || 'none'
// const base64 = {
//   'sortDirection': sortDirection,
//   'sortField': (
//     (appState.pageSetup.sortByOptions.selectedOptionValue.includes('price') && 'price') ||
//     (appState.pageSetup.sortByOptions.selectedOptionValue.includes('brand') && 'brand') ||
//     (appState.pageSetup.sortByOptions.selectedOptionValue.includes('rating') && 'rating') ||
//     (appState.pageSetup.sortByOptions.selectedOptionValue.includes('discount') && 'discount') ||
//     'none'
//   ),
//   'productCount': appState.pagination.itemsNumberPerPage.selectedOptionValue,
//   'pageNumber': 1,
//   'marketId': appState.pageSetup.category.marketId,
//   'segmentId': appState.pageSetup.category.segmentId,
//   'categoryId': appState.pageSetup.category.categoryId,
//   'brandIds': appState.filters.list.filter(item => item.name === 'brand_id')[0].options.filter(item => item.active).map(item => parseInt(item.value, 10)),
//   'priceMin': appState.filters.list[0].options.filter(item => item.active).length > 0 ? appState.filters.list[0].limitBetween.left.value : null,
//   'priceMax': appState.filters.list[0].options.filter(item => item.active).length > 0 ? appState.filters.list[0].limitBetween.right.value : null,
//   'attributes': attributesObject,
//   'view': appState.pageSetup.viewSwitch
// }