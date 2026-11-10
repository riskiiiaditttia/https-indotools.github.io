# PapahZone — Cara Menambah Tools

## 1. Tambah Satu Tool
Buka `data.js`, tambahkan objek baru ke array `TOOLS`:

```javascript
{
  name: 'NamaTool',
  cat: 'web',              // harus salah satu id di CATEGORIES
  diff: 'Beginner',        // Beginner | Intermediate | Advanced | Expert
  platform: 'Linux',
  desc: 'Deskripsi singkat.',
  how: 'Cara kerja tool.',
  github: 'https://github.com/user/repo'
}