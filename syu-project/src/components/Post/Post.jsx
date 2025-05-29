import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Post.css";

const Post = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    description: "",
    location: "",
    images: [],
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 5) {
      alert("최대 5개의 이미지만 업로드할 수 있습니다.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleDeleteImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.category || !formData.price) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    const itemDTO = {
      title: formData.title,
      category: formData.category,
      price: Number(formData.price),
      description: formData.description,
      location: formData.location,
      sellerId: localStorage.getItem("senderId"),
    };

    const fd = new FormData();
    fd.append(
      "item",
      new Blob([JSON.stringify(itemDTO)], { type: "application/json" })
    );
    formData.images.forEach((file) => {
      fd.append("images", file);
    });

    try {
      const response = await fetch("/api/items", {
        method: "POST",
        body: fd,
      });

      if (!response.ok) throw new Error("게시글 등록 실패");
      alert("게시글이 작성되었습니다!");
      navigate(-1);
    } catch (error) {
      alert("게시글 등록 중 오류 발생");
      // console.error(error);
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

      {/* 이미지 업로드 섹션 */}
      <div className="image-upload">
        <div className="image-preview">
          {formData.images.map((file, index) => (
            <div key={index} className="image-item">
              <img
                src={URL.createObjectURL(file)}
                alt={`미리보기 ${index + 1}`}
              />
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

      {/* 게시글 작성 폼 */}
      <form
        className="post-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}>
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

        <button type="submit" className="submit-button">
          작성 완료
        </button>
      </form>
    </div>
  );
};

export default Post;
