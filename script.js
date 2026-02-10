// 1. Logic untuk Modal Order
const modal = document.getElementById('orderModal');

function openOrderModal() {
    modal.classList.add('active');
}

function closeOrderModal() {
    modal.classList.remove('active');
}

// Tutup modal jika klik di luar area putih
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeOrderModal();
    }
});

// 2. Fungsi Scroll ke Section & Bersihkan URL (Trik Utama)
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        // Offset 80px supaya tidak tertutup navbar yang fixed
        const offset = 80; 
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        // Menghapus jejak hash (#menu, dll) di address bar agar URL tetap bersih
        window.history.replaceState(null, null, ' ');
    }
}

// 3. Fungsi Kirim WA (Link Tidak Muncul di Pojok Browser)
function kirimWA() {
    const phone = "6285770069187";
    const text = "Halo Octurnix, saya mau pesan menu dari website, apakah masih tersedia?";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    
    // Buka WhatsApp di tab baru
    window.open(url, '_blank');
}