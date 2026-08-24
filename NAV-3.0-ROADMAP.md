# NAV 3.0 Roadmap

> 施工原則：先地基、再骨架、再功能，最後才是裝飾。沒有通過當前 Phase 的驗收，就不進下一個 Phase。

## 📍 Current Progress

- **Current Phase:** Phase 0：基礎規格與安全底座
- **Current subphase:** 0.4 Cache Strategy
- **Completed:** 0.1 Repository 基本驗收、0.2 Project Structure 基本骨架、0.3 Version System 基本建立
- **Pending:** 0.2 CSS 分層與 Assets 統一的完整整理、0.3 commit / builtAt 自動化、0.4 Cache Strategy、0.5 Validation 部署阻擋
- **Rule:** 未通過當前 Phase 驗收，不進下一個 Phase。

## Phase 0：基礎規格與安全底座

### 0.1 Repository
- [x] nav-old 保留舊 NAV
- [x] nav 作為 NAV 3.0
- [x] nav.chi.qzz.io 綁定新版
- [x] 確認 GitHub Pages / HTTPS / CNAME

### 0.2 Project Structure
- [x] 最終目錄結構基本骨架
- [x] JS 模組責任明確
- [ ] CSS 分層
- [ ] Assets 統一位置

### 0.3 Version System
建立：
- [x] `data/version.json`
- [x] `CHANGELOG.md`

包含：
- [x] version
- [x] build
- [x] dataVersion
- [x] schemaVersion
- [ ] commit 自動注入
- [ ] builtAt 自動生成
- [x] channel

功能：
- [x] 版本顯示
- [x] Build ID
- [x] Data Version
- [x] Schema Version
- [ ] Git Commit 自動注入
- [ ] Build Time 自動生成
- [x] Changelog
- [x] Stable / Beta channel

### 0.4 Cache Strategy
- [ ] HTML 不長期 cache
- [ ] version.json 不 cache
- [ ] JS / CSS 使用版本 query
- [ ] data.json 使用版本 query
- [ ] 定義更新流程
- [ ] 防止舊 JS + 新 Data 混用

### 0.5 Validation
建立：
- [x] `schema.json`
- [x] validator

檢查：
- [x] JSON
- [x] Schema
- [x] URL
- [x] taxonomy
- [x] duplicate
- [x] icon
- [x] 必填欄位

- [ ] 任何 validation 失敗禁止部署

## Phase 1：Data Layer

### 1.1 Data Schema
正式定義：

```text
Category
 └── Subcategory
      └── Link
```

每個 Link 統一：
- id
- title
- url
- description
- icon
- category
- subcategory
- tags

### 1.2 Data Loader
```text
data.json
 ↓
loader
```
負責：
- fetch
- timeout
- HTTP error
- JSON error

### 1.3 Validator
```text
loader
 ↓
validator
```

### 1.4 Normalizer
把資料轉成 NAV 統一格式。

### 1.5 Error Isolation
單一網站資料壞掉不能讓整個 NAV 掛掉。這條是硬規則。

## Phase 2：Core Architecture

### 2.1 State
統一：
- data
- currentPage
- searchQuery
- favorites
- recent
- theme
- sidebar

### 2.2 Event System
模組之間透過 event / state 溝通。

### 2.3 App Lifecycle
固定：
```text
Bootstrap
 ↓
Load
 ↓
Validate
 ↓
Normalize
 ↓
State
 ↓
Render
 ↓
Ready
```

### 2.4 Error System
統一：
- Loading
- Error
- Empty
- Ready

而不是每個 JS 自己搞一套。

## Phase 3：基本 UI

### 3.1 Layout
- Header
- Sidebar
- Main
- Footer

### 3.2 Category
- 分類
- 子分類
- 分類切換

### 3.3 Card
建立唯一 Card Component：
```text
Card
├── Icon
├── Title
├── Description
├── Category
└── Actions
```
所有頁面共用。

### 3.4 Responsive
- Desktop
- Tablet
- Mobile

## Phase 4：搜尋與導航

### Search
- 即時搜尋
- Title
- Description
- Tags
- URL
- 搜尋結果
- 無結果頁

### Navigation
- 首頁
- 分類
- 子分類
- Back
- URL state

## Phase 5：個人化功能

### Favorites
- 收藏
- 取消收藏
- 收藏頁
- 排序

### Frequent
- 常用
- 使用次數
- 排序

### Recent
- 最近使用
- 時間
- 清除

### Drag & Drop
- 收藏排序
- 常用排序
- 自訂順序

## Phase 6：UI / UX

等功能穩定才做：
- Dark / Light / System
- 動畫
- Tooltip
- Toast
- Modal
- Command Palette
- Keyboard shortcuts
- Loading skeleton
- Empty state
- Accessibility

## Phase 7：Admin

最簡單的 GitHub-based Admin

`/admin`

功能：
- GitHub 身份驗證
- 網站列表
- 新增
- 編輯
- 刪除
- 分類
- 子分類
- Icon
- 排序
- Preview

Data Flow
```text
Admin
 ↓
Validation
 ↓
GitHub API
 ↓
data.json
 ↓
Commit
 ↓
Deploy
```

## Phase 8：CI / CD

GitHub Actions
```text
Push
 ↓
Validate
 ↓
Build
 ↓
Version
 ↓
Deploy
```

檢查：
- JSON
- Schema
- URL
- Duplicate
- Icon
- JS syntax
- HTML
- CSS

自動版本等前面穩定後才開。

## Phase 9：PWA / Cache

最後才處理：
- Service Worker
- Cache
- Offline
- Update detection
- Update notification
- Cache cleanup

## Phase 10：Debug / Monitoring

### Health
`/health.json`

### Debug
`?debug=1`

顯示：
- NAV 3.0.0
- Build 42
- Data 17
- Schema 1
- Commit a81f3c2
- Built 2026-08-24
- Cache: fresh

### Rollback
- App rollback
- Data rollback
- Git commit 對應

## 最後的完整優先順序

```text
NAV 3.0
   │
   ▼
① Repository
   │
   ▼
② Project Structure
   │
   ▼
③ Version System
   │
   ▼
④ Cache Strategy
   │
   ▼
⑤ Data Schema
   │
   ▼
⑥ Validation
   │
   ▼
⑦ Data Loader
   │
   ▼
⑧ Core / State
   │
   ▼
⑨ Basic UI
   │
   ▼
⑩ Card Component
   │
   ▼
⑪ Responsive
   │
   ▼
⑫ Search
   │
   ▼
⑬ Navigation
   │
   ▼
⑭ Favorites
   │
   ▼
⑮ Frequent / Recent
   │
   ▼
⑯ Theme / UX
   │
   ▼
⑰ Admin
   │
   ▼
⑱ CI / CD
   │
   ▼
⑲ PWA / Cache
   │
   ▼
⑳ Debug / Health
```

## 🚦 驗收規則

每個階段都有完成條件。

沒有通過當前 Phase 的驗收，就不進下一個 Phase。

例如 Phase 1：
```text
data.json
 ↓
Load
 ↓
Validate
 ↓
Normalize
 ↓
Render
```
全部成功，才進 Phase 2。

## 開發原則

1. 不為了漂亮提前做 UI。
2. 不為了方便把功能全部塞進 `app.js`。
3. 每一階段完成後都做實際測試，再往下一階段走。
4. 任何 repo 變更都必須同步更新 Version 與 CHANGELOG；若資料版本發生變更，再更新 `dataVersion`。
5. 每次執行工作後，都必須檢核本 Roadmap，更新已完成項目、目前進度與待辦項目。
