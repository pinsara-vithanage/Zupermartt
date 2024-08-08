document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartTableBody = document.querySelector('#cart-table tbody');
    const totalPriceElement = document.getElementById('total-price');

    let alertQueue = [];
    let alertInProgress = false;

    const customAlert = (title, message) => {
        alertQueue.push({ title, message });
        if (!alertInProgress) {
            showNextAlert();
        }
    };

    const showNextAlert = () => {
        if (alertQueue.length > 0) {
            alertInProgress = true;
            const { title, message } = alertQueue.shift();
            document.getElementById('alert-title').textContent = title;
            document.getElementById('alert-message').textContent = message;
            document.getElementById('custom-alert').style.display = "block";
        } else {
            alertInProgress = false;
        }
    };

    document.getElementById('close-alert').onclick = function() {
        document.getElementById('custom-alert').style.display = "none";
        showNextAlert();
    };

    document.getElementById('alert-ok-button').onclick = function() {
        document.getElementById('custom-alert').style.display = "none";
        showNextAlert();
    };

    window.onclick = function(event) {
        if (event.target === document.getElementById('custom-alert')) {
            document.getElementById('custom-alert').style.display = "none";
            showNextAlert();
        }
    };

    renderCart();

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const content = button.closest('.content');
            const name = content.querySelector('input').dataset.name;
            const price = parseFloat(content.querySelector('input').dataset.price);
            const quantity = parseFloat(content.querySelector('input').value);

            if (!quantity || quantity <= 0) {
                customAlert('Invalid Quantity', 'Please enter a valid quantity.');
                return;
            }

            addToCart(name, price, quantity);
        });
    });

    function addToCart(name, price, quantity) {
        const itemIndex = cart.findIndex(item => item.name === name);

        if (itemIndex > -1) {
            cart[itemIndex].quantity += quantity;
        } else {
            cart.push({ name, price, quantity });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }

    function renderCart() {
        cartTableBody.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
            `;
            cartTableBody.appendChild(row);
            total += item.price * item.quantity;
        });

        totalPriceElement.textContent = total.toFixed(2);
    }

    document.getElementById('add-to-favourites').addEventListener('click', () => {
        const favouriteCart = cart.map(item => ({ ...item }));
        localStorage.setItem('favouriteCart', JSON.stringify(favouriteCart));

        if (favouriteCart.length === 1) {
            // If there is only one item in the cart, show the item name
            customAlert('Added to Favorites', `Item "${favouriteCart[0].name}" added to favorites!`);
        } else if (favouriteCart.length > 1) {
            // If there are multiple items in the cart, show a generic message
            customAlert('Added to Favorites', `${favouriteCart.length} items added to favorites!`);
        }
    });

    document.getElementById('apply-favourites').addEventListener('click', () => {
        const favouriteCart = JSON.parse(localStorage.getItem('favouriteCart'));

        if (favouriteCart) {
            cart.length = 0;
            favouriteCart.forEach(item => cart.push(item));
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        } else {
            customAlert('No Favourites', 'No favourites saved!');
        }
    });

    document.getElementById('clear-cart').addEventListener('click', () => {
        cart.length = 0;
        localStorage.removeItem('cart');
        renderCart();
    });

    document.getElementById('buy-now').addEventListener('click', () => {
        if (cart.length === 0) {
            customAlert('Empty Cart', 'Your cart is empty! Please add items to your cart before proceeding to payment.');
            return;
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = 'payment.html';
    });
});
