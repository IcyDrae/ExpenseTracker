import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./Dashboard.css";
import ExpensesList from '../components/ExpensesList';
import CreateExpense from '../components/CreateExpense';
import Categories from '../components/Categories';

const Dashboard = () => {
    const [expenses, setExpenses] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const navigate = useNavigate();

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
            .post("http://localhost:3000/api/expense", {
                name: name,
                price: price,
                date: date
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
        navigate(`/expense/${expenseId}/edit`);
    }

    function handleDelete(expenseId) {
        const confirmed = window.confirm("Are you sure you want to delete this expense?");
        if (!confirmed) {
            return;
        }

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

    const filteredExpenses = selectedCategoryId
        ? expenses.filter(expense =>
            expense.categories?.some(cat => cat.id === selectedCategoryId)
            )
        : expenses;

     const total = filteredExpenses.reduce(
            (sum, expense) => sum + Number(expense.price),
            0);

    return (
        <div className="dashboard-container">
            <h3 className="dashboard-header">Welcome to your dashboard! Here you can track your expenses.</h3>

            <CreateExpense
                createExpense={ createExpense }
            />

            <Categories
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
            />

            <ExpensesList
                expenses={filteredExpenses}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                total={total}
            />
        </div>
    );
};

export default Dashboard;
