/* 李晓阳 · 作品集脚本
   ① 按 MEDIA 配置挂载图片 / 视频 ② 页脚年份 ③ 滚动动效 / 阅读进度条
   无素材的项目会把整个媒体块移除，页面不留空框、不放假占位图。
   视频优先用外链；本地小体积演示视频（<1MB）可放 assets/showcase。 */

// 先标记 JS 可用：CSS 里的 .js .reveal 才会生效；
// JS 被拦时 .reveal 不隐藏，正文照常可见（求职站不能因动效丢内容）。
document.documentElement.classList.add("js");

const MEDIA = {
  "my-rag": {
    video: "assets/showcase/my-rag-demo.mp4",
    gallery: [
      { src: "assets/showcase/my-rag-chat-process.webp", caption: "检索过程：意图识别 → 知识库检索 → 图谱查询 → 检索评估" },
      { src: "assets/showcase/my-rag-chat-answer.webp", caption: "回答正文带 [n] 引用角标，下方引用卡可回溯原文分片" },
      { src: "assets/showcase/my-rag-documents.webp", caption: "文档管理：列表只展示当前账号可见（公开 / 团队 / 自有）的文档" }
    ],
    caption: "真实演示环境录屏与界面截图（演示语料，非生产数据）"
  },
  "tiny-claw": {
    video: "assets/showcase/tiny-claw-demo.mp4",
    gallery: [
      { src: "assets/showcase/tiny-claw-architecture.webp", caption: "四层架构：上下文工程 / 核心引擎 / 工具与执行 / 入口交互" }
    ],
    videoFirst: false,   // 先给架构图，再放终端演示录屏
    caption: "真实运行录屏（日志回放）：8 轮工具调用、失败重试、人工审批边界；演示语料"
  },
  "student-admin": {
    video: "assets/showcase/student-admin-demo.mp4",
    gallery: [
      { src: "assets/showcase/student-admin-dashboard.webp", caption: "管理员工作台：逾期跟进优先、今日试听排期，一眼看清待办" },
      { src: "assets/showcase/student-admin-students.webp", caption: "学生列表：全局可读、按负责人隔离写权限，状态与待跟进一目了然" },
      { src: "assets/showcase/student-admin-detail.webp", caption: "学生详情：时间线 + AI 试听摘要（确定性降级），顾问跟进有据可依" },
      { src: "assets/showcase/student-admin-teacher.webp", caption: "老师工作台：只看自己的试听安排与待提交结果" },
      { src: "assets/showcase/student-admin-result.webp", caption: "试听结果：出勤、参与度、反馈与 AI 摘要沉淀，形成跟进话术" }
    ],
    caption: "线上演示环境录屏与界面截图（seed 演示数据，非真实学员信息）"
  },
  "leo-api":        { image: "", video: "", embed: "", caption: "" },
  "local-asr": {
    video: "assets/showcase/asr-demo.mp4",
    gallery: [
      { src: "assets/showcase/asr-result.webp", caption: "上传识别：状态流水线走到「完成」，输出识别文本、语言、音频时长与处理耗时" },
      { src: "assets/showcase/asr-upload.webp", caption: "初始界面：语言选择、麦克风录音与上传入口，模型准备完成后全程离线" }
    ],
    caption: "真实运行录屏与界面截图（示例音频，非真实用户数据）"
  },
  "book-agents": {
    gallery: [
      { src: "assets/showcase/agent-pipeline.webp", caption: "运行仪表盘：32/100 章定稿、23.7 万字、平均审校分 89.2，章节表含状态 / 轮次 / 得分 / 细纲 / 摘要" }
    ],
    caption: "多 Agent 流水线运行界面（本地 Web UI）"
  }
};

/* 图片放大灯箱：点击截图放大到接近原图，支持左右切换 / Esc / 点击遮罩关闭 */
function openLightbox(src, caption, gallery, index) {
  let box = document.getElementById("lightbox");
  if (!box) {
    box = document.createElement("div");
    box.id = "lightbox";
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.innerHTML =
      '<button class="lb-close" type="button" aria-label="关闭">×</button>' +
      '<button class="lb-nav lb-prev" type="button" aria-label="上一张">‹</button>' +
      '<figure class="lb-figure"><img class="lb-img" alt=""><figcaption class="lb-cap"></figcaption></figure>' +
      '<button class="lb-nav lb-next" type="button" aria-label="下一张">›</button>';
    document.body.appendChild(box);

    const close = () => { box.classList.remove("open"); document.body.style.overflow = ""; };
    box.addEventListener("click", (e) => { if (e.target === box) close(); });
    box.querySelector(".lb-close").addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
      if (!box.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") box.querySelector(".lb-prev").click();
      if (e.key === "ArrowRight") box.querySelector(".lb-next").click();
    });
  }

  const hasNav = Array.isArray(gallery) && gallery.length > 1;
  const img = box.querySelector(".lb-img");
  const cap = box.querySelector(".lb-cap");
  const prev = box.querySelector(".lb-prev");
  const next = box.querySelector(".lb-next");
  let cur = index || 0;

  const show = (i) => {
    cur = (i + gallery.length) % gallery.length;
    const g = gallery[cur];
    img.src = g.src;
    img.alt = g.caption || "项目界面截图";
    cap.textContent = g.caption || "";
  };
  if (hasNav) {
    img.src = gallery[cur].src;
    img.alt = gallery[cur].caption || "项目界面截图";
    cap.textContent = gallery[cur].caption || "";
    prev.style.display = ""; next.style.display = "";
    const prevHandler = () => show(cur - 1);
    const nextHandler = () => show(cur + 1);
    prev.onclick = prevHandler; next.onclick = nextHandler;
  } else {
    img.src = src; img.alt = caption; cap.textContent = caption;
    prev.style.display = "none"; next.style.display = "none";
  }
  box.classList.add("open");
  document.body.style.overflow = "hidden";
}

function renderMedia() {
  const makeCaption = (text) => {
    const cap = document.createElement("figcaption");
    cap.textContent = text;
    return cap;
  };

  document.querySelectorAll(".media-slot").forEach((slot) => {
    const key = slot.dataset.media;
    const item = MEDIA[key];
    const hasGallery = item && Array.isArray(item.gallery) && item.gallery.length > 0;
    if (!item || (!item.image && !item.video && !item.embed && !hasGallery)) {
      slot.remove();
      return;
    }

    // 视频块（含 iframe 外链）
    const buildVideo = () => {
      if (!item.embed && !item.video) return null;
      const figure = document.createElement("figure");
      figure.className = "media-figure";
      if (item.embed) {
        const frame = document.createElement("iframe");
        frame.src = item.embed;
        frame.title = item.caption || "项目演示视频";
        frame.loading = "lazy";
        frame.referrerPolicy = "strict-origin-when-cross-origin";
        frame.allow = "fullscreen; picture-in-picture";
        frame.setAttribute("allowfullscreen", "");
        figure.appendChild(frame);
      } else {
        const video = document.createElement("video");
        video.src = item.video;
        video.controls = true;
        video.preload = "metadata";
        video.playsInline = true;
        // 封面：显式 image 才用；gallery 图比例未必适合，默认不拿来当 poster
        if (item.image) video.poster = item.image;
        video.setAttribute("aria-label", item.caption || "项目演示录屏");
        figure.appendChild(video);
      }
      if (item.caption) figure.appendChild(makeCaption(item.caption));
      return figure;
    };

    // 图片块：多图画廊 / 单图（旧格式）
    // 第一张作主图常显，其余折叠；所有图点击可放大
    const buildGallery = () => {
      if (hasGallery) {
        const wrap = document.createElement("div");
        wrap.className = "media-gallery";

        const makeFig = (g, idx) => {
          const fig = document.createElement("figure");
          fig.className = "media-figure zoomable";
          fig.tabIndex = 0;
          fig.setAttribute("role", "button");
          fig.setAttribute("aria-label", (g.caption || "项目界面截图") + "（点击放大）");
          const img = document.createElement("img");
          img.src = g.src;
          img.alt = g.caption || "项目界面截图";
          img.loading = idx === 0 ? "eager" : "lazy";
          fig.appendChild(img);
          if (g.caption) fig.appendChild(makeCaption(g.caption));
          // 点击 / 回车放大
          const open = () => openLightbox(g.src, g.caption || "项目界面截图", item.gallery, idx);
          fig.addEventListener("click", open);
          fig.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
          });
          return fig;
        };

        if (item.gallery.length === 1) {
          wrap.appendChild(makeFig(item.gallery[0], 0));
          return wrap;
        }

        // 主图常显
        wrap.appendChild(makeFig(item.gallery[0], 0));
        // 其余折叠
        const details = document.createElement("details");
        details.className = "gallery-more";
        const summary = document.createElement("summary");
        summary.textContent = "展开查看其余 " + (item.gallery.length - 1) + " 张截图 ▾";
        details.appendChild(summary);
        const rest = document.createElement("div");
        rest.className = "media-gallery gallery-rest";
        item.gallery.slice(1).forEach((g, i) => rest.appendChild(makeFig(g, i + 1)));
        details.appendChild(rest);
        wrap.appendChild(details);
        return wrap;
      }
      if (item.image && !item.embed && !item.video) {
        const figure = document.createElement("figure");
        figure.className = "media-figure zoomable";
        figure.tabIndex = 0;
        figure.setAttribute("role", "button");
        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.caption || "项目架构图或界面截图";
        img.loading = "lazy";
        figure.appendChild(img);
        if (item.caption) figure.appendChild(makeCaption(item.caption));
        const open = () => openLightbox(item.image, item.caption || "项目架构图", null, 0);
        figure.addEventListener("click", open);
        figure.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
        });
        return figure;
      }
      return null;
    };

    // 默认视频在前；videoFirst:false 时图在前（如 tiny-claw 先给架构图）
    const videoBlock = buildVideo();
    const galleryBlock = buildGallery();
    if (item.videoFirst === false) {
      if (galleryBlock) slot.appendChild(galleryBlock);
      if (videoBlock) slot.appendChild(videoBlock);
    } else {
      if (videoBlock) slot.appendChild(videoBlock);
      if (galleryBlock) slot.appendChild(galleryBlock);
    }
  });
}

renderMedia();

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* ===== 滚动动效：进入视口淡入 + 顶部阅读进度条 ===== */
(function setupMotion() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals = Array.from(document.querySelectorAll(".reveal"));

  if (reduce || !("IntersectionObserver" in window)) {
    // 减动偏好或不支持：直接全部显示，不做位移动画
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    // 只用 rootMargin 提前触发，threshold=0 只要沾到视口就显示；
    // 高卡片（数千 px）用 threshold>0 会因始终达不到比例而卡住不触发。
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px 5% 0px", threshold: 0 });
    reveals.forEach((el) => io.observe(el));

    // 兜底保险：3 秒后任何仍未触发的 reveal 无条件显示。
    // 求职站绝不能因动效让内容永久隐藏（锚点跳转/长截图/异常布局都测过）。
    window.setTimeout(() => {
      reveals.forEach((el) => el.classList.add("is-visible"));
    }, 3000);
  }

  // 顶部阅读进度条（用 requestAnimationFrame 节流）
  const bar = document.getElementById("readProgress");
  if (!bar) return;
  let ticking = false;
  const update = () => {
    const h = document.documentElement;
    const scrollable = h.scrollHeight - h.clientHeight;
    const pct = scrollable > 0 ? (h.scrollTop / scrollable) * 100 : 0;
    bar.style.width = pct + "%";
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();
