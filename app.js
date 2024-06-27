const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://Krishna031298:Krishna031298@cluster0.iraa17l.mongodb.net/employeeDb?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define the Employee Schema
const employeeSchema = new mongoose.Schema({
    name: String,
    position: String,
    department: String,
    salary: Number
});

const Employee = mongoose.model('Employee', employeeSchema);

// Routes

// Get all employees
app.get('/api/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get a single employee by ID
app.get('/api/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        res.json(employee);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Add a new employee
app.post('/api/employees', async (req, res) => {
    try {
        const newEmployee = new Employee(req.body);
        const savedEmployee = await newEmployee.save();
        res.json(savedEmployee);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update an existing employee
app.put('/api/employees/:id', async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedEmployee);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Delete an employee
app.delete('/api/employees/:id', async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.json({ message: 'Employee deleted' });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});