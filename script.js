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

    // 1. Gambar Video ke Canvas
    const context = canvas.getContext('2d');
    
    // Dimensi Video dari perangkat
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    const videoRatio = videoWidth / videoHeight;
    const targetRatio = TARGET_WIDTH / TARGET_HEIGHT;

    let drawWidth, drawHeight, x = 0, y = 0;

    // REVISI: Hitung cara menggambar video agar memenuhi target 16:9 (Crop-to-fill, seperti object-fit: cover)
    if (videoRatio > targetRatio) {
        // Video lebih lebar dari target (16:9), paskan tinggi
        drawHeight = TARGET_HEIGHT;
        drawWidth = drawHeight * videoRatio;
        x = (TARGET_WIDTH - drawWidth) / 2; // Geser horizontal ke tengah (memotong sisi)
    } else {
        // Video lebih tinggi dari target (16:9), paskan lebar
        drawWidth = TARGET_WIDTH;
        drawHeight = drawWidth / videoRatio;
        y = (TARGET_HEIGHT - drawHeight) / 2; // Geser vertikal ke tengah (memotong atas/bawah)
    }

    // Gambar background (hitam)
    context.fillStyle = '#000000';
    context.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);

    // Gambar Video: Menggunakan logika mirror
    context.save();
    context.scale(-1, 1);
    // Draw video ke canvas, memastikan ia mengisi penuh area 16:9 (drawWidth dan drawHeight sudah dihitung untuk mengisi penuh)
    context.drawImage(video, -drawWidth - x, y, drawWidth, drawHeight);
    context.restore();

    // 2. Gambar Frame Maskot di atasnya
    if (frameImage.complete) {
        // Gambar frame agar menutupi seluruh canvas 16:9
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