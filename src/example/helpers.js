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

