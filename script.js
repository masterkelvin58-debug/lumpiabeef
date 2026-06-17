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
    name: "Beef Patty + Telur",
    price: 15000,
    desc: "Ekstra protein! Ditambah telur ceplok gurih di atas beef patty hangat, sayuran segar, dan saus khas Isokuiki.",
    img: "gambar_produk/lumpia beef patty telur.png",
  },
  {
    id: 3,
    name: "Beef Patty + Keju",
    price: 14000,
    desc: "Sensasi creamy maksimal! Tambahan slice keju meleleh menyelimuti beef patty, dipadu dengan sayur dan kulit krispi.",
    img: "gambar_produk/lumpia beef patty keju.png",
  },
  {
    id: 4,
    name: "Smoked Beef",
    price: 8000,
    desc: "Aroma smokey khas! Irisan daging sapi asap pilihan, selada, tomat, disempurnakan olesan saus mayones nikmat.",
    img: "gambar_produk/lumpia smoked beef.png",  }
];

let cart = [];

const formatRp = (number) => {
  return "Rp " + number.toLocaleString('id-ID');
};

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
          
          <select id="topping-${product.id}" class="form-control" style="margin-bottom: 15px; font-size: 0.85rem; padding: 0.5rem; border-color: var(--color-secondary);">
            <option value="0|">Tanpa Topping Ekstra</option>
            <option value="4000|Smoked Beef">Ekstra Smoked Beef (+Rp 4.000)</option>
            <option value="3000|Telur">Ekstra Telur (+Rp 3.000)</option>
            <option value="3000|Keju">Ekstra Keju (+Rp 3.000)</option>
          </select>

          <button onclick="addToCart(${product.id})" class="btn-outline">
            + Tambah Keranjang
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const toppingSelect = document.getElementById(`topping-${id}`);
  let toppingPrice = 0;
  let toppingName = "";
  
  if (toppingSelect) {
    const parts = toppingSelect.value.split('|');
    toppingPrice = parseInt(parts[0]);
    toppingName = parts[1];
  }

  const finalPrice = product.price + toppingPrice;
  const cartItemId = toppingName ? `${id}-${toppingName}` : `${id}-none`;
  const finalName = toppingName ? `${product.name} (+ Ekstra ${toppingName})` : product.name;

  const existingItem = cart.find(item => item.cartItemId === cartItemId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ 
      ...product, 
      cartItemId: cartItemId,
      finalName: finalName,
      finalPrice: finalPrice,
      quantity: 1 
    });
  }

  showToast(`${finalName} ditambahkan!`);
  updateCartUI();
  
  if (toppingSelect) toppingSelect.value = "0|";
}

function updateQuantity(cartItemId, delta) {
  const item = cart.find(i => i.cartItemId === cartItemId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.cartItemId !== cartItemId);
  }
  updateCartUI();
}

function updateCartUI() {
  const container = document.getElementById('cart-items-container');
  const summary = document.getElementById('cart-summary');
  const badge = document.getElementById('cart-badge');
  
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  let subtotal = 0;

  if(badge) badge.textContent = totalItemsCount;

  if (cart.length === 0) {
    container.innerHTML = `<div class="empty-cart-msg">Keranjang Anda masih kosong. Silakan pilih menu di samping!</div>`;
    summary.style.display = 'none';
    return;
  }

  container.innerHTML = cart.map(item => {
    const itemSubtotal = item.finalPrice * item.quantity;
    subtotal += itemSubtotal;
    return `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.finalName}</h4>
          <div class="cart-item-price">${formatRp(item.finalPrice)}</div>
        </div>
        <div class="cart-controls">
          <button onclick="updateQuantity('${item.cartItemId}', -1)" class="cart-btn">-</button>
          <span style="font-weight: bold; width: 20px; text-align: center;">${item.quantity}</span>
          <button onclick="updateQuantity('${item.cartItemId}', 1)" class="cart-btn">+</button>
        </div>
      </div>
    `;
  }).join('');

  summary.style.display = 'block';
  document.getElementById('summary-subtotal').textContent = formatRp(subtotal);
  document.getElementById('summary-total').textContent = formatRp(subtotal);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if(toast) {
    toast.textContent = message;
    toast.className = "show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
  }
}

function prosesCheckout() {
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
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
    const itemSubtotal = item.finalPrice * item.quantity;
    subtotal += itemSubtotal;
    orderText += `- ${item.quantity}x ${item.finalName} (${formatRp(itemSubtotal)})\n`;
  });

  orderText += `\n*Total Tagihan:* ${formatRp(subtotal)}\n*(Belum termasuk ongkos kirim)*\n\n`;
  orderText += `*Data Pengiriman:*\nNama: ${nama}\nAlamat/Meja: ${alamat}\n\nMohon segera diproses ya Kak, terima kasih!`;

  const noWA = "6283171323585"; 
  const waURL = `https://wa.me/${noWA}?text=${encodeURIComponent(orderText)}`;
  
  window.open(waURL, '_blank');
}

const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollTopBtn.classList.add('show');
  } else {
    scrollTopBtn.classList.remove('show');
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

const formKontak = document.getElementById('form-kontak');
const inputNama = document.getElementById('kontak_nama');
const inputEmail = document.getElementById('kontak_email');
const inputPesan = document.getElementById('kontak_pesan');

const errorNama = document.getElementById('error_nama');
const errorEmail = document.getElementById('error_email');
const errorPesan = document.getElementById('error_pesan');
const successMsg = document.getElementById('kontak_success');

if(inputNama) inputNama.addEventListener('input', () => errorNama.style.display = 'none');
if(inputEmail) inputEmail.addEventListener('input', () => errorEmail.style.display = 'none');
if(inputPesan) inputPesan.addEventListener('input', () => errorPesan.style.display = 'none');

if(formKontak) {
  formKontak.addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    let isValid = true;
    successMsg.style.display = 'none';

    if (inputNama.value.trim() === '') {
      errorNama.style.display = 'block';
      isValid = false;
    }

    const emailVal = inputEmail.value.trim();
    if (emailVal === '' || !emailVal.includes('@') || !emailVal.includes('.')) {
      errorEmail.style.display = 'block';
      isValid = false;
    }

    if (inputPesan.value.trim() === '') {
      errorPesan.style.display = 'block';
      isValid = false;
    }

    if (isValid) {
      successMsg.style.display = 'block';
      formKontak.reset();
      setTimeout(() => {
        successMsg.style.display = 'none';
      }, 5000);
    }
  });
}

const hamburgerBtn = document.getElementById('hamburger-btn');
const navbar = document.getElementById('navbar');
const navLinks = navbar.querySelectorAll('a');

if (hamburgerBtn && navbar) {
  hamburgerBtn.addEventListener('click', () => {
    hamburgerBtn.classList.toggle('active');
    navbar.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburgerBtn.classList.remove('active');
      navbar.classList.remove('active');
    });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartUI();
});
