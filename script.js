// Logic untuk Modal Order
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
// LOGIC PHOTOBOOTH BARU
// =========================================================

const video = document.getElementById('cameraStream');
const canvas = document.getElementById('photoCanvas');
const captureBtn = document.getElementById('captureBtn');
const photoboothContainer = document.querySelector('.photobooth-container');
const photoResult = document.getElementById('photoResult');
const finalPhoto = document.getElementById('finalPhoto');
const downloadLink = document.getElementById('downloadLink');
const loadingMessage = document.getElementById('loadingMessage');
const errorMessage = document.getElementById('errorMessage');
const frameImage = new Image();
frameImage.src = 'img/frame-maskot.png'; // Load frame maskot

let stream = null;

// Fungsi untuk memulai kamera
function startCamera() {
    loadingMessage.style.display = 'block';
    errorMessage.style.display = 'none';
    photoboothContainer.style.display = 'block';
    captureBtn.style.display = 'block';
    photoResult.style.display = 'none';

    // Mendapatkan akses ke kamera (preferensi: kamera depan/selfie)
    navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } // 'user' = kamera depan, 'environment' = kamera belakang
    })
    .then(function(s) {
        stream = s;
        video.srcObject = s;
        video.onloadedmetadata = function(e) {
            video.play();
            loadingMessage.style.display = 'none';
            // Atur ukuran canvas sesuai resolusi video (untuk HD)
            canvas.width = video.videoWidth || 1280; // Default HD
            canvas.height = video.videoHeight || 960; // Default HD
        };
    })
    .catch(function(err) {
        console.error("Gagal mengakses kamera: ", err);
        loadingMessage.style.display = 'none';
        errorMessage.style.display = 'block';
        photoboothContainer.style.display = 'none';
        captureBtn.style.display = 'none';
    });
}

// Fungsi untuk menghentikan kamera
function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
}

// Fungsi untuk mengambil foto dan menambahkan frame
function capturePhoto() {
    if (!stream) return;

    // 1. Gambar Video ke Canvas
    const context = canvas.getContext('2d');
    
    // Untuk menghilangkan mirror (transform: scaleX(-1)) di video, kita gambar terbalik di canvas
    context.save();
    context.scale(-1, 1);
    context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    context.restore();

    // 2. Gambar Frame Maskot di atasnya
    // Pastikan frameImage sudah terload sebelum digambar
    if (frameImage.complete) {
        context.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
    }

    // 3. Konversi Canvas ke PNG HD
    // Quality 1.0 (tinggi) untuk HD
    const dataUrl = canvas.toDataURL('image/png', 1.0); 

    // 4. Tampilkan Hasil
    stopCamera();
    photoboothContainer.style.display = 'none';
    captureBtn.style.display = 'none';

    finalPhoto.src = dataUrl;
    downloadLink.href = dataUrl;
    photoResult.style.display = 'block';
}

// Event listener untuk tombol "Ambil Foto"
captureBtn.addEventListener('click', capturePhoto);

// Otomatis memulai kamera saat Photobooth section terlihat (saat halaman dimuat)
window.addEventListener('load', startCamera);

// Optional: Hentikan kamera saat pengguna meninggalkan halaman
window.addEventListener('beforeunload', stopCamera);