// STATE — Uygulamanın tüm verisi burada

// localStorage'dan yükle, yoksa boş başla
let objects = JSON.parse(localStorage.getItem('seesaw-objects')) || []

// State'i localStorage'a kaydet
function saveState() {
  localStorage.setItem('seesaw-objects', JSON.stringify(objects))
}