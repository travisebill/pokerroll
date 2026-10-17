# 撲克記帳王 PokerRoll 🃏

現場德州撲克資金管理 PWA — 現金桌 / 錦標賽買入、收池、盲注與損益圖表分析。

原始 App 由 Gemini Canvas 產生，此 repo 將其整理為可安裝的獨立 PWA。

## ✨ 功能

- **記一筆** — 現金桌 (Cash) / 錦標賽 (MTT) 雙模式，自動計算損益
- **盲注 preset** — 5/5、5/10、10/20、20/40 一鍵選取
- **MTT 買入分級** — $600 / $1,200 / $2,500 / $3,400 / $6,600 快速帶入
- **圖表分析** — Chart.js 資金曲線（合併 / 拆分 / 長條三種檢視）
- **歷史戰績** — 依地點、牌型篩選，支援編輯 / 刪除
- **資料備份** — JSON 匯出 / 匯入，localStorage 自動存檔
- **PWA 可安裝** — 可加到手機主畫面，離線可用

## 📱 安裝方式

1. 用 Chrome / Safari 開啟部署網址
2. 點瀏覽器選單「加到主畫面」或「安裝應用程式」
3. 圖示即出現在手機桌面，離線也能記帳

## 🗂 專案結構

```
.
├── index.html              # 主 App（單檔 SPA）
├── manifest.webmanifest    # PWA manifest
├── sw.js                   # Service Worker（app shell + CDN 快取）
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── maskable-512.png
│   ├── apple-touch-icon.png
│   └── favicon-32.png
└── .nojekyll               # 停用 GitHub Pages Jekyll
```

## 🔧 技術棧

- 純前端單檔 SPA（無 build step）
- Tailwind CSS（CDN）+ Chart.js 4（CDN）+ Font Awesome 6（CDN）
- localStorage 持久化（`POKER_PRO_RECORDS_V2` / `POKER_PRO_PRESETS_V2`）
- Service Worker 快取 app shell 與 CDN 資源，支援離線

## 🚀 部署

GitHub Pages，`main` 分支根目錄。推上後於 repo Settings → Pages 啟用即可。

## 📝 授權

個人使用。
