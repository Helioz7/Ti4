let total = 0;
let promoApplied = false;
let itemCount = 0;
let originalTotal = 0; // Nouveau: garder une trace du total original

// Charger les produits depuis le fichier JSON
fetch('products.json')
    .then(response => response.json())
    .then(products => {
        const originalProducts = products;
        displayProducts(products);

        // Filtrage des produits
        const filterCheckboxes = document.querySelectorAll('.form-check-input');
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                filterProducts(originalProducts);
            });
        });

        // Tri des produits
        document.getElementById('sortOptions').addEventListener('change', (e) => {
            const sortOption = e.target.value;
            sortProducts(originalProducts, sortOption);
        });
    });

function displayProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = `col-md-4 product-item mb-4 ${product.category}`; // Ajout de mb-4 pour espacer les éléments
        productElement.innerHTML = `
            <div class="card">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body text-center">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="price">Prix : ${product.price.toFixed(2)} €</p>
                    <button class="btn btn-primary add-to-cart" data-product-id="${product.id}" data-product-name="${product.name}" data-product-price="${product.price}">Ajouter au panier</button>
                </div>
            </div>
        `;

        const addToCartButton = productElement.querySelector('.add-to-cart');
        addToCartButton.addEventListener('click', handleAddToCart);
        
        productList.appendChild(productElement);
    });
}

function handleAddToCart(event) {
    const button = event.currentTarget;
    const productId = button.getAttribute('data-product-id');
    const productName = button.getAttribute('data-product-name');
    const productPrice = parseFloat(button.getAttribute('data-product-price'));

    const cartItems = document.getElementById('cart-items');
    const cartItem = document.createElement('li');
    cartItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    
    cartItem.innerHTML = `
        <span>${productName} - ${productPrice} €</span>
        <button class="btn btn-danger btn-sm remove-item">×</button>
    `;

    const removeButton = cartItem.querySelector('.remove-item');
    removeButton.addEventListener('click', () => {
        originalTotal -= productPrice; // Mettre à jour le total original
        if (promoApplied) {
            total = originalTotal * 0.8; // Recalculer le total avec la promotion
        } else {
            total = originalTotal;
        }
        itemCount--;
        updateCartDisplay();
        cartItem.remove();
    });

    cartItems.appendChild(cartItem);

    // Mettre à jour les totaux
    originalTotal += productPrice;
    if (promoApplied) {
        total = originalTotal * 0.8; // Appliquer la promotion si elle est active
    } else {
        total = originalTotal;
    }
    itemCount++;
    
    updateCartDisplay();
    triggerCartPing();
}

function updateCartDisplay() {
    document.getElementById('total-price').textContent = total.toFixed(2);
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = itemCount;
    cartCount.style.display = itemCount > 0 ? 'inline-block' : 'none';

    // Mettre à jour le message de promo si applicable
    if (promoApplied) {
        const savings = (originalTotal - total).toFixed(2);
        document.getElementById('promo-message').textContent = 
            `Code promo appliqué! Économie: ${savings} €. Total original: ${originalTotal.toFixed(2)} €`;
    }
}

function triggerCartPing() {
    const floatingCart = document.getElementById('floating-cart');
    floatingCart.classList.add('ping');
    setTimeout(() => {
        floatingCart.classList.remove('ping');
    }, 500);
}

function filterProducts(originalProducts) {
    const selectedCategories = Array.from(document.querySelectorAll('.form-check-input:checked'))
        .map(input => input.value);

    const filteredProducts = originalProducts.filter(product => {
        return selectedCategories.length === 0 || selectedCategories.includes(product.category);
    });

    displayProducts(filteredProducts);
}


function sortProducts(products, sortOption) {
    let sortedProducts = [...products];
    if (sortOption === 'priceAsc') {
        sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'priceDesc') {
        sortedProducts.sort((a, b) => b.price - a.price);
    }
    displayProducts(sortedProducts);
}

// Gestionnaire du code promo amélioré
document.getElementById('apply-promo').addEventListener('click', () => {
    const promoCode = document.getElementById('promo-code').value.trim();
    const promoMessage = document.getElementById('promo-message');
    
    if (promoCode === 'CF2M') {
        if (!promoApplied) {
            promoApplied = true;
            total = originalTotal * 0.8; // Appliquer 20% de réduction
            const savings = (originalTotal - total).toFixed(2);
            promoMessage.textContent = `Code promo appliqué! Économie: ${savings} €. Total original: ${originalTotal.toFixed(2)} €`;
            document.getElementById('total-price').textContent = total.toFixed(2);
        } else {
            promoMessage.textContent = 'Le code promo est déjà appliqué.';
        }
    } else {
        promoMessage.textContent = 'Code promo invalide.';
    }
});

// Gestionnaire du formulaire de confirmation
document.getElementById('confirmation-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (itemCount === 0) {
        alert('Votre panier est vide. Veuillez ajouter des articles avant de commander.');
        return;
    }
    
    alert('Commande soumise avec succès!');
    
    // Réinitialiser tous les états
    document.getElementById('cart-items').innerHTML = '';
    total = 0;
    originalTotal = 0;
    itemCount = 0;
    promoApplied = false;
    updateCartDisplay();
    document.getElementById('promo-message').textContent = '';
    document.getElementById('promo-code').value = '';
    document.getElementById('confirmation-form').reset();
});