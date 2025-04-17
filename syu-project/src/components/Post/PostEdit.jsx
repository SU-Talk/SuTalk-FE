import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Post.css";

const PostEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { postData: initialData } = location.state || {};

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    category: initialData?.category || "",
    price: initialData?.price || "",
    description: initialData?.comment || "",
    location: initialData?.location || "",
    images: initialData?.images || [],
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 5) {
      alert("최대 5개의 이미지만 업로드할 수 있습니다.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        ...files.map((file) => URL.createObjectURL(file)),
      ],
    }));
  };

  const handleDeleteImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.category || !formData.price) {
      alert("제목, 카테고리, 가격은 필수 입력 항목입니다.");
      return;
    }
    alert("게시글이 수정되었습니다!");
    navigate(`/post/${initialData.id}`); // 상세 페이지로 이동
  };

  return (
    <div className="post-container">
      <header className="post-header">
        <button className="close-button" onClick={() => navigate(-1)}>
          &lt;
        </button>
        <h3>게시글 수정</h3>
      </header>

      <div className="image-upload">
        <div className="image-preview">
          {formData.images.map((img, index) => (
            <div key={index} className="image-item">
              <img src={img} alt={`미리보기 ${index + 1}`} />
              <button
                className="delete-image-button"
                onClick={() => handleDeleteImage(index)}>
                ×
              </button>
            </div>
          ))}
          <label htmlFor="image-input" className="image-label">
            <span>📷</span> {formData.images.length}/5
          </label>
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
          }>
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
          type="text"
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
          }></textarea>

        <input
          type="text"
          placeholder="거래 희망 장소"
          value={formData.location}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, location: e.target.value }))
          }
        />

        <button type="button" className="submit-button" onClick={handleSubmit}>
          수정 완료
        </button>
      </form>
    </div>
  );
};

export default PostEdit;
