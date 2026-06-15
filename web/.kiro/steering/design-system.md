---
inclusion: always
---

# 设计风格规范

本项目 UI 以 **Gemini 设计语言**为基准。核心哲学：**极端克制的静（极简容器、纯净负空间）+ 自然的层次感（色差建立纵深、圆角传递亲和、间距代替线条）**。

---

## 零、预览与协作共识

设计优化必须以用户正在观察的真实浏览器窗口为准。可以调整尺寸、间距、圆角和布局，但不能通过模拟 viewport 或固定浏览器视口来推导设计结论；如果需要验证响应式，只能在用户明确同意后进行，并且验证结束后必须恢复浏览器原始状态。

### 真实窗口优先
- 页面应保持原有自适应能力，拖动浏览器窗口时内容宽度必须自然跟随窗口变化。
- 不使用 Playwright/CDP 的 `setViewportSize`、设备模拟、固定 viewport 作为默认检查方式。
- 如果误设置了固定 viewport，必须先恢复干净标签页或清除 emulation，再继续设计工作。

### 小步调整
- 视觉优化可以触及尺寸、间距、圆角和布局，但必须小步提交、逐项观察。
- 改动前先说明要调整的区域和目的；改动后优先让用户在当前屏幕上观察效果。
- 如果页面出现不自适应、右侧空白、错位、挤压等异常，先恢复正常显示，再继续优化。

### iframe 场景
- iframe 嵌入检查重点是“页面是否能独立使用”，不是按小视口强行重排。
- 除 `/` 根目录外，其他页面都可能被 iframe 嵌入；详情页不能依赖浏览器后退完成主要返回。
- 详情页应具备页面内返回闭环：面包屑、返回入口、侧边导航或明确的上下文切换。

---

## 一、整体布局哲学

### 模块边界靠色差，不靠线条
页面底色（L0）比内容区（L1）深，内容区比侧边辅助区（L2）浅，三层色差自然建立纵深感，无需边框或分隔线。

```
L0 app-page ──── 页面大背景（最深）
  └── L1 bg-base ─── 主内容区、卡片（中间层）
       └── L2 bg-component ── sidebar、辅助面板（略深于 L1）
```

模块之间用 `gap-3` 露出 L0 底色作为"视觉沟槽"，产生自然的模块边界。

### 三层纵深布局（所有有 sidebar 的页面）

```
页面容器  bg-app-page  flex flex-col  size-full
├── 面包屑行   px-6 pt-4 pb-2  透明（融入底色）
└── 主体区    flex gap-3 px-3 pb-3  flex-1 min-h-0
    ├── 左 sidebar   bg-bg-component  rounded-3xl  shrink-0
    └── 右内容区     bg-bg-base       rounded-3xl  flex-1 min-h-0
```

### 列表页布局（datasets / agents / files 等）

```
article  bg-app-page  size-full flex flex-col
├── header   px-6 pt-6 pb-4  透明（ListFilterBar）
├── 卡片区   px-6 py-5        flex-1 overflow-auto
└── footer   px-6 py-4        透明（分页）
```

### 禁止硬算高度
- ❌ `h-[calc(100vh-xxx)]`、`max-h-[calc(100vh-xxx)]`、`style={{ height: 'calc(...)' }}`
- ✅ `flex-1 min-h-0`，父容器必须是 `flex flex-col`

---

## 二、色系

### Surface 三层

| 层级 | Token | Light | Dark |
|------|-------|-------|------|
| L0 页面底色 | `bg-app-page` | `#E8EDF5`（蓝调浅灰）| `#131314`（夜空灰）|
| L1 主内容 | `bg-bg-base` | `#FFFFFF` | `#1E1F20` |
| L1.5 内层轻浮面 | `bg-surface-raised` | `#F4F7FB` | `#242528` |
| L1.8 悬浮激活面 | `bg-surface-floating` | `#FBFCFE` | `#2A2B2F` |
| L2 侧边/辅助 | `bg-bg-component` | `#FFFFFF`\* | `#1A1A1C` |

> \* Light 模式 L1/L2 色值接近，靠阴影或位置关系区分；Dark 模式三层色差明显。

### 同色系高度感
- 卡片托盘指承托一组卡片的白色框体，例如 `/` 页面右侧模块网格外层容器。
- 内层卡片不能和最外层页面底色同色。否则放在卡片托盘里会像“挖空”到背景，而不是浮在托盘之上。
- 纵深色阶应使用统一色系的深浅变化表达 z 轴高度，不引入过多复杂颜色。
- 卡片托盘里的模块卡片优先使用 `bg-surface-raised`：它比 `bg-bg-base` 略深、比 `bg-app-page` 更浅，表达轻微抬高的内层面。
- 鼠标悬浮表示卡片在 z 轴上升，颜色也要同步升阶：`bg-surface-raised hover:bg-surface-floating`，并配合 `hover:shadow-raised hover:-translate-y-0.5`。
- 鼠标按下表示卡片被触碰回落，颜色应回到低一阶：`active:bg-surface-raised active:shadow-surface active:translate-y-0`。
- 只有真正露出页面沟槽或外层背景时才使用 `bg-app-page`；不要把 `bg-app-page` 用作白色容器内部的卡片底色。

### 主色（Gemini 蓝）
- Light：`#1A73E8` → Token `accent-primary: 26 115 232`
- Dark：`#8AB4F8` → Token `accent-primary: 138 180 248`
- 主色只用于：active 菜单项背景、主按钮、focus 发光、强调 badge

### 文字层次
| 用途 | Token | Light | Dark |
|------|-------|-------|------|
| 主文字 | `text-text-primary` | `#1F1F1F` | `#E3E3E3` |
| 次要文字 | `text-text-secondary` | `#5F6368` | `#C4C7C5` |
| 禁用/占位 | `text-text-disabled` | `#BDC1C6` | `#5F6368` |

**禁止**在组件里使用 `text-muted-foreground`、`text-foreground`，统一用上述 Token。

## 三、圆角（轮廓）

圆角是 Gemini 亲和感的核心，越大的容器圆角越大。

| 场景 | 值 | px |
|------|----|----|
| 页面级容器、sidebar、主内容块 | `rounded-3xl` | 24px |
| 普通卡片（Card 组件全局） | `rounded-3xl` | 24px |
| 菜单项、列表行、tag | `rounded-2xl` / `rounded-full` | 16px / 全圆 |
| 大按钮 xl/lg | `rounded-2xl` / `rounded-xl` | 16px / 12px |
| 默认按钮 | `rounded-lg` | 8px |
| 输入框 | `rounded-xl` | 12px |
| 下拉菜单容器 | `rounded-2xl` | 16px |
| 下拉菜单项 | `rounded-xl` | 12px |
| 对话框 Dialog | `rounded-3xl` | 24px |
| Sheet 侧滑面板 | `rounded-3xl` | 24px |

---

## 四、阴影与纵深感

Gemini 不依赖阴影建立层级，**主要靠色差**。阴影仅用于交互反馈：

- 阴影很少直接表达，应与激活状态配合表达：hover、focus、open、selected、active、dragging 等状态才明显出现。
- 卡片默认：无阴影或极弱 surface 阴影，不抢内容。
- 卡片 hover / focus：`hover:shadow-raised` / `focus-visible:shadow-focus`（轻微悬浮 + 可感知聚焦）。
- Sidebar / 独立面板：无阴影，靠背景色差区分
- Popover / Dropdown / Tooltip：打开时使用 `shadow-floating`，表达临时浮起层。
- Dialog：`shadow-modal`（模态层需要明确浮起感）。
- Button / Input：默认不靠阴影，hover/focus 时用轻微 `shadow-surface` 或 `shadow-focus` 辅助表达交互。
- **禁止**用重阴影替代色差做静态层级；阴影必须服务于状态反馈。

---

## 五、视觉重量均衡

界面不能出现"白桌子上放绿豆"的感觉，即大面积空白中孤立着几个小元素。

### 元素尺寸原则
- 头像/图标在 sidebar 中：`size-14 rounded-2xl`（不能太小）
- 菜单按钮高度：`h-9`，字号 `text-sm font-medium`（不用 `text-xs` 或 `h-6`）
- 列表行高：`py-2` 以上，保证视觉重量
- 空态（无数据）：最小高度 `h-64`，内容垂直水平居中，不能贴顶

### 信息密度规则
- 卡片内边距：`p-5`（不能低于 `p-3`）
- 卡片网格间距：`gap-4`
- 页面内容区水平内边距：`px-6`
- 两个 Surface 块之间：`gap-3`

### 孤立元素处理
- 操作按钮（如设置、切换）不能独立漂浮在角落，应放入顶部 header 行右侧
- 底部分页区不加额外背景色，透明融入页面

---

## 六、组件级规范

### Card
- 全局：`rounded-3xl border-0 shadow-none bg-bg-base`
- hover：`motion-breath hover:shadow-raised hover:-translate-y-0.5`
- 如果卡片处于卡片托盘内部：`bg-surface-raised hover:bg-surface-floating`
- active：`active:bg-surface-raised active:translate-y-0 active:scale-[0.985] active:shadow-surface`
- 不填满容器时，背景必须透明或与父容器一致，避免色块割裂

### Table
- 容器透明（无 `bg-bg-card`）
- TableHeader sticky 背景：`bg-bg-base`
- 空态行：`<div className="flex items-center justify-center h-64">`
- 分页放在 Table 外层 flex 流中，不用 `absolute`

### Sidebar 菜单
- 默认态：`text-text-secondary hover:text-text-primary hover:bg-bg-card rounded-2xl h-9`
- 激活态：`bg-accent-primary text-bg-base hover:bg-accent-primary`
- 菜单列表间距：`gap-1`（紧凑，不用 `gap-5`）

### Sidebar 头像区
- 头像竖排居中，名称/描述文字居中对齐
- 头像尺寸：`size-14 rounded-2xl`

### PageHeader（面包屑栏）
- 透明背景，`px-5 py-3`
- 面包屑颜色：`text-text-secondary` / `text-text-primary`
- 右侧放操作按钮（如设置图标），不单独放底部

### Button
- 主按钮：深色填充，`rounded-lg`
- Ghost：`hover:bg-bg-card`，圆角 `rounded-lg`
- 禁用 `border-0.5` 细边框按钮风格（改用 ghost/outline）

### 输入框 focus
- `focus-visible:ring-1 focus-visible:ring-accent-primary`
- 不用蓝色硬边框，用发光 ring

---

## 七、动效原则

- 微交互要有“呼吸感”：进入状态不能匀速，应该先快后缓，像自然呼吸一样有可感知但不拖沓的节奏。
- 推荐基础交互类：`motion-breath`，时长约 `220ms`，曲线 `cubic-bezier(0.2, 0, 0, 1)`；它用于 hover/focus 的阴影、色差、轻微位移。
- 按压反馈要更短，约 `140ms`；active 状态应让元素回到更低位置并轻微缩小，松手后自然回弹到 hover 浮起态。
- 太快会像没有动效，太慢会被误解为性能差；按钮/卡片的微交互不超过 `240ms`，面板展开可到 `300ms`。
- 缓动：使用非线性曲线，避免匀速；优先过渡 `background-color`、`box-shadow`、`transform`、`opacity`。
- More 按钮等辅助操作：`opacity-0 group-hover:opacity-100 transition-opacity`（hover 才出现）
- 卡片 hover：`hover:shadow-raised hover:-translate-y-0.5`，像轻轻浮起。
- 卡片 active：`active:translate-y-0 active:scale-[0.985] active:shadow-surface`，像被触碰后按下，松手再回弹。
- 按钮 active：`active:scale-[0.97]` 左右，悬浮圆形按钮可更明显到 `0.94`，但必须短促。
- 支持 `prefers-reduced-motion`，用户减少动画时应关闭或压缩 transform 过渡。

---

## 八、禁止清单

| 禁止 | 替代方案 |
|------|---------|
| `border-b` / `border-t` 做功能区分隔 | 用 `gap` 间距 + 色差 |
| `bg-text-title-invert` 做区域背景 | 透明或 Surface Token |
| `border-l-0.5` 做侧边分隔 | 相邻块用 `gap-3` + 不同背景色 |
| `divide-x` 做列分隔 | `gap-3` + 各自背景色 |
| `h-[calc(100vh-xxx)]` 硬算高度 | `flex-1 min-h-0` |
| `absolute` 定位分页/操作栏 | 普通 flex 流 |
| `text-muted-foreground` / `text-foreground` | `text-text-secondary` / `text-text-primary` |
| 硬编码色值（`#ffffff`、`#000` 等）| CSS Token |

---

## 九、同类组件清单（保持一致性的关键）

改动任何一处时，同组的其他文件必须同步检查。

### 1. 列表页（卡片网格 + 筛选栏 + 分页）

标准结构：`bg-app-page` → header 透明 → 卡片区 `px-6 py-5` → footer 透明

| 文件 | 页面路由 |
|------|---------|
| `src/pages/datasets/index.tsx` | `/datasets` |
| `src/pages/agents/index.tsx` | `/agents` |
| `src/pages/memories/index.tsx` | `/memories` |
| `src/pages/next-searches/index.tsx` | `/searches` |
| `src/pages/files/index.tsx` | `/files` |

---

### 2. 详情页（面包屑 + sidebar + 右侧内容区）

标准结构：`bg-app-page` → 面包屑透明 → `gap-3 px-3 pb-3` → sidebar `bg-bg-component rounded-3xl` → 内容区 `bg-bg-base rounded-3xl`

| 文件 | 页面路由 | Sidebar 文件 |
|------|---------|------------|
| `src/pages/dataset/index.tsx` | `/dataset/*` | `src/pages/dataset/sidebar/index.tsx` |
| `src/pages/memory/index.tsx` | `/memory/*` | `src/pages/memory/sidebar/index.tsx` |
| `src/pages/next-chats/chat/index.tsx` | `/chat/:id` | `src/pages/next-chats/chat/sessions.tsx` |
| `src/pages/next-search/index.tsx` | `/search/:id` | `src/pages/next-search/search-setting.tsx`（右侧配置面板）|
| `src/pages/chunk/parsed-result/add-knowledge/components/knowledge-chunk/index.tsx` | `/chunk/parsed/chunks` | — |

---

### 3. Sidebar 组件（左侧导航）

标准结构：`bg-bg-component rounded-3xl`，头像竖排居中，菜单 `gap-1 h-9 text-sm`，active `bg-accent-primary text-bg-base`

| 文件 | 所属页面 |
|------|---------|
| `src/pages/dataset/sidebar/index.tsx` | `/dataset/*` |
| `src/pages/memory/sidebar/index.tsx` | `/memory/*` |
| `src/pages/user-setting/sidebar/index.tsx` | `/` Dashboard |
| `src/pages/next-chats/chat/sessions.tsx` | `/chat/:id` 左侧会话列表 |
| `src/pages/agents/template-sidebar.tsx` | Agent 模板选择页 |

---

### 4. 卡片组件（CardContainer 网格项）

所有列表页的卡片项，使用 `HomeCard` 或仿照其结构：头像+名称同行，描述为胶囊 tag，底部时间+badge。

| 文件 | 使用场景 |
|------|---------|
| `src/components/home-card.tsx` | **通用卡片**，datasets / agents / chats / searches / memories 共用 |
| `src/pages/datasets/dataset-card.tsx` | 数据集卡片（包装 HomeCard）|
| `src/pages/agents/agent-card.tsx` | Agent 卡片（包装 HomeCard）|
| `src/pages/next-chats/chat-card.tsx` | 对话卡片 |
| `src/pages/next-searches/search-card.tsx` | 搜索卡片 |
| `src/pages/memories/memory-card.tsx` | 记忆卡片 |
| `src/pages/agents/template-card.tsx` | Agent 模板卡片 |
| `src/pages/chunk/parsed-result/add-knowledge/components/knowledge-chunk/components/chunk-card/index.tsx` | Chunk 卡片（背景 `bg-app-page`，selected 用 `ring-2 ring-accent-primary`）|
| `src/pages/user-setting/mcp/mcp-card.tsx` | MCP 卡片 |

---

### 5. Table 组件（数据表格）

标准：`Table` 容器透明，`TableHeader` sticky `bg-bg-base`，空态 `flex items-center justify-center h-64`，分页在 flex 流中不用 `absolute`

| 文件 | 所属页面 |
|------|---------|
| `src/pages/files/files-table.tsx` | `/files` |
| `src/pages/dataset/dataset/dataset-table.tsx` | `/dataset/files/:id` |
| `src/pages/memory/memory-message/message-table.tsx` | `/memory/memory-message/:id` |
| `src/pages/agents/agent-log-page.tsx` | `/agent-log-page/:id` |
| `src/pages/dataset/dataset-overview/overview-table.tsx` | `/dataset/logs/:id` |
| `src/pages/user-setting/data-source/data-source-detail-page/log-table.tsx` | `/user-setting/data-source-detail-page` |
| `src/pages/user-setting/setting-team/user-table.tsx` | `/user-setting/team` |
| `src/pages/user-setting/setting-team/tenant-table.tsx` | `/user-setting/team` |

---

### 6. 面包屑（PageHeader + Breadcrumb）

标准：`PageHeader` 透明背景，`px-5 py-3`；面包屑颜色用 `text-text-secondary` / `text-text-primary`；操作按钮放 PageHeader 右侧

涉及文件：
- `src/components/page-header.tsx` — 公共容器组件
- `src/components/ui/breadcrumb.tsx` — 面包屑组件
- 以及所有详情页 index.tsx（见第 2 组）

---

### 7. 配置/设置面板

标准：`bg-bg-component rounded-3xl`（作为独立面板），或内嵌在右侧内容区 `bg-bg-base` 中；内容区加 `p-5` 内边距；不用 `h-[calc(...)]` 硬算高度

| 文件 | 所属页面 |
|------|---------|
| `src/pages/next-search/search-setting.tsx` | `/search/:id` 右侧配置面板 |
| `src/pages/next-chats/chat/app-settings/chat-settings.tsx` | `/chat/:id` 右侧配置 |
| `src/pages/dataset/dataset-setting/index.tsx` | `/dataset/configuration/:id` |
| `src/pages/memory/memory-setting/index.tsx` | `/memory/memory-setting/:id` |
| `src/pages/user-setting/setting-model/index.tsx` | `/user-setting/model` |
| `src/pages/user-setting/profile/index.tsx` | `/user-setting/profile` |
| `src/pages/user-setting/setting-team/index.tsx` | `/user-setting/team` |
| `src/pages/user-setting/mcp/index.tsx` | `/user-setting/mcp` |
| `src/pages/user-setting/setting-api/index.tsx` | `/user-setting/api` |
| `src/pages/user-setting/data-source/index.tsx` | `/user-setting/data-source` |

---

## 十、改动时的一致性检查原则

### 改一处必须看大一级

每次修改某个维度（颜色/圆角/背景/尺寸），必须向上看一级容器、向旁看同级兄弟模块：
- 改了卡片背景色 → 检查整个列表页背景是否还有层次感
- 改了 sidebar 背景 → 检查右侧内容区和页面底色是否形成三层纵深
- 改了组件颜色 Token → 检查 light/dark 两套主题下是否都可见
- 改了间距/padding → 检查空态（无数据）时是否有大面积留白

### 颜色调整后必须验证的场景
1. 有数据时 vs 无数据时（Table/卡片列表）
2. Light 模式 vs Dark 模式
3. 激活态 vs 默认态 vs hover 态
4. 父容器背景变了，子组件的颜色对比度是否还够

### 状态指示元素规范

状态指示灯（Dot）、进度标记、在线/离线标识等：
- 尺寸：**最小 `size-2.5`（10px）**，不能用 `size-1`（4px 几乎不可见）
- 形状：**`rounded-full`**（圆形），不用 `rounded`（正方形）
- 颜色：必须用 CSS Token，不硬编码：
  - 成功/完成：`rgba(var(--state-success))`
  - 运行中：`var(--team-member)`（蓝色）
  - 警告/取消：`rgba(var(--state-warning))`
  - 错误：`rgba(var(--state-error))`
  - 未开始：`rgba(var(--accent-primary))`

涉及文件：
- `src/pages/dataset/dataset/parsing-card.tsx` — 解析状态 Dot
- `src/pages/dataset/dataset/parsing-status-cell.tsx` — 解析操作区
- `src/pages/dataset/dataset/constant.ts` — `RunningStatusMap` 颜色定义

---

## 十一、纵深感实战检查清单

> 每次接手一个页面/模块改动时，先过这份清单，5 分钟内识别所有纵深问题。

### A. 逐层确认色差链

从最外层往内检查，每层必须有色差：

```
✅ 正确：bg-app-page → (gap-3) → bg-bg-base → (gap-3) → bg-bg-component
✅ 正确：bg-app-page → bg-bg-base（卡片托盘）→ bg-surface-raised → hover:bg-surface-floating
❌ 错误：bg-app-page → bg-app-page（同色，无层次）
❌ 错误：bg-bg-base 内部使用 bg-app-page 做卡片，视觉上像挖空到页面背景
❌ 错误：bg-white 硬编码（主题切换失效）
❌ 错误：bg-background / bg-muted（禁用 shadcn token）
```

**快速检查命令**：grep 当前文件里的 `bg-` 类，确认没有：
- `bg-white` / `bg-black` 硬编码
- `bg-background` / `bg-muted` / `bg-foreground`（禁用）
- 相邻两块同色（如 `bg-bg-base` 紧挨 `bg-bg-base` 无 gap）

---

### B. 识别"线框表达"并替换

凡是看到以下 class，立即用色差替代：

| 线框写法 | 替换方案 |
|---------|---------|
| `border border-border-button` 做容器轮廓 | 改为 `bg-bg-base rounded-3xl`，外层有 `bg-app-page` 即产生色差 |
| `border-b-0.5` / `border-t-0.5` 做区域分隔 | 删掉，上下区域各自有背景色 + `gap` 自然区分 |
| `border-r-0.5` / `divide-x` 做列分隔 | 左列 `bg-bg-base`，右列 `bg-bg-component`，用 `gap-3` 露出底色 |
| `shadow-sm` / `shadow-md` 做容器轮廓感 | 删掉，背景色差本身就是轮廓 |
| `rounded-lg` 用于页面级容器 | 改为 `rounded-3xl` |
| `rounded-md` 用于只读字段展示框 | 改为 `bg-bg-card rounded-xl`，删掉 border |

---

### C. 确认 PageHeader 统一使用

所有有面包屑的页面，面包屑行必须用 `<PageHeader>` 组件，不要裸 `<div className="px-6 pt-4 pb-2">`。

`PageHeader` 已固定 `px-5 py-3`，这是全局统一值。

```tsx
// ✅ 正确
<PageHeader>
  <Breadcrumb>…</Breadcrumb>
</PageHeader>

// ❌ 错误
<div className="px-6 pt-4 pb-2">
  <Breadcrumb>…</Breadcrumb>
</div>
```

---

### D. 确认顶层容器结构完整

每个路由页面的根元素必须有完整的三要素：

```tsx
// 列表页
<article className="size-full flex flex-col bg-app-page">

// 详情页（有 sidebar）
<section className="size-full flex flex-col bg-app-page">
  <PageHeader>…</PageHeader>
  <div className="flex flex-1 min-h-0 gap-3 px-3 pb-3">
    <aside className="… bg-bg-component rounded-3xl shrink-0">…</aside>
    <div className="flex-1 min-w-0 bg-bg-base rounded-3xl overflow-hidden">…</div>
  </div>
</section>

// 全屏内容页（无 sidebar，如 agent-log-page）
<div className="size-full flex flex-col bg-app-page">
  <PageHeader>…</PageHeader>
  <div className="flex-1 min-h-0 mx-3 mb-3 bg-bg-base rounded-3xl overflow-hidden flex flex-col">
    …
  </div>
</div>
```

缺少 `bg-app-page` = 页面底色丢失，色差链断裂。
缺少 `bg-bg-base rounded-3xl` 内容区 = 内容漂浮在底色上，无卡片感。

---

### E. 禁用 token 速查

遇到这些 class，立刻替换，不管是谁写的：

| 禁用 | 替换 |
|-----|------|
| `text-white` | `text-bg-base`（深色背景上）或 `text-text-primary` |
| `text-foreground` | `text-text-primary` |
| `text-muted-foreground` | `text-text-secondary` |
| `bg-background` | `bg-bg-base` |
| `bg-foreground` | 根据语义用 `bg-accent-primary` 或 `bg-text-primary` |
| `bg-muted` | `bg-bg-card` |
| `bg-muted/50` | `bg-bg-card/50` |
| `hover:bg-muted/50` | `hover:bg-bg-card` |
| `shadow-sm` 做容器轮廓 | 删掉 |
| `border-0.5 border-border-button` 做卡片外框 | `bg-bg-base rounded-3xl`（父层有底色差即可） |

---

### F. 嵌套 Card 反模式

Card 套透明 Card 是常见结构冗余，会导致 padding 叠加和 DOM 层级混乱：

```tsx
// ❌ 反模式：透明 Card 套在 Card 里
<Card className="bg-bg-base rounded-3xl">
  <CardContent className="p-0">
    <Card className="bg-transparent flex-1">        // ← 多余的透明层
      <CardHeader className="p-5">…</CardHeader>
      <CardContent className="flex-1 p-0">…</CardContent>
    </Card>
  </CardContent>
</Card>

// ✅ 正确：直接用 div 构建内部结构
<div className="flex-1 bg-bg-base rounded-3xl overflow-hidden flex flex-col">
  <div className="px-5 py-4 flex justify-between items-center">…</div>
  <div className="flex-1 min-h-0">…</div>
</div>
```

---

### G. 列表页 header 间距统一

所有列表页（datasets/agents/memories/searches/files）的 header 间距统一为：

```
px-6 pt-4 pb-4
```

不用 `pt-6`（过高，显得头重脚轻）。

---

### H. user-setting 页面统一结构

所有 `/user-setting/*` 子页面使用统一的 `UserSettingPageWrapper` 包裹：

```tsx
<UserSettingPageWrapper>          // bg-app-page flex flex-col size-full
  <UserSettingBreadcrumb label="页面名称" />   // PageHeader + 单级标题
  <div className="flex-1 min-h-0 mx-3 mb-3 flex flex-col">
    <ProfileSettingWrapperCard header={…}>   // bg-bg-base rounded-3xl
      …
    </ProfileSettingWrapperCard>
  </div>
</UserSettingPageWrapper>
```

- `UserSettingBreadcrumb` 只显示当前页名称，无"设置"根节点
- 内容区包装 div 需有 `flex flex-col` 才能让 `ProfileSettingWrapperCard` 的 `h-full` 生效
