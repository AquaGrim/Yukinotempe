# ✅ DEBUGGING CHECKLIST - User Number Extraction

## Status Komprehensif

### ✓ Sudah Selesai

- [x] Tambahkan debug logging di `userExtractor.js`
  - Logs: msg.from, msg.author, msg.fromMe, msg.isGroup
  - Logs: msg.\_data.id, msg.\_data.from, msg.\_data.to
  - Logs: Semua keys di msg.\_data (30 pertama)
- [x] Tambahkan debug logging di `registerHandler.js`
  - Logs: "Command triggered"
  - Logs: "Extracted sender number: [VALUE]"
  - Logs: "User number: [VALUE] Already registered: [BOOL]"
  - Logs: "Creating user: [NUMBER] Name: [NAME] Age: [AGE]"
  - Logs: "User registered successfully with number: [NUMBER]"
- [x] Syntax validation: ✓ PASSED (Tanpa error)
- [x] Buat DEBUG_GUIDE.md untuk referensi

### 🔄 Sekarang Menunggu

1. **Bot berjalan dengan debug logging**
2. **User melakukan registrasi di grup**
3. **Catat output console lengkap**

## Untuk Deploy

### Local Testing

```powershell
# Terminal 1: Run bot
npm start

# Terminal 2: Kirim pesan
# - Buka WhatsApp Web
# - Masuk grup
# - Kirim: !regist TestName | 25
# - Lihat console output
```

### VPS Deploy

```bash
cd /home/webserver-1/Yukinotempe
git pull origin main
npm install
pm2 logs Yukinotempe  # Lihat output saat register di grup
```

## Console Output yang Diharapkan

### Format Output

```
[EXTRACT_USER] Debug info:
  msg.from: 120363422443959261@g.us
  msg.author: 6281292744550@c.us
  msg.fromMe: false
  msg.isGroup: true
  msg._data?.notifyName: TestUser
  msg._data keys: [id, from, to, ack, type, body, ...]
  msg._data.id: true_120363422443959261-1234567890@g.us_AABBCC...
  msg._data.from: 120363422443959261@g.us
  msg._data.to: [varies]

[EXTRACT_USER] Pesan dari GRUP
[EXTRACT_USER] msg.author tersedia: 6281292744550@c.us
[EXTRACT_USER] ✓ Nomor valid dari author: 6281292744550

[REGISTER] Command triggered
[REGISTER] Extracted sender number: 6281292744550
[REGISTER] User number: 6281292744550 Already registered: false
[REGISTER] Creating user: 6281292744550 Name: TestName Age: 25
[REGISTER] ✓ User registered successfully with number: 6281292744550
```

## Kemungkinan Hasil

### Skenario 1: Nomor Terdeteksi dari msg.author ✓

**Output**: `msg.author: 6281292744550@c.us`
**Kesimpulan**: Masalah sudah teratasi, extraction bekerja
**Aksi**: Verifikasi database, lakukan fresh test

### Skenario 2: Nomor Tersembunyi di msg.\_data

**Output**: Log menunjukkan nomor di lokasi lain (misal di profile)
**Kesimpulan**: Perlu update parsing logic
**Aksi**: Modifikasi regex extraction

### Skenario 3: Nomor TIDAK Tersedia di Grup ✗

**Output**: Semua logs null/undefined untuk nomor
**Kesimpulan**: WhatsApp API tidak expose nomor di grup
**Aksi**: Require first private message registration

## Pertanyaan untuk User

1. **Nomor mana yang tercetak di output?**

   - Group ID? (`120...`)
   - Real phone? (`628...`)
   - Kosong?

2. **Lokasi nomor (jika ada)?**

   - Di msg.author?
   - Di msg.\_data.id?
   - Somewhere else?

3. **Database hasil**
   - users.json menyimpan apa?

## Priority Investigation Order

1. Check msg.author value ← **Priority #1**
2. Check msg.\_data.id content ← Priority #2
3. Check other msg.\_data properties ← Priority #3
4. Consider fallback strategy ← Priority #4

---

**Status**: Ready for testing
**Last Updated**: Now
**Next Step**: Run bot + User registers in group + Share debug output
