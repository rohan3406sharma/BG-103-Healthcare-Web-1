const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const c = require('../controllers/mainController');

// Auth
router.post('/auth/register', c.register);
router.post('/auth/login', c.login);

// Profile
router.get('/profile', authMiddleware, c.getProfile);
router.put('/profile', authMiddleware, c.updateProfile);
router.put('/profile/password', authMiddleware, c.updatePassword);
router.delete('/profile', authMiddleware, c.deleteProfile);

// Appointments
router.get('/appointments', authMiddleware, c.getAppointments);
router.post('/appointments', authMiddleware, c.createAppointment);
router.put('/appointments/:id', authMiddleware, c.updateAppointment);
router.delete('/appointments/:id', authMiddleware, c.deleteAppointment);

// Prescriptions & Reports
router.get('/prescriptions', authMiddleware, c.getPrescriptions);
router.get('/lab-reports', authMiddleware, c.getLabReports);
router.get('/reports', authMiddleware, c.getLabReports);

// Dashboard
router.get('/dashboard', authMiddleware, c.getDashboard);

// --- ADDITIONAL UI TABS MOCKS ---
router.get('/doctors', c.getDoctors);
router.get('/doctors/specialties', c.getSpecialties);
router.get('/doctors/:id', c.getDoctorById);

router.get('/records', authMiddleware, c.getRecords);
router.post('/records', authMiddleware, c.createRecord);
router.get('/records/:id', authMiddleware, c.getRecordById);
router.delete('/records/:id', authMiddleware, c.deleteRecord);

router.get('/prescriptions', authMiddleware, c.getPrescriptions);
router.post('/prescriptions', authMiddleware, c.createPrescription);
router.get('/prescriptions/:id', authMiddleware, c.getPrescriptionById);

router.get('/lab-reports', authMiddleware, c.getLabReports);
router.get('/lab-reports/:id', authMiddleware, c.getLabReportById);
router.post('/lab-reports', authMiddleware, c.createLabReport);

router.get('/medicines', c.getMedicines);
router.get('/orders', authMiddleware, c.getOrders);
router.post('/orders', authMiddleware, c.createOrder);

router.get('/bills', authMiddleware, c.getBills);
router.get('/bills/:id', authMiddleware, c.getBillById);
router.post('/bills', authMiddleware, c.createBill);
router.post('/bills/:id/pay', authMiddleware, c.payBill);

router.get('/notifications', authMiddleware, c.getNotifications);

router.get('/emergency/contacts', authMiddleware, c.getEmergencyContacts);
router.post('/emergency/contacts', authMiddleware, c.createEmergencyContact);
router.post('/emergency/sos', authMiddleware, c.sendSOS);

module.exports = router;
