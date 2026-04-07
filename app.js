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