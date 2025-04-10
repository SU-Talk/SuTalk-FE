import React, { useState } from "react";
import "./Post.css";

const Post = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState([]);

  // 미리 정의된 카테고리 목록
  const categories = [
    "전자제품",
    "가구",
    "의류",
    "도서",
    "생활용품",
    "스포츠/레저",
    "기타",
  ];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      alert("최대 5개의 이미지만 업로드할 수 있습니다.");
      return;
    }
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleSubmit = () => {
    if (!title || !category || !price || !description || !location) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    alert("게시글이 작성되었습니다!");
    // 서버로 데이터 전송 로직 추가
  };

  return (
    <div className="post-container">
      <header className="post-header">
        <button className="close-button">×</button>
        <h3>글쓰기</h3>
        <button className="save-button">임시 저장</button>
      </header>
      <div className="image-upload">
        <label htmlFor="image-input" className="image-label">
          <span>📷</span>
          {images.length}/5
        </label>
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="category-select">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}>
            <option value="" disabled>
              카테고리
            </option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          placeholder="---원"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <textarea
          placeholder="자세한 설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}></textarea>
        <input
          type="text"
          placeholder="거래 희망 장소"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button type="button" className="submit-button" onClick={handleSubmit}>
          작성 완료
        </button>
      </form>
    </div>
  );
};

export default Post;
