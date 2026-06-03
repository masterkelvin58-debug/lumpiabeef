document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Hamburger Menu Logic
  const menuToggle = document.getElementById('mobile-menu');
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('#navbar a');

  menuToggle.addEventListener('click', () => {
    navbar.classList.toggle('active');
    menuToggle.classList.toggle('open');
  });

  // Tutup menu saat link diklik (Mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('active');
      menuToggle.classList.remove('open');
    });
  });

  // 2. Sticky Header & Scroll Spy
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Sticky Header Shadow
    if (window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    // Scroll Spy (Highlight menu aktif)
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (scrollY >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active-link');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active-link');
      }
    });
  });

  // 3. Scroll Reveal Animation
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  revealElements.forEach(el => revealObserver.observe(el));

  // 4. Form Pemesanan WhatsApp Logic
  const formPesanan = document.getElementById('form-pesan-wa');
  
  formPesanan.addEventListener('submit', (e) => {
    e.preventDefault(); // Mencegah reload halaman
    
    // Ambil data form
    const nama = document.getElementById('nama').value;
    const menu = document.getElementById('menu').value;
    const jumlah = document.getElementById('jumlah').value;
    const alamat = document.getElementById('alamat').value;
    const catatan = document.getElementById('catatan').value;
    
    // Nomor WA Toko
    const noWA = "6283171323585";
    
    // Rangkai Teks Pesan
    let pesan = `Halo Isokuiki, saya mau pesan lumpia nih! 🌯\n\n`;
    pesan += `*Nama:* ${nama}\n`;
    pesan += `*Pesanan:* ${menu}\n`;
    pesan += `*Jumlah:* ${jumlah} Porsi\n`;
    pesan += `*Alamat:* ${alamat}\n`;
    
    if(catatan) {
      pesan += `*Catatan:* ${catatan}\n`;
    }
    
    pesan += `\nMohon diinfokan total biaya dan ongkirnya ya. Terima kasih!`;
    
    // Buka link WhatsApp
    const waLink = `https://wa.me/${noWA}?text=${encodeURIComponent(pesan)}`;
    window.open(waLink, '_blank');
  });
});

// Fungsi tambahan: Autoselect menu dari tombol "Pesan Ini"
function pilihMenu(namaMenu) {
  const selectMenu = document.getElementById('menu');
  selectMenu.value = namaMenu;
}
