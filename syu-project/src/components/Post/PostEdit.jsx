import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Post.css";

const PostEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { postData: initialData } = location.state || {};

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    category: initialData?.category || "",
    price: initialData?.price || "",
    description: initialData?.description || "",
    location: initialData?.location || "",
    images: [], // 이미지 미리보기용 URL 저장
    imageFiles: [], // 실제 전송용 File 객체 저장
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 5) {
      alert("최대 5개의 이미지만 업로드할 수 있습니다.");
      return;
    }

    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...previewUrls],
      imageFiles: [...prev.imageFiles, ...files],
    }));
  };

  const handleDeleteImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newImageFiles = formData.imageFiles.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      images: newImages,
      imageFiles: newImageFiles,
    }));
  };

  const handleSubmit = async () => {
    alert("✅ 작성 완료 버튼 클릭됨!");
    console.log("🧪 handleSubmit 실행됨!");

    try {
      const itemData = {
        title: formData.title,
        category: formData.category,
        price: Number(formData.price),
        description: formData.description,
        meetLocation: formData.location,
        sellerId: "test-user-001",
        itemImages: [],
      };

      const requestForm = new FormData();
      requestForm.append(
        "item",
        new Blob([JSON.stringify(itemData)], { type: "application/json" })
      );
      formData.imageFiles.forEach((file) => requestForm.append("images", file));

      const response = await axios.post("http://localhost:8080/api/items", requestForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ 등록 응답:", response.data);
      alert("게시글이 작성되었습니다!");
      navigate(`/post/${response.data.itemid}`);
    } catch (error) {
      console.error("❌ 등록 중 에러 발생:", error);
      console.log("🔍 error.response:", error.response);
      alert("에러가 발생했어요. 콘솔 확인 부탁!");
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

      <div className="image-upload">
        <div className="image-preview">
          {formData.images.map((img, index) => (
            <div key={index} className="image-item">
              <img src={img} alt={`미리보기 ${index + 1}`} />
              <button
                className="delete-image-button"
                onClick={() => handleDeleteImage(index)}
              >
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

        <button type="button" className="submit-button" onClick={handleSubmit}>
          작성 완료
        </button>
      </form>
    </div>
  );
};

export default PostEdit;
