import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import "./Dashboard.css";

const EditExpense = () => {
    const { id } = useParams();
    const [name, setName] = useState(location.state?.name ?? "");
    const [price, setPrice] = useState(location.state?.price ?? "");

    useEffect(() => {
        axios.get(`http://localhost:3000/api/expense/${id}`, { withCredentials: true })
            .then((response) => {
                setName(response.data.name);
                setPrice(response.data.price);
            })
            .catch((error) => {
                console.error("Error fetching expenses data:", error);
            });
    }, [id]);

    function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(event.target);
        const name = formData.get("name");
        const price = formData.get("price");

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
                price
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
                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
    );
};

export default EditExpense;
