import { React, useState, useEffect } from 'react';
import "./Categories.css";
import "../pages/Dashboard.css";

const Categories = ({ onSelectCategory, selectedCategoryId }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/api/category", { credentials: 'include' })
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error("Error fetching categories data:", error));
    }, []);

    return (
        <div className="categories-container">
            <button
                onClick={() => onSelectCategory(null)}
                className={!selectedCategoryId ? "active" : ""}
            >
                All
            </button>
            {categories.map(category => (
                <button
                    key={category.id}
                    onClick={() => onSelectCategory(category.id)}
                    className={selectedCategoryId === category.id ? "active" : ""}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
};

export default Categories;
