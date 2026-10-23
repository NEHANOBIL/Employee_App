
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

// Task1: initiate app and run server at 3000
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'dist/Frontend')));

// Task2: create MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err.message));

// Employee schema
const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    position: { type: String, required: true },
    salary: { type: Number, required: true }
});

const Employee = mongoose.model('Employee', employeeSchema);

// GET: get all employee data
app.get('/api/employeelist', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving employees', error: err.message });
    }
});

// GET: get single employee by ID
app.get('/api/employeelist/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid employee ID' });
        }

        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving employee', error: err.message });
    }
});

// POST: add a new employee
app.post('/api/employeelist', async (req, res) => {
    try {
        const { name, location, position, salary } = req.body;

        const employee = await Employee.create({
            name,
            location,
            position,
            salary
        });

        res.status(201).json(employee);
    } catch (err) {
        res.status(400).json({ message: 'Error adding employee', error: err.message });
    }
});

// DELETE: delete an employee by ID
app.delete('/api/employeelist/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid employee ID' });
        }

        const employee = await Employee.findByIdAndDelete(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting employee', error: err.message });
    }
});

// PUT: update an employee
app.put('/api/employeelist', async (req, res) => {
    try {
        const { id, _id, name, location, position, salary } = req.body;
        const employeeId = id || _id;

        if (!employeeId || !mongoose.isValidObjectId(employeeId)) {
            return res.status(400).json({ message: 'Valid employee ID is required' });
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeId,
            { name, location, position, salary },
            { new: true, runValidators: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json(updatedEmployee);
    } catch (err) {
        res.status(400).json({ message: 'Error updating employee', error: err.message });
    }
});

// Do not delete this code. It connects the frontend file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});

// Start server at port 3000
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});




