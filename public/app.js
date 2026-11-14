/* 李晓阳 · 作品集脚本
   只做两件事：① 按 MEDIA 配置挂载图片 / 视频 ② 页脚年份。
   没有素材的项目会把整个媒体块移除，页面不留空框、不放假占位图。
   ⚠️ 视频建议用外链（B 站 / 对象存储），不要把 mp4 放进 Git 仓库。 */

const MEDIA = {
  "my-rag": {
    image: "",       // 例："assets/my-rag-arch.webp"
    video: "",       // 例：直链 .mp4 / .webm
    embed: "",       // 例：B 站 iframe 地址（player.bilibili.com/...）
    caption: ""      // 例："检索链路架构图 / 演示录屏"
  },
  "tiny-claw":      { image: "", video: "", embed: "", caption: "" },
  "student-admin":  { image: "", video: "", embed: "", caption: "" },
  "leo-api":        { image: "", video: "", embed: "", caption: "" }
};

function renderMedia() {
  document.querySelectorAll(".media-slot").forEach((slot) => {
    const key = slot.dataset.media;
    const item = MEDIA[key];
    if (!item || (!item.image && !item.video && !item.embed)) {
      slot.remove();
      return;
    }

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
    } else if (item.video) {
      const video = document.createElement("video");
      video.src = item.video;
      video.controls = true;
      video.preload = "metadata";
      video.playsInline = true;
      if (item.image) video.poster = item.image;
      figure.appendChild(video);
    } else if (item.image) {
      const img = document.createElement("img");
      img.src = item.image;
      img.alt = item.caption || "项目架构图或界面截图";
      img.loading = "lazy";
      figure.appendChild(img);
    }

    if (item.caption) {
      const cap = document.createElement("figcaption");
      cap.textContent = item.caption;
      figure.appendChild(cap);
    }
    slot.appendChild(figure);
  });
}

renderMedia();

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());
