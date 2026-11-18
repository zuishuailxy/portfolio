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
  "leo-api":        { image: "", video: "", embed: "", caption: "" }
};

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
    const buildGallery = () => {
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
          if (g.caption) fig.appendChild(makeCaption(g.caption));
          grid.appendChild(fig);
        });
        return grid;
      }
      if (item.image && !item.embed && !item.video) {
        const figure = document.createElement("figure");
        figure.className = "media-figure";
        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.caption || "项目架构图或界面截图";
        img.loading = "lazy";
        figure.appendChild(img);
        if (item.caption) figure.appendChild(makeCaption(item.caption));
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
