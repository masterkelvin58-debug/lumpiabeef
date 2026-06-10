// 1. Data Produk
const products = [
  {
    id: 1,
    name: "Lumpia Beef Patty",
    price: 12000,
    desc: "Kulit lumpia super renyah, isian beef patty tebal, selada segar, irisan tomat, disiram saus & mayones spesial lumer.",
    img: "gambar_produk/lumpia beef patty.png",

  },
  {
    id: 2,
    name: "Lumpia Beef Patty + Telur",
    price: 15000,
    desc: "Ekstra protein! Ditambah telur ceplok gurih di atas beef patty hangat, sayuran segar, dan saus khas Isokuiki.",
    img: "gambar_produk/lumpia beef patty telur.png",
    
  },
  {
    id: 3,
    name: "Lumpia Beef Patty + Keju",
    price: 14000,
    desc: "Sensasi creamy maksimal! Tambahan slice keju meleleh menyelimuti beef patty, dipadu dengan sayur dan kulit krispi.",
    img: "gambar_produk/lumpia beef patty keju.png",
    
  },
  {
    id: 4,
    name: "Lumpia Smoked Beef",
    price: 8000,
    desc: "Aroma smokey khas! Irisan daging sapi asap pilihan, selada, tomat, disempurnakan olesan saus mayones nikmat.",
    img: "gambar_produk/lumpia smoked beef.png",
    
  }
];

let cart = [];

// Format mata uang IDR
const formatRp = (number) => {
  return "Rp " + number.toLocaleString('id-ID');
};

// 2. Render Produk ke Grid
function renderProducts() {
  const container = document.getElementById('produk-container');
  if (!container) return;

  container.innerHTML = products.map(product => {
    return `
      <div class="produk-card">
        <div class="produk-img-wrapper">
          <img 
            src="${product.img}" 
            alt="${product.name}" 
            onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
          />
          <span class="img-placeholder" style="display: none">${product.emojiFallback}</span>
        </div>
        <div class="produk-info">
          <h3>${product.name}</h3>
          <p>${product.desc}</p>
          <div class="produk-price">${formatRp(product.price)}</div>
          <button onclick="addToCart(${product.id})" class="btn-outline">
            + Tambah Keranjang
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// 3. Tambah ke Keranjang
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  showToast(`${product.name} ditambahkan!`);
  updateCartUI();
}

// 4. Ubah Kuantitas di Keranjang
function updateQuantity(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  updateCartUI();
}

// 5. Update Tampilan Keranjang
function updateCartUI() {
  const container = document.getElementById('cart-items-container');
  const summary = document.getElementById('cart-summary');
  const badge = document.getElementById('cart-badge');
  
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  let subtotal = 0;

  // Update Badge
  if(badge) badge.textContent = totalItemsCount;

  if (cart.length === 0) {
    container.innerHTML = `<div class="empty-cart-msg">Keranjang Anda masih kosong. Silakan pilih menu unggulan kami di atas!</div>`;
    summary.style.display = 'none';
    return;
  }

  // Render Item Keranjang
  container.innerHTML = cart.map(item => {
    const itemSubtotal = item.price * item.quantity;
    subtotal += itemSubtotal;
    return `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <div class="cart-item-price">${formatRp(item.price)}</div>
        </div>
        <div class="cart-controls">
          <button onclick="updateQuantity(${item.id}, -1)" class="cart-btn">-</button>
          <span style="font-weight: bold; width: 20px; text-align: center;">${item.quantity}</span>
          <button onclick="updateQuantity(${item.id}, 1)" class="cart-btn">+</button>
        </div>
      </div>
    `;
  }).join('');

  // Update Total
  summary.style.display = 'block';
  document.getElementById('summary-subtotal').textContent = formatRp(subtotal);
  document.getElementById('summary-total').textContent = formatRp(subtotal);
}

// 6. Tampilkan Notifikasi Toast
function showToast(message) {
  const toast = document.getElementById("toast");
  if(toast) {
    toast.textContent = message;
    toast.className = "show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
  }
}

// 7. Validasi & Proses Checkout ke WhatsApp
function prosesCheckout() {
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // SYARAT MUTLAK: Minimal 2 produk
  if (totalItemsCount < 2) {
    alert("⚠️ Mohon maaf, Anda wajib memesan MINIMAL 2 PRODUK untuk dapat diproses pengirimannya.");
    return;
  }

  const nama = document.getElementById('nama_pemesan').value.trim();
  const alamat = document.getElementById('alamat_pemesan').value.trim();

  if (!nama || !alamat) {
    alert("⚠️ Mohon lengkapi Nama Pemesan dan Alamat Pengiriman terlebih dahulu.");
    return;
  }

  let subtotal = 0;
  let orderText = `Halo Kak! Saya ingin memesan Lumpia Beef Isokuiki:\n\n*Rincian Pesanan:*\n`;
  
  cart.forEach(item => {
    const itemSubtotal = item.price * item.quantity;
    subtotal += itemSubtotal;
    orderText += `- ${item.quantity}x ${item.name} (${formatRp(itemSubtotal)})\n`;
  });

  orderText += `\n*Total Tagihan:* ${formatRp(subtotal)}\n*(Belum termasuk ongkos kirim)*\n\n`;
  orderText += `*Data Pengiriman:*\nNama: ${nama}\nAlamat/Meja: ${alamat}\n\nMohon segera diproses ya Kak, terima kasih!`;

  // Redirect ke WhatsApp
  const noWA = "6283171323585"; // Ganti jika perlu
  const waURL = `https://wa.me/${noWA}?text=${encodeURIComponent(orderText)}`;
  
  window.open(waURL, '_blank');
}

// Initialize On Load
window.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartUI();
});