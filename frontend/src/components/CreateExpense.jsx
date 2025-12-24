import React from 'react';

const CreateExpense = ({ createExpense }) => {
    return (
        <div className="create-expense-container">
            <h4>Create expense</h4>

            <form onSubmit={createExpense}>
                <input name="name" placeholder="Name" />
                <input name="price" placeholder="Price" />
                <input name="date" type="date" placeholder="Date"/>
                <button type="submit">Create</button>
            </form>
        </div>
    );
}

export default CreateExpense;