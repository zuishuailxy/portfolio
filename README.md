# 李晓阳 · 个人作品集

AI 应用开发工程师求职作品集。纯静态站，零构建步骤、零第三方请求（无 Web 字体、无追踪脚本）。
线上地址：<https://li-xiaoyang-portfolio.onrender.com>

## 目录结构

```
public/
  index.html          单页，全部内容
  styles.css          全部样式
  app.js              媒体挂载 + 页脚年份（仅此两件事）
  Li-Xiaoyang-AI-Engineer-Resume.pdf   简历 PDF（构建产物，见下节）
  assets/
    favicon.svg       站点图标（矢量）
    favicon-32.png    32×32 位图图标
    apple-touch-icon.png  180×180，iOS 添加到主屏
    og-cover.png      1200×630 社交分享封面
render.yaml           Render Blueprint（静态站，发布 public/）
scripts/build-resume.py  简历 PDF 无损重压缩（见「简历 PDF 的来源」）
INTERVIEW-NOTES.md   面试话术与取舍判断（本地准备材料，不发布）
```

## 简历 PDF 的来源

`public/Li-Xiaoyang-AI-Engineer-Resume.pdf` **不是这里的源文件**，是构建产物。唯一源头在本地简历工程：

```
~/Project/简历/李晓阳-硕士-AI应用开发.html   ← 源头（Chrome 打印为 A4 PDF）
~/Project/简历/李晓阳-硕士-AI应用开发.pdf    ← 源头 PDF
```

改了简历就先改源头、重新导出，再跑一次构建脚本：

```bash
python3 scripts/build-resume.py ~/Project/简历/李晓阳-硕士-AI应用开发.pdf
```

脚本只做无损重压缩（对象流打包），不重排、不换字体、不降采样，自己会校验页数与逐页文本，
不一致直接报错退出。当前 980,049 → 726,245 字节（−26%）。
原始 PDF 里字体被 Chrome 拆成 9 份 `ArialUnicodeMS` 子集 + 150 个 Type3 合成粗体字形，
这是体积的主要来源；重压缩后 3 页在 150dpi 下与原文件逐像素一致。

> 因为副本被重新打包过，**两者的 sha256 不会相同**，不要用哈希比对判断是否过期，
> 要看页数与「导出的日期 / 内容是否已变」。

> 导出注意：源 HTML 的 `font-family` 是 `"Arial Unicode MS"`。换成 PingFang / Hiragino
> 会把简历从 3 页变成 4 页（字体度量不同），版式会崩，不要换。

## 页面上的数字从哪来

页面每一个数字都必须能在简历 PDF 或项目 README 里找到同一口径的出处。
当前的关键数字与出处：

| 数字 | 含义 | 出处 |
|---|---|---|
| 206 条 | my-rag 离线评测集（检索 148 + 生成 58） | 简历「智能知识库问答系统」段 |
| 19 条 | my-rag 知识图谱专项用例 | 同上 |
| 0.706 → 0.941 | 51 条近义改写难例的 Hit@1 四级消融 | 同上 |
| 265 个 | tiny-claw 单元测试，全部离线可跑 | 简历「自主编码 Agent 运行时」段 |
| 1818 → 1013 | 每轮固定注入 Token（−44%） | 同上 |
| 3.05 → 1.34 | Token 计量估算倍率偏差 | 同上 |
| 21 / 20 / 7 / 300s | 错误码 / 恢复提示 / 高危规则 / 审批超时 | 同上 |
| 20 / 6 / 31 / 14 | student-admin 的 API / 表 / 后端测试 / 决策记录 | 简历「其他开源项目」段 |
| 22 / 10 | leo-api 的数据库迁移 / 模型 | 同上 |

新增数字前先确认能回源，否则不要写进页面。

面试时的回答思路、追问用的边界判断（为什么双路不三路、为什么会冻结查询向量等）
放在 [`INTERVIEW-NOTES.md`](INTERVIEW-NOTES.md)。那是本地准备材料，不发布到作品页——
公开页面只展示可验证事实，不展示话术。

## 本地预览

```bash
cd public && python3 -m http.server 8899
# 打开 http://127.0.0.1:8899/
```

不要直接双击 `index.html`（`file://` 下的相对路径行为与线上不一致，且无法验证 404）。

## 项目截图 / 录屏怎么加

`app.js` 顶部的 `MEDIA` 对象控制四个项目卡片的媒体位：

```js
const MEDIA = {
  "my-rag": { image: "assets/my-rag-arch.webp", video: "", embed: "", caption: "检索链路架构图" },
  // ...
};
```

- `image`：放 `public/assets/`，WebP，单张 < 300 KB，宽度 ≥ 1200px
- `video`：直链 `.mp4` / `.webm`，**不要提交进 Git**，用外链
- `embed`：B 站 `player.bilibili.com/...` 之类 iframe 地址
- 三个都为空时，整个媒体块会被移除，页面不留空框（CSS 侧 `.media-slot:empty` 也做了兜底）

## 部署

Render Blueprint，`runtime: static`，发布目录 `public/`，无构建命令。
推送到 `main` 自动部署。

## 已经验证过的事

- 320 / 390 / 768 / 1440 四个视口无横向溢出
- 配色对比度全部 ≥ 4.5:1（WCAG AA）
- 外链均带 `rel="noopener noreferrer"`
- 无第三方字体与追踪脚本
