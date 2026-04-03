"use client";

import { useState, useRef } from "react";

export default function TagInput({ tags = [], onChange, placeholder = "Type and press Enter…" }) {
  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef(null);

  const addTag = () => {
    const trimmed = inputVal.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputVal("");
  };

  const removeTag = (tag) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && !inputVal && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div>
      <div
        className="tag-input"
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <span key={tag} className="tag-input__tag">
            {tag}
            <button
              type="button"
              className="tag-input__remove"
              onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          className="tag-input__field"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={tags.length === 0 ? placeholder : ""}
        />
      </div>
      <p className="tag-input__hint">Press Enter or comma to add · Backspace to remove</p>
    </div>
  );
}
