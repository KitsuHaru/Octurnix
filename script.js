// Logic untuk Modal Order
const modal = document.getElementById('orderModal');

function openOrderModal() {
    modal.classList.add('active');
}

function closeOrderModal() {
    modal.classList.remove('active');
}

// Tutup modal jika klik di luar area putih (background gelap)
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeOrderModal();
    }
});

// Smooth Scrolling untuk Navbar agar perpindahan halus
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    });
});