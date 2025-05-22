import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Post.css";

const PostEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { postData: initialData } = location.state || {};
  const isEditMode = !!initialData;

  const [imageFiles, setImageFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    category: initialData?.category || "",
    price: initialData?.price || "",
    description: initialData?.description || "",
    location: initialData?.meetLocation || "",
    images: initialData?.itemImages?.map((img) =>`/uploads/thumbnails/thumb_${img.split("/").pop()}`) || [],
  });

  const previews = useMemo(() => {
    return [...formData.images, ...imageFiles.map(file => URL.createObjectURL(file))];
  }, [formData.images, imageFiles]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previews.length > 5) {
      alert("최대 5개의 이미지만 업로드할 수 있습니다.");
      return;
    }
    setImageFiles((prev) => [...prev, ...files]);
  };

  const handleDeleteImage = (index) => {
    const newImages = previews.filter((_, i) => i !== index);
    const newImageFiles = imageFiles.filter((_, i) => i !== index - formData.images.length);
    setFormData((prev) => ({ ...prev, images: newImages.slice(0, formData.images.length) }));
    setImageFiles(newImageFiles);
  };

  const handleSubmit = async () => {
    const sellerId = localStorage.getItem("senderId");
    if (!sellerId) {
      alert("로그인 정보가 없습니다.");
      return;
    }

    const itemData = {
      title: formData.title,
      category: formData.category,
      price: Number(formData.price),
      description: formData.description,
      meetLocation: formData.location,
      sellerId,
    };

    const requestForm = new FormData();
    requestForm.append("item", new Blob([JSON.stringify(itemData)], { type: "application/json" }));
    imageFiles.forEach((file) => requestForm.append("images", file));

    try {
      let response;
      if (isEditMode) {
        response = await axios.put(
          `http://localhost:8080/api/items/${initialData.itemid}`,
          requestForm,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("게시글이 수정되었습니다!");
      } else {
        response = await axios.post("/api/items", requestForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("게시글이 작성되었습니다!");
      }

      navigate(`/post/${response.data.itemid}`);
    } catch (error) {
      console.error("❌ 저장 중 에러 발생:", error);
      alert("에러가 발생했어요. 콘솔을 확인해주세요.");
    }
  };

  return (
    <div className="post-container">
      <header className="post-header">
        <button className="close-button" onClick={() => navigate(-1)}>
          &lt;
        </button>
        <h3>{isEditMode ? "게시글 수정" : "글쓰기"}</h3>
      </header>

      <div className="image-upload">
        <div className="image-preview">
          {previews.map((img, index) => (
            <div key={index} className="image-item">
              <img loading="lazy" src={img} alt={`미리보기 ${index + 1}`} />
              <button className="delete-image-button" onClick={() => handleDeleteImage(index)}>×</button>
            </div>
          ))}
          {previews.length < 5 && (
            <label htmlFor="image-input" className="image-label">
              <span>📷</span> {previews.length}/5
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

      <form className="post-form">
        <input type="text" placeholder="제목" value={formData.title} onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))} />
        <select className="category-select" value={formData.category} onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}>
          <option value="" disabled>카테고리 선택</option>
          {["전자제품", "가구", "의류", "도서", "생활용품", "스포츠/레저", "기타"].map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
        <input type="number" placeholder="가격 (원)" value={formData.price} onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))} />
        <textarea placeholder="자세한 설명" value={formData.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}></textarea>
        <input type="text" placeholder="거래 희망 장소" value={formData.location} onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))} />
        <button type="button" className="submit-button" onClick={handleSubmit}>
          {isEditMode ? "수정 완료" : "작성 완료"}
        </button>
      </form>
    </div>
  );
};

export default PostEdit;
