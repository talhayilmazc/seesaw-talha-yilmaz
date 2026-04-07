// STATE — Uygulamanın tüm verisi burada

// localStorage'dan yükle, yoksa boş başla
let objects = JSON.parse(localStorage.getItem('seesaw-objects')) || []

// State'i localStorage'a kaydet
function saveState() {
  localStorage.setItem('seesaw-objects', JSON.stringify(objects))
}


// FİZİK — Tork hesaplama

const PLANK_WIDTH = 400  // tahtanın piksel genişliği
const PIVOT_PX    = 200  // pivot tahtanın tam ortasında

function calculateAngle() {
  let leftTorque  = 0
  let rightTorque = 0

  objects.forEach(obj => {
    // obj.position: 0 (sol uç) → 400 (sağ uç)
    // mesafe: pivot'tan kaç piksel uzakta
    const distance = Math.abs(obj.position - PIVOT_PX)

    if (obj.position < PIVOT_PX) {
      // Sol taraf
      leftTorque += obj.weight * distance
    } else {
      // Sağ taraf
      rightTorque += obj.weight * distance
    }
  })

  // Açı hesapla, ±30 ile sınırla
  const angle = Math.max(-30, Math.min(30,
    (rightTorque - leftTorque) / 10
  ))

  return { angle, leftTorque, rightTorque }
}


// RENDER — Ekrana çiz

const plank      = document.getElementById('plank')
const leftInfo   = document.getElementById('left-weight')
const rightInfo  = document.getElementById('right-weight')

// Renk paleti — her nesne farklı renkte olsun
const COLORS = [
  '#e94560', '#4ecdc4', '#f7dc6f',
  '#a29bfe', '#fd79a8', '#6c5ce7',
  '#00b894', '#fdcb6e', '#e17055'
]

function render() {
  // 1. Açıyı hesapla
  const { angle, leftTorque, rightTorque } = calculateAngle()

  // 2. Tahtayı döndür
  plank.style.transform = `translateX(-50%) rotate(${angle}deg)`

  // 3. Eski nesneleri temizle
  plank.querySelectorAll('.object').forEach(el => el.remove())

  // 4. Sol/sağ ağırlıkları göster
  const leftKg  = objects
    .filter(o => o.position < PIVOT_PX)
    .reduce((sum, o) => sum + o.weight, 0)

  const rightKg = objects
    .filter(o => o.position >= PIVOT_PX)
    .reduce((sum, o) => sum + o.weight, 0)

  leftInfo.textContent  = `Left: ${leftKg} kg`
  rightInfo.textContent = `Right: ${rightKg} kg`

  // 5. Her nesneyi çiz
  objects.forEach((obj, index) => {
    const el = document.createElement('div')
    el.className = 'object'

    // Boyutu ağırlığa göre ayarla (min 24px, max 48px)
    const size = 24 + obj.weight * 2.4
    el.style.width  = size + 'px'
    el.style.height = size + 'px'
    el.style.fontSize = Math.max(10, size / 3.5) + 'px'

    // Renk — index'e göre döngüsel
    el.style.background = COLORS[index % COLORS.length]

    // Pozisyon — tahtanın solundan kaç piksel
    el.style.left = obj.position + 'px'

    // Ağırlığı göster
    el.textContent = obj.weight + 'kg'

    plank.appendChild(el)
  })
}