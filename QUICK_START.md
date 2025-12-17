# ⚡ QUICK START - Debug Group Registration

## 3 Langkah Sederhana

### 1️⃣ Jalankan Bot

```bash
npm start
```

Console akan menampilkan logs.

### 2️⃣ Register di Grup

Di WhatsApp grup mana saja tempat bot ada, kirim:

```
!regist TestName | 25
```

### 3️⃣ Lihat Output

Di terminal/console, cari output yang dimulai dengan `[EXTRACT_USER]` dan `[REGISTER]`.

**CATAT TERUTAMA BARIS INI:**

```
[EXTRACT_USER] msg.author tersedia: ???
[REGISTER] Extracted sender number: ???
[REGISTER] ✓ User registered successfully with number: ???
```

---

## Apa yang Kita Cari?

✓ **GOOD**:

```
msg.author: 6281292744550@c.us  (Nomor asli user)
Extracted sender number: 6281292744550
```

✗ **BAD** (Current Problem):

```
msg.author: 140067641258044@c.us  (Group participant ID)
Extracted sender number: 140067641258044
```

---

## Files for Reference

- **CONSOLE_OUTPUT_REFERENCE.md** - Lihat apa output yang expected
- **TROUBLESHOOTING_GUIDE.md** - Testing terperinci
- **STATUS_SUMMARY.md** - Overview lengkap

---

## After Getting Output

Share:

1. Console output lengkap (especially [EXTRACT_USER] dan [REGISTER] logs)
2. Content database/users.json
3. What key was stored

Dari situ bisa immediate fix! ✓
