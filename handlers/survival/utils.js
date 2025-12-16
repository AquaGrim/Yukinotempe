const fs = require("fs");
const path = require("path");
const dbPath = path.join(__dirname, "../../database/users.json");

// Simple cache to reduce disk I/O
let usersCache = null;
let cacheTime = 0;
const CACHE_DURATION = 1000; // ms

function loadUsers() {
  const now = Date.now();
  if (usersCache && now - cacheTime < CACHE_DURATION) {
    return usersCache;
  }
  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, "{}");
  const data = JSON.parse(fs.readFileSync(dbPath));
  usersCache = data;
  cacheTime = now;
  return data;
}

function saveUsers(data) {
  usersCache = data;
  cacheTime = Date.now();
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function addExp(user, amount) {
  user.exp += amount;
  let leveledUp = false;

  while (user.exp >= (user.level + 1) * 50) {
    user.exp -= (user.level + 1) * 50;
    user.level += 1;
    leveledUp = true;
  }

  return leveledUp;
}

function addItem(user, itemName, quantity = 1) {
  if (!user.inventory) user.inventory = {};
  if (!user.inventory[itemName]) user.inventory[itemName] = 0;
  user.inventory[itemName] += quantity;
}

function formatUserProfile(user) {
  let inventoryText = "Kosong";
  if (
    user.inventory &&
    typeof user.inventory === "object" &&
    Object.keys(user.inventory).length > 0
  ) {
    inventoryText = Object.entries(user.inventory)
      .map(([item, qty]) => `${item} x${qty}`)
      .join(", ");
  }

  return `   ^=^q    *Profil*
   ^=   ^q Nama: ${user.name}
   ^=^n^b Umur: ${user.age}
   ^=^r    Uang: ${user.money}
   ^z    Stamina: ${user.stamina}
   ^p    Level: ${user.level} (${user.exp}/${user.level * 100})
   ^=^n^r Inventory: ${inventoryText}`;
}

module.exports = { loadUsers, saveUsers, addExp, formatUserProfile, addItem };
