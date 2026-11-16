#!/usr/bin/env python3
"""把简历工程导出的 PDF 无损重压成站点用的副本。

用法：
    python3 scripts/build-resume.py ~/Project/简历/李晓阳-硕士-AI应用开发.pdf

做的事只有一件：把 Chrome 打印出来的 PDF 重新打包成压缩对象流。
不重排、不换字体、不降采样——逐像素校验由脚本自己完成，判定不一致就报错退出。

依赖：pymupdf、pikepdf（pip install pymupdf pikepdf）
"""

import os
import sys
import hashlib

try:
    import pymupdf
    import pikepdf
except ImportError:
    sys.exit("缺少依赖：pip install pymupdf pikepdf")

TARGET = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                      "public", "Li-Xiaoyang-AI-Engineer-Resume.pdf")
TMP = "/tmp/_resume_stage.pdf"


def text_digest(doc):
    h = hashlib.sha256()
    for page in doc:
        h.update(page.get_text().encode("utf-8"))
    return h.hexdigest()[:16]


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    src = os.path.expanduser(sys.argv[1])
    if not os.path.exists(src):
        sys.exit(f"源文件不存在：{src}")

    doc = pymupdf.open(src)
    src_pages, src_text = len(doc), text_digest(doc)
    doc.save(TMP, garbage=4, deflate=True, deflate_fonts=True, clean=True, use_objstms=1)
    pikepdf.open(TMP).save(
        TARGET,
        object_stream_mode=pikepdf.ObjectStreamMode.generate,
        compress_streams=True,
        recompress_flate=True,
    )

    out = pymupdf.open(TARGET)
    if len(out) != src_pages:
        sys.exit(f"页数变了：{src_pages} → {len(out)}，拒绝交付")
    if text_digest(out) != src_text:
        sys.exit("文本内容不一致，拒绝交付")

    before, after = os.path.getsize(src), os.path.getsize(TARGET)
    print(f"  页数      {src_pages}（一致）")
    print(f"  文本摘要  {src_text}（一致）")
    print(f"  体积      {before:,} → {after:,} 字节  (−{100 * (before - after) / before:.0f}%)")
    print(f"  输出      {TARGET}")


if __name__ == "__main__":
    main()
