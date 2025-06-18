// controllers/studentController.js

const Student = require('../models/student');
const syncStudentFromCodeforces = require('../services/codeforcesService');

// 1. Create a new student
const createStudent = async (req, res) => {
  try {
    console.log("inside student controller ");
    
    const { name, email, phone, cfHandle } = req.body;

    const student = await Student.create({
      name,
      email,
      phone,
      cfHandle
    });
    console.log(name);
    console.log("after save inside student controller ");

    
    await syncStudentFromCodeforces(student);
    console.log("after sync inside student controller ");


    res.status(201).json({ success: true, student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// 2. Get all students (for table view)
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// 3. Get one student by ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    res.status(200).json({ success: true, student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// 4. Update student details
const updateStudent = async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Student not found' });

    res.status(200).json({ success: true, student: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// 5. Delete student
const deleteStudent = async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Student not found' });

    res.status(200).json({ success: true, message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// 6. Update CF handle & trigger real-time sync
const updateCFHandle = async (req, res) => {
  try {
    const { cfHandle } = req.body;
    const student = await Student.findById(req.params.id);
    const cf_handle=student.cfHandle;
    if(cf_handle===cfHandle){
      return res.status(200).json({ success: true, message: 'CF Handle is already up-to-date' });
    }
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    student.cfHandle = cfHandle;
    await student.save();

    await syncStudentFromCodeforces(student); // Real-time data fetch

    res.status(200).json({ success: true, message: 'CF Handle updated & synced', student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  updateCFHandle
};
