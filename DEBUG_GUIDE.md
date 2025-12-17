# 🔍 DEBUG GUIDE - Ekstraksi Nomor User di Grup

## Tujuan

Mendiagnosis masalah penyimpanan nomor user yang salah saat registrasi di grup.

## Status Saat Ini

Bot menyimpan group participant ID (misal: `140067641258044`) bukannya nomor user real (misal: `6281292744550`).

## Cara Debug

### 1. Jalankan Bot dan Cek Console

```bash
npm start
# atau jika di VPS:
pm2 logs Yukinotempe
```

### 2. Lakukan Registrasi di Grup

- Masuk ke grup tempat bot berada
- Kirim: `!regist NamaKamu | 21`

### 3. Catat Output Console

Cari output berikut (ditandai `[EXTRACT_USER]` dan `[REGISTER]`):

```
[EXTRACT_USER] Debug info:
  msg.from: [CATAT INI]
  msg.author: [CATAT INI]
  msg.fromMe: [CATAT INI]
  msg.isGroup: [CATAT INI]
  msg._data?.notifyName: [CATAT INI]
  msg._data keys: [CATAT INI]
  msg._data.id: [CATAT INI]
  msg._data.from: [CATAT INI]
  msg._data.to: [CATAT INI]

[REGISTER] Command triggered
[REGISTER] Extracted sender number: [CATAT INI - INI MASALAHNYA?]
[REGISTER] User number: [CATAT INI - NOMOR YANG DISIMPAN]
```

## Informasi Penting untuk Shared

### Format Nomor yang Benar

- **Pribadi**: `62812345678@c.us` → Simpan `62812345678`
- **Grup**: Harus mendapat nomor real user (misal `6281292744550`), BUKAN group ID

### Format yang SALAH (Saat Ini)

- **Grup**: Menyimpan `140067641258044` (group participant ID) ❌

## Apa yang Akan Dianalisis dari Output

1. **msg.author ada?** - Apakah ada informasi sender di grup?
2. **msg.\_data.id contains phone?** - Apakah nomor tersembunyi di \_data?
3. **Perbedaan pribadi vs grup** - Bagaimana struktur data berbeda?

## Langkah Selanjutnya (Setelah Debug)

Berdasarkan output debug, kami akan:

- ✓ Menemukan sumber nomor real user
- ✓ Memperbaiki logic ekstraksi
- ✓ Memastikan registrasi grup menyimpan nomor yang benar

## Contact

Bagikan output console lengkap untuk diagnosis lebih lanjut!
