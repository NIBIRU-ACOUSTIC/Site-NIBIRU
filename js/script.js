// script.js para o site NIBIRU Sound System
//
// Este arquivo contém comportamentos simples para melhorar a
// experiência do usuário no site. Entre as funcionalidades estão:
//   - Alternar a visibilidade do menu (hambúrguer) em telas pequenas.
//   - Destacar o link de navegação correspondente à página atual.
//   - Atualizar automaticamente o ano no rodapé.
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelector('.nav-links');
  const ham = document.querySelector('.hamburger');

  if (ham && navLinks) {
    // Alterna a classe 'show' quando o ícone de menu é clicado.
    ham.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }

  // Highlight the active navigation link based on current file name
  if (navLinks) {
    const links = navLinks.querySelectorAll('a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
      }
    });
  }

  // Define o ano atual no rodapé
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

/* ==========================================
   GALERIA — gera imagens automaticamente
   Pastas:
   - images/caixas/caixa1.png ... caixa13.png
   - images/eventos/evento1.png ... evento10.png
   - images/mesas/mesa1.png ... mesa4.png
   - images/potencias/potencia1.png ... potencia5.png

   A galeria é embaralhada (aleatória) a cada reload.
========================================== */

function buildImageList(folder, prefix, start, end, ext = "png") {
  const list = [];
  for (let i = start; i <= end; i++) {
    list.push({
      src: `images/${folder}/${prefix}${i}.${ext}`,
      alt: `${prefix}${i}`
    });
  }
  return list;
}

function shuffleArray(arr) {
  // Fisher-Yates (embaralhamento real)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function renderGallery(images, gridId = "galleryGrid") {
  const grid = document.getElementById(gridId);
  if (!grid) return; // se não estiver na página galeria, sai

  grid.innerHTML = "";

  images.forEach(({ src, alt }) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.loading = "lazy";
    img.decoding = "async";
    grid.appendChild(img);
  });
}

/* ✅ Suas quantidades */
const caixas = buildImageList("caixas", "caixa", 1, 13);
const eventos = buildImageList("eventos", "evento", 1, 10);
const mesas = buildImageList("mesas", "mesa", 1, 4);
const potencias = buildImageList("potencias", "potencia", 1, 5);

// Junta tudo, embaralha e renderiza
const allImages = shuffleArray([...caixas, ...eventos, ...mesas, ...potencias]);
renderGallery(allImages);

/* ==========================================
   VIEWER FULLSCREEN — abre imagens da galeria
   Funciona com imagens adicionadas via JS também.
========================================== */
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("galleryGrid");
  const viewer = document.getElementById("viewer");
  const viewerImg = document.getElementById("viewerImg");
  const closeBtn = document.getElementById("viewerClose");

  // Se não estiver na galeria, sai (não quebra outras páginas)
  if (!grid || !viewer || !viewerImg || !closeBtn) return;

  function openViewer(src, alt) {
    viewerImg.src = src;
    viewerImg.alt = alt || "Imagem";
    viewer.classList.add("show");
    viewer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeViewer() {
    viewer.classList.remove("show");
    viewer.setAttribute("aria-hidden", "true");
    viewerImg.src = "";
    document.body.style.overflow = "";
  }

  // Clique em qualquer imagem dentro da grid (delegação)
  grid.addEventListener("click", (e) => {
    const img = e.target.closest('#galleryGrid img');
    if (!img) return;
    openViewer(img.src, img.alt);
  });

  closeBtn.addEventListener("click", closeViewer);

  // Fecha clicando fora da imagem
  viewer.addEventListener("click", (e) => {
    if (e.target === viewer) closeViewer();
  });

  // Fecha com ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && viewer.classList.contains("show")) closeViewer();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const imgs = document.querySelectorAll("img.home-thumb");

  imgs.forEach((img) => {
    img.addEventListener("error", () => {
      let src = img.getAttribute("src") || "";

      // 1) Se faltou a pasta /caixas/
      if (src.startsWith("images/") && !src.includes("/caixas/") && src.includes("caixa")) {
        src = src.replace("images/", "images/caixas/");
      }

      // 2) Se estiver .jpg/.jpeg, tenta .png
      if (src.match(/\.(jpg|jpeg)$/i)) {
        src = src.replace(/\.(jpg|jpeg)$/i, ".png");
      }

      // 3) Tenta recarregar com o src corrigido
      img.src = src;
    });

    // Força “ignorar dimensões”
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
  });
});

