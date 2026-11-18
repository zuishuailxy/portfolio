/* 李晓阳 · 作品集脚本
   只做两件事：① 按 MEDIA 配置挂载图片 / 视频 ② 页脚年份。
   没有素材的项目会把整个媒体块移除，页面不留空框、不放假占位图。
   视频优先用外链；本地小体积演示视频（<1MB）可放 assets/showcase。 */

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
  "tiny-claw":      { image: "", video: "", embed: "", caption: "" },
  "student-admin":  { image: "", video: "", embed: "", caption: "" },
  "leo-api":        { image: "", video: "", embed: "", caption: "" }
};

function renderMedia() {
  document.querySelectorAll(".media-slot").forEach((slot) => {
    const key = slot.dataset.media;
    const item = MEDIA[key];
    const hasGallery = item && Array.isArray(item.gallery) && item.gallery.length > 0;
    if (!item || (!item.image && !item.video && !item.embed && !hasGallery)) {
      slot.remove();
      return;
    }

    // 视频优先（带封面用 image 或 gallery 第一张做 poster）
    if (item.embed || item.video) {
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
        const poster = item.image || (hasGallery ? item.gallery[0].src : "");
        if (poster) video.poster = poster;
        video.setAttribute("aria-label", item.caption || "项目演示录屏");
        figure.appendChild(video);
      }
      if (item.caption) {
        const cap = document.createElement("figcaption");
        cap.textContent = item.caption;
        figure.appendChild(cap);
      }
      slot.appendChild(figure);
    }

    // 多图画廊
    if (hasGallery) {
      const grid = document.createElement("div");
      grid.className = "media-gallery";
      item.gallery.forEach((g) => {
        const fig = document.createElement("figure");
        fig.className = "media-figure";
        const img = document.createElement("img");
        img.src = g.src;
        img.alt = g.caption || "项目界面截图";
        img.loading = "lazy";
        fig.appendChild(img);
        if (g.caption) {
          const cap = document.createElement("figcaption");
          cap.textContent = g.caption;
          fig.appendChild(cap);
        }
        grid.appendChild(fig);
      });
      slot.appendChild(grid);
    } else if (!item.embed && !item.video && item.image) {
      // 单图（旧格式兼容）
      const figure = document.createElement("figure");
      figure.className = "media-figure";
      const img = document.createElement("img");
      img.src = item.image;
      img.alt = item.caption || "项目架构图或界面截图";
      img.loading = "lazy";
      figure.appendChild(img);
      if (item.caption) {
        const cap = document.createElement("figcaption");
        cap.textContent = item.caption;
        figure.appendChild(cap);
      }
      slot.appendChild(figure);
    }
  });
}

renderMedia();

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());
