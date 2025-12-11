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

// Target resolusi final: Landscape HD 16:9 (1920x1080)
const TARGET_WIDTH = 1920; 
const TARGET_HEIGHT = 1080;
frameImage.src = 'img/frame-maskot.png'; 

let stream = null;

// Fungsi untuk memulai kamera
function startCamera() {
    loadingMessage.style.display = 'block';
    errorMessage.style.display = 'none';
    photoboothContainer.style.display = 'block';
    captureBtn.style.display = 'block';
    photoResult.style.display = 'none';
    
    // Minta resolusi 16:9 atau setinggi mungkin
    navigator.mediaDevices.getUserMedia({ 
        video: { 
            facingMode: "user", 
            aspectRatio: { ideal: 16/9 }
        }
    })
    .then(function(s) {
        stream = s;
        video.srcObject = s;
        video.onloadedmetadata = function(e) {
            video.play();
            loadingMessage.style.display = 'none';
            
            // Set canvas ke resolusi 16:9 HD yang konsisten
            canvas.width = TARGET_WIDTH; 
            canvas.height = TARGET_HEIGHT;
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

    const context = canvas.getContext('2d');
    
    // Dimensi Video dari perangkat
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    const targetRatio = TARGET_WIDTH / TARGET_HEIGHT;
    const videoRatio = videoWidth / videoHeight;

    let drawWidth, drawHeight, xOffset = 0, yOffset = 0;

    // Perhitungan Cropping (object-fit: cover logic)
    if (videoRatio > targetRatio) {
        // Video lebih lebar dari target, paskan tinggi, potong sisi kiri/kanan
        drawHeight = TARGET_HEIGHT;
        drawWidth = drawHeight * videoRatio;
        xOffset = (TARGET_WIDTH - drawWidth) / 2; // Hitung geseran X
    } else {
        // Video lebih tinggi dari target, paskan lebar, potong atas/bawah
        drawWidth = TARGET_WIDTH;
        drawHeight = drawWidth / videoRatio;
        yOffset = (TARGET_HEIGHT - drawHeight) / 2; // Hitung geseran Y
    }

    // 1. Gambar Video ke Canvas (Mirroring dan Drawing)
    context.save();
    
    // Terapkan mirror
    context.scale(-1, 1);
    
    // Gambar video. Karena sudah di-mirror, posisi X harus negatif dan digeser kembali.
    // X Drawing: (-drawWidth) + xOffset (untuk center)
    // Y Drawing: yOffset
    context.drawImage(video, (-drawWidth - xOffset), yOffset, drawWidth, drawHeight);

    context.restore(); // Kembali ke konteks normal

    // 2. Gambar Frame Maskot di atasnya
    if (frameImage.complete) {
        // Gambar frame agar menutupi seluruh canvas 16:9 (tidak perlu di-mirror)
        context.drawImage(frameImage, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);
    }

    // 3. Konversi Canvas ke PNG HD
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