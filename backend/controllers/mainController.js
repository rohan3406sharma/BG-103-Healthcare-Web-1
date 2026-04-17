const { User, Appointment, Prescription, LabReport, Doctor, Specialty, Medicine, Order, Bill, Notification, EmergencyContact, Record } = require('../models/db');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, dob, blood_group, gender } = req.body;
    if (!email || !password || !name) return res.status(400).json({ message: 'Missing required fields' });
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });
    
    user = await User.create({ name, email, password, phone, dob, blood_group, gender });
    
    const token = jwt.sign({ id: user._id }, 'hackathon_secret', { expiresIn: '1h' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email }});
  } catch(err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) return res.status(400).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user._id }, 'hackathon_secret', { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, blood_group: user.blood_group, gender: user.gender }});
  } catch(err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch(err) { res.status(500).json({ message: 'Server error' }); }
};

exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body);
    res.json(updatedUser);
  } catch(err) { res.status(500).json({ message: 'Server error' }); }
};

exports.getAppointments = async (req, res) => {
  try {
    let apps = await Appointment.find({ userId: req.user.id });
    if (req.query.status) {
      const qs = req.query.status.toLowerCase();
      if (qs === 'upcoming') apps = apps.filter(a => a.status === 'Upcoming');
      else if (qs === 'cancelled') apps = apps.filter(a => a.status === 'Cancelled');
      else if (qs === 'past') apps = apps.filter(a => a.status === 'Completed' || a.status === 'Past');
    }
    res.json(apps);
  } catch(err) { res.status(500).json({ message: 'Server error' }); }
};

exports.createAppointment = async (req, res) => {
  try {
    const { doctor_id, date, time, reason, type } = req.body;
    const doc = await Doctor.findById(doctor_id);
    const doctor_name = doc ? doc.name : 'Unknown Doctor';
    const specialty = doc ? doc.specialty : 'General';
    
    const appt = await Appointment.create({ userId: req.user.id, doctor_id, doctor_name, date, time, reason, type, specialty, status: 'Upcoming' });
    res.status(201).json(appt);
  } catch(err) { res.status(500).json({ message: 'Server error' }); }
};

exports.updateAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(req.params.id, req.body);
    res.json(appt);
  } catch(err) { res.status(500).json({ message: 'Server error' }); }
};

exports.deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndUpdate(req.params.id, { status: 'Cancelled', cancelled_at: new Date() });
    res.json({ message: 'Appointment marked as cancelled' });
  } catch(err) { res.status(500).json({ message: 'Server error' }); }
};

exports.getPrescriptions = async (req, res) => {
  try {
    const pre = await Prescription.find({ userId: req.user.id });
    res.json(pre);
  } catch(err) { res.status(500).json({ message: 'Server error' }); }
};

exports.getLabReports = async (req, res) => {
  try {
    const rep = await LabReport.find({ userId: req.user.id });
    res.json(rep);
  } catch(err) { res.status(500).json({ message: 'Server error' }); }
};

exports.getDashboard = async (req, res) => {
  try {
    const apps = await Appointment.find({ userId: req.user.id });
    const upApps = apps.filter(a => a.status === 'Upcoming');
    const rx = await Prescription.find({ userId: req.user.id });
    const rep = await LabReport.find({ userId: req.user.id });
    
    const stats = {
      upcoming_appointments: upApps.length,
      active_prescriptions: rx.length,
      lab_reports: rep.length,
      pending_bills: 0
    };
    
    const user = await User.findById(req.user.id) || {};
    
    res.json({
      stats,
      health_summary: {
        blood_pressure: '120/80',
        blood_sugar: '90',
        heart_rate: '72',
        blood_group: user.blood_group || 'O+',
        weight: '70 kg',
        height: '5 ft 9 in'
      },
      upcoming_appointments: upApps,
      active_prescriptions: rx,
      recent_labs: rep
    });
  } catch(err) { res.status(500).json({ message: 'Server error' }); }
};

// --- MOCK ENDPOINTS FOR OTHER TABS ---
exports.getDoctors = async (req, res) => {
  try {
    const { search, specialty, location } = req.query;
    let docs = await Doctor.find({});
    
    if (search) {
      const q = search.toLowerCase();
      docs = docs.filter(d => d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q) || d.tags.some(t => t.toLowerCase().includes(q)));
    }
    if (specialty) {
      docs = docs.filter(d => d.specialty.toLowerCase() === specialty.toLowerCase() || d.specialty === specialty);
    }
    if (location && location !== 'All Locations') {
      const locQ = location.toLowerCase();
      docs = docs.filter(d => d.location.toLowerCase().includes(locQ) || d.availability.toLowerCase().includes(locQ));
    }
    
    res.json(docs);
  } catch(err) { res.status(500).json({ message: 'Server error' }); }
};

exports.getDoctorById = async (req, res) => {
  const doc = await Doctor.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Not found' });
  res.json(doc);
};

exports.getSpecialties = async (req, res) => {
  const specs = await Specialty.find({});
  res.json(specs);
};

exports.getRecords = async (req, res) => {
  const records = await Record.find({ userId: req.user.id });
  res.json(records);
};
exports.createRecord = async (req, res) => {
  const { title, type, date, source, notes, file_name } = req.body;
  const record = await Record.create({ 
    userId: req.user.id, 
    title, type, date, source, notes, file_name, file_url: '#', created_at: new Date()
  });
  res.status(201).json(record);
};
exports.deleteRecord = async (req, res) => {
  await Record.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};

exports.getMedicines = async (req, res) => {
  const { search, category } = req.query;
  let meds = await Medicine.find({});
  if (search) meds = meds.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.generic_name.toLowerCase().includes(search.toLowerCase()));
  if (category) meds = meds.filter(m => m.category === category);
  res.json(meds);
};

exports.getOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user.id });
  res.json(orders);
};

exports.createOrder = async (req, res) => {
  try {
    const { items, address, payment_method } = req.body;
    let total = 0;
    let item_count = 0;
    
    // Calculate accurate prices
    for (const item of items) {
      const med = await Medicine.findById(item.medicine_id);
      if (med) {
        total += (med.price * item.qty);
      }
      item_count += item.qty;
    }
    
    const order = await Order.create({ 
      userId: req.user.id, 
      items, address, payment_method, 
      total, item_count, 
      status: 'Processing',
      created_at: new Date()
    });
    
    res.status(201).json({ message: 'Order created', order_id: order.id });
  } catch(err) { res.status(500).json({ message: 'Order failed' }); }
};

exports.getBills = async (req, res) => {
  const bills = await Bill.find({ userId: req.user.id });
  res.json(bills);
};
exports.payBill = async (req, res) => {
  const bill = await Bill.findByIdAndUpdate(req.params.id, { status: 'Paid' });
  res.json({ message: 'Bill paid successfully' });
};

exports.getNotifications = async (req, res) => {
  const notifications = await Notification.find({ userId: req.user.id });
  res.json(notifications);
};

exports.getEmergencyContacts = async (req, res) => {
  const contacts = await EmergencyContact.find({ userId: req.user.id });
  res.json(contacts);
};

exports.createEmergencyContact = async (req, res) => {
  const { name, relation, phone, is_primary } = req.body;
  const contact = await EmergencyContact.create({ userId: req.user.id, name, relation, phone, is_primary });
  res.status(201).json(contact);
};

exports.sendSOS = async (req, res) => res.json({ message: 'SOS Alert dispatched automatically to contacts!' });
