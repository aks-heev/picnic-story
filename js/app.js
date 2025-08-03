// /js/app.js — Unified Picnic Story Boho Menu Script

const menuData = {
  foodList: [
    "Plain Omelette","Cheese Burst Omelette","Chicken Omelette","Bread Omelette",
    "Egg Bhurji with Toast","Aloo Paratha","Aloo Pyaz Paratha","Gobi Paratha",
    "Paneer Paratha","Egg Paratha","Chicken Paratha","Garden Fresh Sandwich",
    "Cheese Corn Sandwich","Paneer Tikka Sandwich","Chicken Tikka Sandwich",
    "Plain Maggi","Veg Maggi","Egg & Cheese Maggi","Cheese Maggi","Chicken Maggi",
    "Salted Fries","Peri Peri Fries","Mix Fries","Paneer Pakoda","Bun Maska",
    "Masala Bun","Malai Bun","Anda Bun","Aloo Bun","Keema Bun","Cheesy Crazy",
    "Chicken Chakna","Peanut Masala","Crispy Corn","Loaded Nachos","Chicken Nuggets",
    "Chicken Strips","Chicken Popcorn","Veg Hakka Noodles","Chilli Garlic Noodles",
    "Egg Noodles","Chicken Noodles","Veg Fried Rice","Egg Fried Rice",
    "Chicken Fried Rice","Honey Chilli Potato","Chilli Mushroom","Chilli Paneer",
    "Veg Manchurian","Chilli Chicken","Crispy Chicken","Chicken Manchurian",
    "Paneer Tikka","Paneer Malai Tikka","Mushroom Tikka","Dahi Kebab",
    "Hara Bhara Kebab","Tandoori Chicken","Chicken Tikka","Chicken Malai Tikka",
    "Chicken Seekh Kebab","Paneer Butter Masala","Kadhai Paneer","Dal Makhni",
    "Dal Tadka","Mix Veg","Butter Chicken","Kadhai Chicken","Chicken Curry",
    "Roti","Naan","Garlic Naan","Steamed Rice","Jeera Rice"
  ],
  bevList: [
    "Ginger Tea","Black Tea","Masala Tea","Elaichi Tea","Green Tea","Lemon Ginger Tea",
    "Hot Coffee","Americano","Cold Coffee","Ice Tea","Virgin Mojito","Fresh Lime",
    "Lemonade","Blue Lagoon","Watermelon Mojito","Watermelon Lemonade",
    "Oreo Shake","KitKat Shake","Chocolate Shake","Sweet Lassi","Salty Lassi",
    "Mineral Water","Soda","Mixers"
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  initCommon();
  const isMenuPage = !!document.querySelector('.menu-sections');
  const isLandingPage = !!document.getElementById('linkGeneratorForm');
  const isCustomerPage = new URLSearchParams(location.search).has('guest');

  if (isLandingPage) {
    initLandingPage();
  } else if (isCustomerPage) {
    initCustomerPage();
  } else if (isMenuPage) {
    initMenuPage();
  }
});

// Common functionality for nav pills, search on menu page
function initCommon() {
  // Keyboard "/" focuses search if present
  document.addEventListener('keydown', e => {
    if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
      const s = document.getElementById('searchInput');
      if (s) {
        e.preventDefault();
        s.focus();
      }
    }
  });
}

// Landing page: link generator
function initLandingPage() {
  const form = document.getElementById('linkGeneratorForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    generateLink();
  });
  document.getElementById('copyBtn').addEventListener('click', copyLink);
  document.getElementById('createNewBtn').addEventListener('click', resetForm);
}

function generateLink() {
  const guest = document.getElementById('guestName').value.trim();
  const food = +document.getElementById('foodItems').value;
  const bev  = +document.getElementById('bevItems').value;
  if (!guest || food < 1 || bev < 0) {
    return alert('Invalid input');
  }
  const url = `${location.origin}${location.pathname.replace('index.html','')}?guest=${encodeURIComponent(guest)}&food=${food}&bev=${bev}`;
  document.getElementById('generatedLink').value = url;
  document.getElementById('linkResult').classList.remove('hidden');
}

function copyLink() {
  const link = document.getElementById('generatedLink');
  link.select();
  document.execCommand('copy');
  alert('Copied!');
}

function resetForm() {
  document.getElementById('linkGeneratorForm').reset();
  document.getElementById('linkResult').classList.add('hidden');
}

// Customer page: show selectors & preview
function initCustomerPage() {
  const params = new URLSearchParams(location.search);
  const guest = params.get('guest');
  const foodCount = +params.get('food');
  const bevCount  = +params.get('bev');
  if (!guest) return alert('Invalid link');
  document.getElementById('welcomeTitle').textContent = `Hi ${guest}!`;
  document.getElementById('instructions').textContent =
    `Select ${foodCount} food${foodCount>1?'s':''}` +
    (bevCount>0?` and ${bevCount} beverage${bevCount>1?'s':''}`:'') +
    ' for your picnic.';
  buildSelectors('foodSelectors', menuData.foodList, foodCount, updatePreview);
  buildSelectors('beverageSelectors', menuData.bevList, bevCount, updatePreview);
}

function buildSelectors(containerId, list, count, cb) {
  const cont = document.getElementById(containerId);
  cont.innerHTML = '';
  for (let i=1;i<=count;i++){
    const g = document.createElement('div');
    g.className='selector-group';
    g.innerHTML = `<label>Item ${i}</label><select><option value="">Choose…</option></select>`;
    const sel = g.querySelector('select');
    list.forEach(v=>{
      const o=document.createElement('option');o.value=v;o.textContent=v;sel.append(o);
    });
    sel.addEventListener('change', cb);
    cont.append(g);
  }
  updatePreview();
}

function initMenuPage() {
  document.querySelectorAll('.nav-pill').forEach(p=>{
    p.addEventListener('click', ()=> {
      document.querySelectorAll('.nav-pill').forEach(x=>x.classList.remove('active'));
      p.classList.add('active');
      const sec = document.getElementById(p.dataset.section);
      sec&&sec.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });
  const s = document.getElementById('searchInput');
  s&&s.addEventListener('input', e => {
    const v=e.target.value.toLowerCase();
    document.querySelectorAll('.menu-item').forEach(item=>{
      item.style.display = item.textContent.toLowerCase().includes(v)?'':'none';
    });
    document.querySelectorAll('.menu-section').forEach(sec=>{
      sec.style.display = sec.querySelector('.menu-item:not([style*="display: none"])')?'':'none';
    });
  });
}

// Preview & confirm for customer page
function updatePreview() {
  ['foodPreview','beveragePreview'].forEach(id=>{
    const ul = document.getElementById(id);
    if (!ul) return;
    ul.innerHTML = '';
    document.querySelectorAll(`#${id==='foodPreview'?'foodSelectors':'beverageSelectors'} select`)
      .forEach((sel,i)=>{
        const val=sel.value;
        const li=document.createElement('li');
        li.textContent = val?`${i+1}. ${val}`:`${i+1}. —`;
        ul.append(li);
      });
  });
}

function initializeOrderPreview(){}
function initializeConfirmButton(){}
function showThankYouModal(){}
function showNotification(msg,type){alert(msg);}
