// --- DOM ELEMENTS & KONSTANTA ---
const modal = document.getElementById('orderModal');
const video = document.getElementById('cameraStream');
const canvas = document.getElementById('photoCanvas');
const captureBtn = document.getElementById('captureBtn');
const photoboothContainer = document.querySelector('.photobooth-container');
const photoResult = document.getElementById('photoResult');
const finalPhoto = document.getElementById('finalPhoto');
const downloadLink = document.getElementById('downloadLink');
const loadingMessage = document.getElementById('loadingMessage');
const errorMessage = document.getElementById('errorMessage');

// REVISI FINAL: Target resolusi final 16:10 (1920x1200)
const TARGET_WIDTH = 1920; 
const TARGET_HEIGHT = 1200; 

const frameImage = new Image();
frameImage.src = 'img/frame-maskot.png'; 

let stream = null;
let frameLoaded = false;

// --- FUNGSI MODAL & SCROLL ---

function openOrderModal() { modal.classList.add('active'); }
function closeOrderModal() { modal.classList.remove('active'); }
modal.addEventListener('click', function(e) { if (e.target === modal) { closeOrderModal(); } });
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
    });
});


// --- LOGIC PHOTOBOOTH UTAMA ---

// PENTING: Pastikan frame sudah dimuat
frameImage.onload = () => {
    frameLoaded = true;
    // Panggil startCamera setelah frame siap
    startCamera(); 
};
frameImage.onerror = () => {
    console.error("Gagal memuat frame-maskot.png. Memulai tanpa frame.");
    frameLoaded = true;
    startCamera();
}

// Fungsi untuk memulai kamera
function startCamera() {
    if (!frameLoaded) {
        loadingMessage.style.display = 'block';
        return; 
    }
    
    errorMessage.style.display = 'none';
    photoboothContainer.style.display = 'block';
    captureBtn.style.display = 'block';
    photoResult.style.display = 'none';
    
    // Minta rasio 16:10
    navigator.mediaDevices.getUserMedia({ 
        video: { 
            facingMode: "user", 
            aspectRatio: { ideal: TARGET_WIDTH / TARGET_HEIGHT }
        }
    })
    .then(function(s) {
        stream = s;
        video.srcObject = s;
        video.onloadedmetadata = function(e) {
            video.play();
            loadingMessage.style.display = 'none';
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
    if (!stream || !frameLoaded) return;

    const context = canvas.getContext('2d');
    
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    const targetRatio = TARGET_WIDTH / TARGET_HEIGHT;
    const videoRatio = videoWidth / videoHeight;

    let drawWidth, drawHeight, xOffset = 0, yOffset = 0;

    // Perhitungan Cropping (object-fit: cover logic)
    if (videoRatio > targetRatio) {
        // Video lebih lebar, paskan tinggi (fill height)
        drawHeight = TARGET_HEIGHT;
        drawWidth = drawHeight * videoRatio;
        xOffset = (TARGET_WIDTH - drawWidth) / 2;
    } else {
        // Video lebih tinggi, paskan lebar (fill width)
        drawWidth = TARGET_WIDTH;
        drawHeight = drawWidth / videoRatio;
        yOffset = (TARGET_HEIGHT - drawHeight) / 2;
    }

    // Gambar background (putih) sebelum drawing
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);

    // 1. Gambar Video ke Canvas (Mirroring dan Drawing)
    context.save();
    context.scale(-1, 1);
    
    // Gambar video, pastikan mengisi penuh area (cover)
    context.drawImage(video, (-drawWidth - xOffset), yOffset, drawWidth, drawHeight);

    context.restore(); // Kembali ke konteks normal

    // 2. Gambar Frame Maskot di atasnya
    if (frameLoaded) {
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

// Panggil startCamera (logic frameImage.onload sudah menangani kapan harus mulai)
window.addEventListener('load', () => {
    if (!frameLoaded) {
        startCamera();
    }
});

window.addEventListener('beforeunload', stopCamera);