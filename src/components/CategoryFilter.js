import React, { useState, useEffect } from "react";
import { getCategories } from "../utils/api";

const CategoryFilter = ({ onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  const handleCategoryChange = (category) => {
    let updatedCategories = [...selectedCategories];
    if (updatedCategories.includes(category)) {
      updatedCategories = updatedCategories.filter((c) => c !== category);
    } else {
      updatedCategories.push(category);
    }
    setSelectedCategories(updatedCategories);
    onFilterChange(updatedCategories);
  };

  return (
    <div>
      <h4>Select Categories</h4>
      {categories.map((category) => (
        <label key={category} style={{ marginRight: "10px" }}>
          <input
            type="checkbox"
            value={category}
            onChange={() => handleCategoryChange(category)}
          />{" "}
          {category}
        </label>
      ))}
    </div>
  );
};

export default CategoryFilter;
