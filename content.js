const SELECTED_CLASS = 'wavas-selected';
const HOVER_CLASS = 'wavas-hover';
const CHECKMARK_URL = chrome.runtime.getURL('checkmark.svg');

function createCheckmark() {
  const el = document.createElement('img');
  el.src = CHECKMARK_URL;
  el.className = 'wavas-checkmark';
  el.style.position = 'absolute';
  el.style.top = '4px';
  el.style.right = '4px';
  el.style.width = '24px';
  el.style.height = '24px';
  el.style.zIndex = '999999';
  el.style.pointerEvents = 'none';
  return el;
}

function highlightImage(img) {
  img.classList.add(HOVER_CLASS);
  img.style.outline = '2px solid #00ff00';
}
function unhighlightImage(img) {
  img.classList.remove(HOVER_CLASS);
  img.style.outline = '';
}
function selectImage(img) {
  img.classList.add(SELECTED_CLASS);
  if (!img._wavasCheckmark) {
    const mark = createCheckmark();
    img.parentElement.style.position = 'relative';
    img.parentElement.appendChild(mark);
    img._wavasCheckmark = mark;
  }
}
function deselectImage(img) {
  img.classList.remove(SELECTED_CLASS);
  if (img._wavasCheckmark) {
    img._wavasCheckmark.remove();
    img._wavasCheckmark = null;
  }
}
function isSelected(img) {
  return img.classList.contains(SELECTED_CLASS);
}

function getAllImages() {
  return Array.from(document.querySelectorAll('img')).filter(img => img.src);
}

function injectStyles() {
  if (document.getElementById('wavas-style')) return;
  const style = document.createElement('style');
  style.id = 'wavas-style';
  style.textContent = `
    .wavas-hover { outline: 2px solid #00ff00 !important; }
    .wavas-selected { outline: 2px solid #0080ff !important; }
    .wavas-checkmark { pointer-events: none; }
    #wavas-download-btn {
      position: fixed;
      bottom: 32px;
      right: 32px;
      z-index: 2147483647;
      background: #0080ff;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 12px 24px;
      font-size: 18px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      cursor: pointer;
      opacity: 0.95;
    }
    #wavas-download-btn[disabled] { opacity: 0.5; cursor: not-allowed; }
  `;
  document.head.appendChild(style);
}

function createDownloadButton() {
  let btn = document.getElementById('wavas-download-btn');
  if (btn) return btn;
  btn = document.createElement('button');
  btn.id = 'wavas-download-btn';
  btn.textContent = 'Download Selected';
  btn.onclick = () => {
    const selected = getAllImages().filter(isSelected);
    if (!selected.length) return;
    btn.disabled = true;
    const images = selected.map((img, i) => ({ url: img.src, index: i+1 }));
    const domain = location.hostname.replace(/^www\./, '');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    chrome.runtime.sendMessage({
      type: 'downloadImages',
      images,
      naming: 'original-{index}',
      domain,
      timestamp
    }, (resp) => {
      btn.disabled = false;
    });
  };
  document.body.appendChild(btn);
  return btn;
}

function setup() {
  injectStyles();
  const images = getAllImages();
  images.forEach(img => {
    img.addEventListener('mouseenter', () => highlightImage(img));
    img.addEventListener('mouseleave', () => unhighlightImage(img));
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isSelected(img)) {
        deselectImage(img);
      } else {
        selectImage(img);
      }
    });
  });
  createDownloadButton();
}

function observeNewImages() {
  const observer = new MutationObserver(() => {
    getAllImages().forEach(img => {
      if (!img._wavasBound) {
        img._wavasBound = true;
        img.addEventListener('mouseenter', () => highlightImage(img));
        img.addEventListener('mouseleave', () => unhighlightImage(img));
        img.addEventListener('click', (e) => {
          e.stopPropagation();
          if (isSelected(img)) {
            deselectImage(img);
          } else {
            selectImage(img);
          }
        });
      }
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

setup();
observeNewImages();
