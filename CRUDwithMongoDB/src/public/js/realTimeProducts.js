const socket = io()

// Listen for the WebSocket event 'productCreated'
socket.on('productCreated', (newProduct) => {
     // Call the function to create a product card for the newly created product
    this.createProductCard(newProduct)
});

// Listen for the WebSocket event 'productDeleted'
socket.on('productDelected', (productId) => {
    // Find the product card by its ID and remove it from the DOM
    const productCard = document.getElementById(`product-card-${productId}`);
    if (productCard) {
        productCard.remove();
    }
});

// Add event listeners to required form inputs for validation
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addProductForm');
    const requiredInputs = form.querySelectorAll('input[required]');
    requiredInputs.forEach(input => {
        input.addEventListener('invalid', () => {
            input.setCustomValidity('Please fill out this field');
        });

        input.addEventListener('input', () => {
            input.setCustomValidity('');
        });
    });

});

// Function to create a product card
function createProductCard(newProduct) {
    const productList = document.querySelector('#product-list');

    
    const productCard = document.createElement('div');
    productCard.id = `product-card-${newProduct.id}`
    productCard.classList.add('card');

    
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = newProduct.title;
    const cardPrice = document.createElement('p');
    cardPrice.classList.add('card-text');
    cardPrice.textContent = `Price: $${newProduct.price}`;

   
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('data-product-id', newProduct.id);


    productList.appendChild(productCard);
    productCard.appendChild(cardBody);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardPrice);
    cardBody.appendChild(deleteButton);

}

// Add click event listener to the product list to handle deletion
document.addEventListener('DOMContentLoaded', async () => {
   
    const productList = document.querySelector('#product-list');
    productList.addEventListener('click', async (event) => {
        if (event.target.classList.contains('btn-danger')) {
            const deleteButton = event.target;
            const productId = deleteButton.getAttribute('data-product-id');

            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE'
            });
        }
    });

});

// Add submit event listener to the form for product creation
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addProductForm');

    form.addEventListener('submit', async (event)=> {
        event.preventDefault();

        if (form.checkValidity()) {
            const formData = new FormData(form);
            const response = await fetch('/api/products', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                form.reset();
            }
        }
    });
});

// Update label and count for selected images when the input changes
document.addEventListener('DOMContentLoaded', () => {
    const thumbnailsInput = document.getElementById('thumbnailsInput');
    const thumbnailsInputLabel = document.getElementById('thumbnailsInputLabel');
    const selectedImageCount = document.getElementById('selectedImageCount');


    thumbnailsInput.addEventListener('change', () => {
        const count = thumbnailsInput.files.length;
        selectedImageCount.textContent = `${count} ${count === 1 ? 'image' : 'images'} selected`;
        thumbnailsInputLabel.textContent = count > 0 ? 'Change Image(s)' : 'Choose Image(s)';
    });
});
