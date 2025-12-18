import React from 'react';

function ExpensesList({ expenses, handleEdit, handleDelete }) {
    return (
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
    );
}

export default ExpensesList;