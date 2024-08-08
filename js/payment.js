document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const orderDetailsElement = document.getElementById('order-summary');
    const totalPriceElement = document.getElementById('total-price');

    function renderOrderDetails() {
        const cartTableBody = document.querySelector('#cart-table tbody');
        if (!cart || cart.length === 0) {
            cartTableBody.innerHTML = '<tr><td colspan="4">No items in cart.</td></tr>';
            totalPriceElement.textContent = '0.00';
            return;
        }

        let total = 0;
        cartTableBody.innerHTML = cart.map(item => {
            total += item.price * item.quantity;
            return `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${item.quantity}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
            `;
        }).join('');

        totalPriceElement.textContent = total.toFixed(2);
    }

    function showAlert(message, details) {
        const alert = document.getElementById('alert-message');
        const alertText = document.querySelector('.alert-text');
        alertText.innerHTML = `
            <h2>Thank You for Your Order!</h2>
            <p>${message}</p>
            <div class="alert-details">
                <div><span class="alert-icon">📅</span> <strong>Delivery Date:</strong> ${details.deliveryDate}</div>
                <div><span class="alert-icon">📍</span> <strong>Delivery Address:</strong><br>
                ${details.fullName}<br>
                ${details.address}, ${details.city}, ${details.state}, ${details.zipCode}</div>
                <div><span class="alert-icon">💵</span> <strong>Total Price:</strong> ${details.totalPrice}</div>
            </div>
        `;
        alert.classList.remove('hidden');
    }

    window.dismissAlert = function() {
        const alert = document.getElementById('alert-message');
        alert.classList.add('hidden');
    }

    renderOrderDetails();

    document.getElementById('paymentForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const fullName = document.getElementById('fullName').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const state = document.getElementById('state').value;
        const zipCode = document.getElementById('zipCode').value;

        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 7); // Assuming delivery date is 7 days from now
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDeliveryDate = deliveryDate.toLocaleDateString(undefined, options);

        const thankYouMessage = `Thank you for your purchase at Zuper-Mart, ${fullName}! Your order will be delivered by ${formattedDeliveryDate}.`;

        const details = {
            deliveryDate: formattedDeliveryDate,
            fullName,
            address,
            city,
            state,
            zipCode,
            totalPrice: `Rs. ${totalPriceElement.textContent}`
        };

        showAlert(thankYouMessage, details);
    });
});
