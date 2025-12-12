import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import "./Dashboard.css";

const Dashboard = () => {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3000/api/expense", { withCredentials: true })
            .then((response) => {
                setExpenses(response.data);
            })
            .catch((error) => {
                console.error("Error fetching expenses data:", error);
        });
    }, []);

    function createExpense(event) {
        event.preventDefault();
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
            .post("http://localhost:3000/api/expense", {
                name: name,
                price: price,
            },
            {
                withCredentials: true
            })
            .then((response) => {
                setExpenses([...expenses, response.data]);
            })
            .catch((error) => {
                alert("Creating expense failed. Please try again." + error);
            });
    }

    function handleEdit(expenseId) {
        // Navigate to edit page
        window.location.href = `/edit-expense/${expenseId}`;
    }

    function handleDelete(expenseId) {
        axios
            .delete(`http://localhost:3000/api/expense/${expenseId}`, {
                withCredentials: true
            })
            .then(() => {
                setExpenses(expenses.filter(expense => expense.id !== expenseId));
            })
            .catch((error) => {
                alert("Deleting expense failed. Please try again." + error);
            });
    }

    return (
        <div className="dashboard-container">
            <h3 className="dashboard-header">Welcome to your dashboard! Here you can track your expenses.</h3>

            <div className="create-expense-container">
                <h4>Create expense</h4>

                <form onSubmit={createExpense}>
                    <input name="name" placeholder="Name" />
                    <input name="price" placeholder="Price" />
                    <button type="submit">Create</button>
                </form>
            </div>

            { expenses?.length === 0 && <p>No expenses found</p> }

            <div className="expenses-list">
                {expenses.map(expense => (
                    <div className="expense-card" key={expense.id}>
                        <p>Name: {expense.name}</p>
                        <p>Price: {expense.price}</p>
                        <p>Date created: {expense.date}</p>
                        <div className="expense-card-buttons">
                            <button onClick={() => handleEdit(expense.id)}>Edit</button>
                            <button onClick={() => handleDelete(expense.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
