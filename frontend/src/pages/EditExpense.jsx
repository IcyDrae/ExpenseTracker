import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import "./Dashboard.css";

const EditExpense = () => {
    const { id } = useParams();
    const [name, setName] = useState(location.state?.name ?? "");
    const [price, setPrice] = useState(location.state?.price ?? "");
    const [date, setDate] = useState(location.state?.date ?? "");
    const [categories, setCategories] = useState([]); // all categories
    const [selectedCategoryId, setSelectedCategoryId] = useState(""); // selected category

    useEffect(() => {
        axios.get(`http://localhost:3000/api/expense/${id}`, { withCredentials: true })
            .then((response) => {
                setName(response.data.name);
                setPrice(response.data.price);
                setDate(response.data.date);

                const categoryId = response.data.categories?.[0]?.id;
                setSelectedCategoryId(categoryId ? String(categoryId) : "");

                console.log("Fetched expense data:", response.data);
            })
            .catch((error) => {
                console.error("Error fetching expenses data:", error);
            });

        // fetch all categories
        axios.get("http://localhost:3000/api/category", { withCredentials: true })
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
        });
    }, [id]);

    function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const name = formData.get("name");
        const price = formData.get("price");
        const date = formData.get("date");

        if (name == "") {
            alert("Name is required");
            return;
        }

        const priceNumber = Number(price);
        if (!price || isNaN(priceNumber) || priceNumber <= 0) {
            alert("Price is required and should be a number");
            return;
        }

        axios
            .put(`http://localhost:3000/api/expense/${id}`, {
                name,
                price,
                date,
                categoryId: selectedCategoryId ? Number(selectedCategoryId) : null
            }, {
                withCredentials: true
            })
            .then(() => {
                alert("Expense updated");
            })
            .catch((error) => {
                alert("Update failed" + error);
        });
    }

    return (
        <div className="dashboard-container">
            <h3 className="dashboard-header">Edit expense "{ name }".</h3>

            <div className="create-expense-container">
                <form onSubmit={handleSubmit}>
                    <input
                        value={name}
                        placeholder="Name"
                        name="name"
                        onChange={e => setName(e.target.value)}
                    />
                    <input
                        value={price}
                        placeholder="Price"
                        name="price"
                        onChange={e => setPrice(e.target.value)}
                    />
                    <input
                        value={date}
                        type="date"
                        placeholder="Date"
                        name="date"
                        onChange={e => setDate(e.target.value)}
                    />

                    <select
                        value={selectedCategoryId ?? ""}
                        onChange={e => setSelectedCategoryId(e.target.value)}
                    >
                        {selectedCategoryId === "" && (
                            <option value="">Select category</option>
                        )}
                        {categories.map(cat => (
                            <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                        ))}
                    </select>

                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
    );
};

export default EditExpense;
