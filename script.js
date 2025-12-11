// --- FUNGSI MODAL & SCROLL ---

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

// Smooth Scrolling untuk Navbar
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

// =========================================================
// LOGIC COUNTDOWN TIMER (BARU)
// =========================================================

const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

// Tentukan tanggal peluncuran: Kamis, 15 Januari 2026, jam 16:00 PM WIB
const launchDate = new Date("Jan 15, 2026 16:00:00").getTime();

function startCountdown() {
    // Dapatkan tanggal dan waktu hari ini
    const now = new Date().getTime();

    // Hitung selisih waktu
    const distance = launchDate - now;

    // Perhitungan waktu
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Tampilkan hasil di elemen HTML
    // Gunakan .toString().padStart(2, '0') agar format selalu "00"
    daysEl.textContent = days.toString().padStart(2, '0');
    hoursEl.textContent = hours.toString().padStart(2, '0');
    minutesEl.textContent = minutes.toString().padStart(2, '0');
    secondsEl.textContent = seconds.toString().padStart(2, '0');

    // Jika hitungan mundur selesai
    if (distance < 0) {
        clearInterval(countdownInterval);
        daysEl.textContent = hoursEl.textContent = minutesEl.textContent = secondsEl.textContent = "00";
        // Ubah judul dan teks promo
        document.querySelector('.section-title').innerHTML = "<span>AMERICANO CRANBERRY</span> is <span style='color: var(--fox-dark);'>HERE!</span>";
        document.querySelector('.countdown-desc').textContent = "Menu baru telah diluncurkan! Segera pesan melalui tombol Order Now di atas!";
        
        const ctaBtn = document.querySelector('.countdown-cta');
        ctaBtn.textContent = "Pesan Sekarang!";
        ctaBtn.href = "#"; 
        ctaBtn.removeEventListener('click', null); // Hapus listener lama
        ctaBtn.addEventListener('click', openOrderModal); // Tambahkan event listener baru untuk modal
    }
}

// Jalankan fungsi setiap 1 detik
const countdownInterval = setInterval(startCountdown, 1000);

// Panggil sekali saat dimuat untuk menghindari delay 1 detik
window.addEventListener('load', startCountdown);