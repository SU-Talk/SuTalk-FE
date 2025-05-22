// watch-uploads.cjs

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const uploadsDir = path.join(__dirname, "public/uploads");
const thumbnailsDir = path.join(uploadsDir, "thumbnails");

if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}

console.log("👀 이미지 업로드 폴더 감시 시작...");

fs.watch(uploadsDir, (eventType, filename) => {
  if (!filename.endsWith(".png")) return;
  if (filename.startsWith("thumb_")) return;

  const inputPath = path.join(uploadsDir, filename);
  const outputPath = path.join(thumbnailsDir, `thumb_${filename}`);

  // 썸네일이 이미 있으면 건너뜀
  if (fs.existsSync(outputPath)) return;

  // 약간의 딜레이 주고 생성 (파일 write 중간에 실행 방지용)
  setTimeout(() => {
    sharp(inputPath)
      .resize({ width: 300 })
      .toFile(outputPath)
      .then(() =>
        console.log(`✅ 썸네일 생성 완료: ${path.basename(outputPath)}`)
      )
      .catch((err) =>
        console.error(`❌ 썸네일 생성 실패: ${filename}`, err.message)
      );
  }, 500); // 0.5초 딜레이
});
