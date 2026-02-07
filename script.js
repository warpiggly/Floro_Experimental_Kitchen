// ===== MOBILE MENU TOGGLE =====
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

// Cerrar menú al hacer click fuera
document.addEventListener('click', (e) => {
    if (navMenu && !e.target.closest('.navbar')) {
        navMenu.classList.remove('active');
        if (menuToggle) menuToggle.classList.remove('active');
    }
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar animaciones a elementos
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.menu-card, .menu-item, .order-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});

// ===== HEADER SCROLL EFFECT =====
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// ===== MENU FILTERS (para menu.html) =====
const filterBtns = document.querySelectorAll('.filter-btn');
const menuItems = document.querySelectorAll('.menu-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remover clase active de todos los botones
        filterBtns.forEach(b => b.classList.remove('active'));
        // Agregar clase active al botón clickeado
        btn.classList.add('active');
        
        const category = btn.dataset.category;
        
        menuItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'flex';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 100);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ===== SHOPPING CART FUNCTIONALITY =====
let cart = [];

// Función para actualizar el carrito
function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const submitBtn = document.getElementById('submit-btn');
    
    if (!cartItemsContainer) return;
    
    // Limpiar contenedor
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        if (submitBtn) submitBtn.disabled = true;
    } else {
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-qty">x${item.quantity}</span>
                <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="remove-item" onclick="removeFromCart(${index})">×</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        if (submitBtn) submitBtn.disabled = false;
    }
    
    // Calcular totales
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 5.00 : 0;
    const total = subtotal + shipping;
    
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

// Función para agregar al carrito
function addToCart(itemId, name, price) {
    const existingItem = cart.find(item => item.id === itemId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: itemId,
            name: name,
            price: parseFloat(price),
            quantity: 1
        });
    }
    
    updateCart();
    showNotification('Producto agregado al carrito');
}

// Función para remover del carrito
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
    
    // Actualizar displays de cantidad a 0
    document.querySelectorAll('.qty-display').forEach(display => {
        const itemId = display.dataset.item;
        const itemInCart = cart.find(item => item.id === itemId);
        display.textContent = itemInCart ? itemInCart.quantity : '0';
    });
}

// Función para mostrar notificaciones
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Event listeners para botones de cantidad
document.addEventListener('DOMContentLoaded', () => {
    // Botones Plus
    document.querySelectorAll('.qty-btn.plus').forEach(btn => {
        btn.addEventListener('click', () => {
            const itemId = btn.dataset.item;
            const itemName = btn.dataset.name;
            const itemPrice = btn.dataset.price;
            const display = document.querySelector(`.qty-display[data-item="${itemId}"]`);
            
            if (display) {
                let currentQty = parseInt(display.textContent);
                currentQty++;
                display.textContent = currentQty;
                
                addToCart(itemId, itemName, itemPrice);
            }
        });
    });
    
    // Botones Minus
    document.querySelectorAll('.qty-btn.minus').forEach(btn => {
        btn.addEventListener('click', () => {
            const itemId = btn.dataset.item;
            const display = document.querySelector(`.qty-display[data-item="${itemId}"]`);
            
            if (display) {
                let currentQty = parseInt(display.textContent);
                if (currentQty > 0) {
                    currentQty--;
                    display.textContent = currentQty;
                    
                    // Actualizar carrito
                    const cartItem = cart.find(item => item.id === itemId);
                    if (cartItem) {
                        cartItem.quantity--;
                        if (cartItem.quantity === 0) {
                            cart = cart.filter(item => item.id !== itemId);
                        }
                        updateCart();
                    }
                }
            }
        });
    });
    
    // Botones de "Agregar" rápido
    document.querySelectorAll('.add-cart, .quick-add').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.menu-card, .menu-item');
            const name = card.querySelector('h3').textContent;
            const priceText = card.querySelector('.price, .item-price').textContent;
            const price = parseFloat(priceText.replace('$', ''));
            const itemId = name.toLowerCase().replace(/\s+/g, '-');
            
            addToCart(itemId, name, price);
        });
    });
});

// ===== ORDER FORM SUBMISSION =====
const orderForm = document.getElementById('order-form');

if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (cart.length === 0) {
            alert('Por favor agrega productos a tu carrito');
            return;
        }
        
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            notes: document.getElementById('notes').value,
            payment: document.getElementById('payment').value,
            items: cart,
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 5.00
        };
        
        console.log('Pedido:', formData);
        
        // Generar número de orden
        const orderNumber = 'FLO-' + Date.now().toString().slice(-6);
        document.getElementById('order-number').textContent = orderNumber;
        
        // Mostrar modal de éxito
        const modal = document.getElementById('success-modal');
        modal.classList.add('active');
        
        // Limpiar formulario y carrito
        orderForm.reset();
        cart = [];
        updateCart();
        
        // Resetear todos los displays de cantidad
        document.querySelectorAll('.qty-display').forEach(display => {
            display.textContent = '0';
        });
    });
}

// Función para cerrar modal
function closeModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.remove('active');
        // Redirigir a la página de inicio
        window.location.href = 'index.html';
    }
}

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== ANIMATIONS CSS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== LAZY LOADING IMAGES =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== PARALLAX EFFECT (opcional) =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

console.log('Floro Cocina Experimental - Website cargado correctamente ✓');
