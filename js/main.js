document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle icon
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // 3. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.section-header, .product-card, .promo-banner, .accessory-card, .feature-item, .cta-content, .insta-item');

    // Add initial reveal class
    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        revealElements.forEach(el => {
            const revealTop = el.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    };

    // Trigger once on load
    revealOnScroll();

    // Trigger on scroll
    window.addEventListener('scroll', revealOnScroll);

    // 4. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 5. Hero Premium Interaction (3D Tilt)
    const premiumDevice = document.querySelector('.premium-device');
    const heroBgGlow = document.querySelector('.hero-bg-glow');

    if (window.innerWidth > 1024) {
        window.addEventListener('mousemove', (e) => {
            const mouseX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
            const mouseY = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1

            if (premiumDevice) {
                // Apply subtle tilt based on mouse position
                // Base rotation is rotateY(-20deg) rotateX(10deg)
                const rotateY = -20 + (mouseX * 10);
                const rotateX = 10 + (mouseY * -10);
                premiumDevice.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
            }

            if (heroBgGlow) {
                heroBgGlow.style.transform = `translate(calc(-50% + ${mouseX * 40}px), calc(-50% + ${mouseY * 40}px))`;
            }
        });
    }

    // 6. Shopping Cart System
    const cartToggle = document.getElementById('cartToggle');
    const cartClose = document.getElementById('cartClose');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalText = document.getElementById('cartTotalText');
    const cartBadge = document.querySelector('.cart-badge');
    const whatsappCheckout = document.getElementById('whatsappCheckout');

    let cart = [];

    // Toggle Cart Drawer
    const toggleCart = () => {
        cartDrawer.classList.toggle('open');
        cartOverlay.classList.toggle('active');
        document.body.style.overflow = cartDrawer.classList.contains('open') ? 'hidden' : '';
    };

    if (cartToggle) cartToggle.addEventListener('click', toggleCart);
    if (cartClose) cartClose.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    // Add to Cart
    const addToCartBtns = document.querySelectorAll('.product-card .btn');

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = btn.closest('.product-card');
            const name = card.querySelector('.product-model').textContent;
            const priceText = card.querySelector('.product-price').textContent;
            const image = card.querySelector('.product-image').src;

            // Extract numeric price
            const price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;

            const product = {
                id: Date.now() + Math.random(),
                name,
                price,
                priceText,
                image
            };

            cart.push(product);
            updateCart();

            // Open cart to show progress
            if (!cartDrawer.classList.contains('open')) {
                toggleCart();
            }
        });
    });

    // Remove from Cart
    const removeFromCart = (id) => {
        cart = cart.filter(item => item.id !== id);
        updateCart();
    };

    // Update Cart UI
    const updateCart = () => {
        // Update Badge
        cartBadge.textContent = cart.length;
        cartBadge.classList.remove('bump');
        void cartBadge.offsetWidth;
        cartBadge.classList.add('bump');

        // Render Items
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="cart-empty-msg">Tu carrito está vacío</div>';
            cartTotalText.textContent = '$0';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" class="cart-item-img">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${item.priceText}</div>
                    </div>
                    <div class="cart-item-remove" onclick="window.removeCartItem(${item.id})">
                        <i class="fas fa-trash"></i>
                    </div>
                </div>
            `).join('');

            // Update Total
            const total = cart.reduce((sum, item) => sum + item.price, 0);
            cartTotalText.textContent = `$${total.toLocaleString()}`;
        }
    };

    // Global hook for removal
    window.removeCartItem = removeFromCart;

    // WhatsApp Checkout
    if (whatsappCheckout) {
        whatsappCheckout.addEventListener('click', () => {
            if (cart.length === 0) return;

            let message = "¡Hola Mega Cell PY! 👋 Me gustaría realizar un pedido:\n\n";
            cart.forEach((item, index) => {
                message += `${index + 1}. *${item.name}* - ${item.priceText}\n`;
            });

            const total = cart.reduce((sum, item) => sum + item.price, 0);
            message += `\n*Total Estimado: $${total.toLocaleString()}*\n\n¿Tienen stock disponible de estos equipos?`;

            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/595991882554?text=${encodedMessage}`, '_blank');
        });
    }
});
