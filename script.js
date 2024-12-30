// Get references to DOM elements
const expenseForm = document.getElementById("expenseForm");
const expenseTableBody = document.getElementById("expenseTableBody");
const downloadCSV = document.getElementById("downloadCSV");
const editExpenseForm = document.getElementById("editExpenseForm");

let expenses = [];
let currentEditIndex = null;

// Load expenses from localStorage on page load
document.addEventListener("DOMContentLoaded", loadExpensesFromLocalStorage);

// Save expenses to localStorage
function saveExpensesToLocalStorage() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Load expenses from localStorage
function loadExpensesFromLocalStorage() {
    const storedExpenses = localStorage.getItem("expenses");
    if (storedExpenses) {
        expenses = JSON.parse(storedExpenses);
        updateExpenseTable();
    }
}

// Add a new expense
expenseForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const date = document.getElementById("expenseDate").value;
    const amount = document.getElementById("expenseAmount").value;
    const currency = document.getElementById("expenseCurrency").value;
    const category = document.getElementById("expenseCategory").value;
    const note = document.getElementById("expenseNote").value;

    const expense = { date, amount, currency, category, note };
    expenses.push(expense);

    updateExpenseTable();
    saveExpensesToLocalStorage();
    expenseForm.reset();
});

// Update the expense table
function updateExpenseTable() {
    expenseTableBody.innerHTML = "";

    expenses.forEach((expense, index) => {
        const row = `
            <tr>
                <td>${expense.date}</td>
                <td>${expense.amount} ${expense.currency}</td>
                <td>${expense.currency}</td>
                <td>${expense.category}</td>
                <td>${expense.note}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="openEditModal(${index})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteExpense(${index})">Delete</button>
                </td>
            </tr>
        `;
        expenseTableBody.innerHTML += row;
    });
}


// Delete an expense
function deleteExpense(index) {
    expenses.splice(index, 1);
    updateExpenseTable();
    saveExpensesToLocalStorage();
}

// Open the edit modal
function openEditModal(index) {
    currentEditIndex = index;
    const expense = expenses[index];

    document.getElementById("editExpenseDate").value = expense.date;
    document.getElementById("editExpenseAmount").value = expense.amount;
    document.getElementById("editExpenseCurrency").value = expense.currency;
    document.getElementById("editExpenseCategory").value = expense.category;
    document.getElementById("editExpenseNote").value = expense.note;

    $('#editExpenseModal').modal('show');
}

// Update an expense
editExpenseForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const updatedExpense = {
        date: document.getElementById("editExpenseDate").value,
        amount: document.getElementById("editExpenseAmount").value,
        currency: document.getElementById("editExpenseCurrency").value,
        category: document.getElementById("editExpenseCategory").value,
        note: document.getElementById("editExpenseNote").value,
    };

    expenses[currentEditIndex] = updatedExpense;
    updateExpenseTable();
    saveExpensesToLocalStorage();

    $('#editExpenseModal').modal('hide');
});

// Download expenses as CSV
downloadCSV.addEventListener("click", function () {
    let csvContent = "data:text/csv;charset=utf-8,Date,Amount,Currency,Category,Description\n";

    expenses.forEach(expense => {
        csvContent += `${expense.date},${expense.amount},${expense.currency},${expense.category},${expense.note}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
