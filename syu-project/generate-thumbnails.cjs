// generate-thumbnails.js

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const uploadsDir = path.join(__dirname, "public/uploads");
const thumbnailsDir = path.join(uploadsDir, "thumbnails");

// thumbnails 디렉토리 없으면 생성
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}

// uploads 내 모든 PNG 파일 가져오기
fs.readdir(uploadsDir, (err, files) => {
  if (err) {
    console.error("❌ 이미지 읽기 실패:", err);
    return;
  }

  const imageFiles = files.filter(
    (file) => file.endsWith(".png") && !file.startsWith("thumb_")
  );

  imageFiles.forEach((file) => {
    const inputPath = path.join(uploadsDir, file);
    const outputPath = path.join(thumbnailsDir, `thumb_${file}`);

    sharp(inputPath)
      .resize({ width: 300 }) // ✅ 원하는 썸네일 너비
      .toFile(outputPath)
      .then(() => console.log(`✅ 생성 완료: ${outputPath}`))
      .catch((err) => console.error(`❌ ${file} 변환 실패:`, err));
  });
});
