# 🕸️ GraphCraft / GrafGörsel - React Graph Visualizer

JSON verilerinizi etkileşimli, sürüklenebilir ve tamamen özelleştirilebilir grafik düğümlerine dönüştüren modern bir React web uygulaması.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC.svg)](https://tailwindcss.com/)

---

## ✨ Öne Çıkan Özellikler

- **🔄 Zeki JSON Parsing Engine**:
  - Standart `{ nodes: [...], edges: [...] }` şemasını ve herhangi bir karmaşık iç içe geçmiş (nested) JSON yapısını otomatik düğüm ve ilişkilere dönüştürür.
- **🎨 Geometrik Düğüm Şekilleri (Node Shapes)**:
  - 🟥 **Dikdörtgen (Rectangle)**, 🟡 **Daire (Circle)**, 💊 **Kapsül (Pill)**, 🔷 **Elmas (Diamond)** ve 🔺 **Üçgen (Triangle)** biçim desteği.
- **📐 5 Farklı Düzen (Layout) Modu**:
  - Hiyerarşik Dikey (Top-to-Bottom), Yatay (Left-to-Right), Dairesel (Circular), Izgara (Grid Matrix) ve Organik (Force-Directed).
- **🔎 Düğüm Detay Paneli & İletişim Navigasyonu**:
  - Düğüme tıklandığında yan detay paneli açılır. Tüm veri özellikleri ve JSON çıktısı gösterilir.
  - Gelen ve giden tüm bağlantılar listelenir; **"Git / Focus"** butonuna basıldığında tuval kamera odağını doğrudan o düğüme taşır.
- **📥 / 📤 Dosya Yükleme & Dışa Aktarma**:
  - Bilgisayardan `.json` dosyası yükleme ve Sürükle-Bırak (Drag & Drop) desteği.
  - Güncellenmiş grafı **JSON** olarak indirme veya yüksek çözünürlüklü **PNG** görseli olarak dışa aktarma.
- **🌗 %100 Uyumlu Aydınlık & Karanlık Mod**:
  - Üst bardan tek tıkla **Light** ve **Dark** temaları arasında geçiş yapma.
- **🔍 Canlı Arama & Filtreleme**:
  - Düğüm adı, alt başlık veya tipine göre anlık arama yapma ve eşleşen düğümleri parlatma.

---

## 🛠️ Kullanılan Teknolojiler (Tech Stack)

- **Core**: React 18 / 19 + Vite
- **Graph Engine**: `@xyflow/react` (React Flow v12)
- **Layout Engines**: `dagre` (Diyagram & Ağaç yerleşimleri için)
- **Styling & UI**: Tailwind CSS v4 + Glassmorphism UI + Lucide React Icons
- **Image Export**: `html-to-image`

---

## 🚀 Hızlı Başlangıç (Getting Started)

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/FatihG60/graph-visualizer.git
cd graph-visualizer
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Geliştirici Sunucusunu Başlatın
```bash
npm run dev
```
Tarayıcınızda `http://localhost:5173/` adresine gidin.

### 4. Production Bundle Derleme
```bash
npm run build
```

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.
