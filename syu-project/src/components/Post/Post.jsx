import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Post.css";

const Post = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    description: "",
    location: "",
    images: [], // File 객체 배열
    previews: [], // 미리보기용 Object URL 배열
  });

  // ✅ 이미지 업로드 핸들러
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + formData.images.length > 5) {
      alert("최대 5개의 이미지만 업로드할 수 있습니다.");
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
      previews: [...prev.previews, ...newPreviews],
    }));
  };

  // ✅ 이미지 삭제 핸들러
  const handleDeleteImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = formData.previews.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      images: newImages,
      previews: newPreviews,
    }));
  };

  // ✅ 게시글 제출
  const handleSubmit = async () => {
    const { title, category, price } = formData;
    if (!title || !category || !price) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    const senderId = localStorage.getItem("senderId");
    if (!senderId) {
      alert("로그인 정보가 없습니다.");
      return;
    }

    const data = new FormData();
    data.append(
      "item",
      new Blob(
        [
          JSON.stringify({
            title: formData.title,
            category: formData.category,
            price: formData.price,
            description: formData.description,
            meetLocation: formData.location,
            sellerId: senderId,
          }),
        ],
        { type: "application/json" }
      )
    );

    formData.images.forEach((file) => data.append("images", file));

    try {
      const response = await axios.post("/api/items", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status !== 200) throw new Error("서버 오류");

      alert("게시글이 작성되었습니다!");
      navigate(-1);
    } catch (error) {
      console.error("❌ 게시글 작성 실패:", error);
      alert("게시글 작성에 실패했습니다.");
    }
  };

  return (
    <div className="post-container">
      <header className="post-header">
        <button className="close-button" onClick={() => navigate(-1)}>
          &lt;
        </button>
        <h3>글쓰기</h3>
      </header>

      {/* ✅ 이미지 업로드 섹션 */}
      <div className="image-upload">
        <div className="image-preview">
          {formData.previews.map((preview, index) => (
            <div key={index} className="image-item">
              <img src={preview} alt={`미리보기 ${index + 1}`} />
              <button
                className="delete-image-button"
                onClick={() => handleDeleteImage(index)}
              >
                ×
              </button>
            </div>
          ))}
          {formData.images.length < 5 && (
            <label htmlFor="image-input" className="image-label">
              <span>📷</span> {formData.images.length}/5
            </label>
          )}
        </div>
        <input
          type="file"
          id="image-input"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
      </div>

      {/* ✅ 게시글 폼 입력 */}
      <form className="post-form">
        <input
          type="text"
          placeholder="제목"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
        />

        <select
          className="category-select"
          value={formData.category}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, category: e.target.value }))
          }
        >
          <option value="" disabled>
            카테고리 선택
          </option>
          {[
            "전자제품",
            "가구",
            "의류",
            "도서",
            "생활용품",
            "스포츠/레저",
            "기타",
          ].map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="가격 (원)"
          value={formData.price}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, price: e.target.value }))
          }
        />

        <textarea
          placeholder="자세한 설명"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
        ></textarea>

        <input
          type="text"
          placeholder="거래 희망 장소"
          value={formData.location}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, location: e.target.value }))
          }
        />

        <button
          type="button"
          className="submit-button"
          onClick={handleSubmit}
        >
          작성 완료
        </button>
      </form>
    </div>
  );
};

export default Post;
