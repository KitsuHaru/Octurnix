/* PARTICLES */
tsParticles.load("particles", {
  background: { color: "transparent" },
  particles: {
    number: { value: 45 },
    color: { value: "#FF8F40" },
    opacity: { value: 0.12 },
    size: { value: { min: 1, max: 3 } },
    move: { enable: true, speed: 0.6 }
  }
});

/* GSAP ANIMATIONS */
gsap.registerPlugin(ScrollTrigger);

// Navbar Scroll Effect
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 40) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

// Hero Animations
gsap.from(".hero-tag", { opacity: 0, y: 30, duration: 1, ease: "power3.out" });
gsap.from(".hero h1", { opacity: 0, y: 50, duration: 1.2, delay: 0.2, ease: "power4.out" });
gsap.from(".hero p", { opacity: 0, y: 40, duration: 1, delay: 0.4, ease: "power3.out" });
gsap.from(".hero-buttons", { opacity: 0, y: 30, duration: 1, delay: 0.6, ease: "power3.out" });

// Section Reveals (Fixed Bug Blank)
gsap.utils.toArray(".section-title, .category-head, .story-image, .story-content, .store-card").forEach(el => {
    gsap.from(el, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: el,
            start: "top 85%"
        }
    });
});

gsap.utils.toArray(".menu-card").forEach(card => {
    gsap.from(card, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
            trigger: card,
            start: "top 90%"
        }
    });
});

window.addEventListener("load", () => {
    ScrollTrigger.refresh();
});

/* MAGNETIC BUTTONS */
document.querySelectorAll(".magnetic").forEach(btn => {
    btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.3 });
    });
    btn.addEventListener("mouseleave", () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.4 });
    });
});

/* CLEAN URL SCROLLING */
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offset = 100; 
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const offsetPosition = (elementRect - bodyRect) - offset;

        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        window.history.replaceState(null, null, ' '); // Keep URL clean
    }
}

/* -------------------------------------
   SHOPPING CART LOGIC (CRUD)
---------------------------------------- */
let cart = [];

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name: name, price: price, qty: 1 });
    }
    renderCart();
    document.getElementById("cartPanel").classList.add("active");
}

function increaseQty(name) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.qty += 1;
    }
    renderCart();
}

function decreaseQty(name) {
    const item = cart.find(item => item.name === name);
    if (!item) return;

    item.qty -= 1;
    if (item.qty <= 0) {
        cart = cart.filter(item => item.name !== name);
    }
    renderCart();
}

function removeItem(name) {
    cart = cart.filter(item => item.name !== name);
    renderCart();
}

function renderCart() {
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");
    const paymentTotal = document.getElementById("paymentTotal");

    cartItems.innerHTML = "";

    let total = 0;
    let totalQty = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = `<p style="color:#98a3b5; text-align:center; margin-top:40px;">Your cart is empty.</p>`;
    } else {
        cart.forEach(item => {
            const subtotal = item.price * item.qty;
            total += subtotal;
            totalQty += item.qty;

            cartItems.innerHTML += `
            <div class="cart-item">
                <div class="cart-top">
                    <div>
                        <h4>${item.name}</h4>
                        <p>Rp ${item.price.toLocaleString()}</p>
                    </div>
                    <button class="remove-item" onclick="removeItem('${item.name}')"><i class="fas fa-trash-alt"></i></button>
                </div>
                
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div class="qty-control">
                        <button onclick="decreaseQty('${item.name}')">−</button>
                        <span style="color:white; font-weight:600;">${item.qty}</span>
                        <button onclick="increaseQty('${item.name}')">+</button>
                    </div>
                    <div class="subtotal">Rp ${subtotal.toLocaleString()}</div>
                </div>
            </div>
            `;
        });
    }

    cartCount.innerText = totalQty;
    cartTotal.innerHTML = `<span>Total:</span> <span>Rp ${total.toLocaleString()}</span>`;
    paymentTotal.innerHTML = `<h3 style="margin-bottom:15px;">Total Payment: Rp ${total.toLocaleString()}</h3>`;
}

/* CART PANEL & PAYMENT MODAL */
function toggleCart() {
    document.getElementById("cartPanel").classList.toggle("active");
}

function openPayment() {
    if (cart.length < 1) {
        alert("Your cart is empty! Please add some midnight fuel first.");
        return;
    }
    document.getElementById("cartPanel").classList.remove("active");
    document.getElementById("paymentModal").classList.add("active");
}

function closePayment() {
    document.getElementById("paymentModal").classList.remove("active");
}

/* WHATSAPP INTEGRATION */
function sendWhatsAppOrder() {
    const customerName = document.getElementById("customerName").value;
    const customerNote = document.getElementById("customerNote").value;

    if (!customerName) {
        alert("Please enter your name for the order.");
        return;
    }

    let message = `Hello Octurn!X ☕\n\nI have completed the QRIS payment.\n\nName: ${customerName}\n\n*Order Details:*\n`;
    let total = 0;

    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        message += `• ${item.name} (x${item.qty}) - Rp ${subtotal.toLocaleString()}\n`;
    });

    message += `\n*Total: Rp ${total.toLocaleString()}*\n`;
    message += `Notes: ${customerNote || "-"}\n\nI will send the payment screenshot shortly.`;

    const phone = "6285770069187";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
}