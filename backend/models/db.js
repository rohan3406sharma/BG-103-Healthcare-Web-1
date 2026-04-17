// In-memory Database mock - structured to be easily replacable with Mongoose/MongoDB

const data = {
  users: [],
  appointments: [],
  prescriptions: [],
  reports: [],
  doctors: [],
  specialties: [],
  medicines: [],
  orders: [],
  bills: [],
  notifications: [],
  emergencyContacts: [],
  records: []
};

// Auto-increment ID helpers
const getNextId = (collection) => {
  if (data[collection].length === 0) return 1;
  const ids = data[collection].map(item => item.id || item._id);
  return Math.max(...ids) + 1;
};

class ModelMock {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  async find(query = {}) {
    let result = data[this.collectionName];
    // Simple mock filter
    for (const key in query) {
      if (query.hasOwnProperty(key)) {
        result = result.filter(item => item[key] == query[key]);
      }
    }
    return result;
  }

  async findById(id) {
    return data[this.collectionName].find(item => item._id == id || item.id == id);
  }

  async findOne(query) {
    const results = await this.find(query);
    return results[0] || null;
  }

  async create(payload) {
    const nextId = getNextId(this.collectionName).toString();
    const newItem = { _id: nextId, id: nextId, ...payload, createdAt: new Date() };
    data[this.collectionName].push(newItem);
    return newItem;
  }

  async findByIdAndUpdate(id, payload, options = {}) {
    const index = data[this.collectionName].findIndex(item => item._id == id || item.id == id);
    if (index === -1) return null;
    data[this.collectionName][index] = { ...data[this.collectionName][index], ...payload, updatedAt: new Date() };
    return data[this.collectionName][index];
  }

  async findByIdAndDelete(id) {
    const index = data[this.collectionName].findIndex(item => item._id == id || item.id == id);
    if (index === -1) return null;
    const deletedItem = data[this.collectionName][index];
    data[this.collectionName].splice(index, 1);
    return deletedItem;
  }
}

module.exports = {
  User: new ModelMock('users'),
  Appointment: new ModelMock('appointments'),
  Prescription: new ModelMock('prescriptions'),
  LabReport: new ModelMock('reports'),
  Doctor: new ModelMock('doctors'),
  Specialty: new ModelMock('specialties'),
  Medicine: new ModelMock('medicines'),
  Order: new ModelMock('orders'),
  Bill: new ModelMock('bills'),
  Notification: new ModelMock('notifications'),
  EmergencyContact: new ModelMock('emergencyContacts'),
  Record: new ModelMock('records'),
  
  // method to seed some initial data
  seedInitialData: async () => {
    // 1. Seed Specialties
    data.specialties = [
      { id: '1', name: 'Cardiology' }, { id: '2', name: 'Neurology' }, 
      { id: '3', name: 'Pediatrics' }, { id: '4', name: 'Orthopedics' }, 
      { id: '5', name: 'Dermatology' }, { id: '6', name: 'General Physician' },
      { id: '7', name: 'Gynaecology' }, { id: '8', name: 'Psychiatry' }
    ];

    // 2. Seed Doctors (Indian Context)
    data.doctors = [
      { id: '101', name: 'Dr. Rajesh Kumar', specialty: 'Cardiology', experience: 15, rating: 4.8, fee: 1200, location: 'Apollo Hospital, Delhi', availability: 'Mon-Sat', tags: ['Cardiology', 'Heart Surgeon'] },
      { id: '102', name: 'Dr. Sunita Sharma', specialty: 'Pediatrics', experience: 10, rating: 4.9, fee: 800, location: 'Fortis Hospital, Mumbai', availability: 'Mon-Fri', tags: ['Pediatrics', 'Child Specialist'] },
      { id: '103', name: 'Dr. Anil Gupta', specialty: 'Neurology', experience: 12, rating: 4.7, fee: 1500, location: 'AIIMS, New Delhi', availability: 'Tue-Sun', tags: ['Neurology', 'Brain Specialist'] },
      { id: '104', name: 'Dr. Vikram Singh', specialty: 'Orthopedics', experience: 20, rating: 4.6, fee: 1000, location: 'Medanta, Gurugram', availability: 'Mon-Sat', tags: ['Orthopedics', 'Bone Specialist'] },
      { id: '105', name: 'Dr. Anjali Desai', specialty: 'Dermatology', experience: 8, rating: 4.5, fee: 700, location: 'Nanavati Hospital, Mumbai', availability: 'Wed-Sun', tags: ['Dermatology', 'Skin Specialist'] },
      { id: '106', name: 'Dr. Meera Reddy', specialty: 'Gynaecology', experience: 18, rating: 4.9, fee: 1100, location: 'Care Hospitals, Hyderabad', availability: 'Mon-Fri', tags: ['Gynaecology', 'Women Health'] },
      { id: '107', name: 'Dr. Suresh Patel', specialty: 'General Physician', experience: 5, rating: 4.4, fee: 400, location: 'City Clinic, Ahmedabad', availability: 'Daily', tags: ['General Physician', 'Fever'] },
      { id: '108', name: 'Dr. Priya Mehta', specialty: 'Psychiatry', experience: 14, rating: 4.8, fee: 1500, location: 'Manipal Hospital, Bangalore', availability: 'Thu-Tue', tags: ['Psychiatry', 'Mental Health'] }
    ];

    // 3. Seed Medicines (Indian Pharmacies)
    data.medicines = [
      { id: '201', name: 'Dolo 650', generic_name: 'Paracetamol', dosage_form: 'Tablet', price: 30, in_stock: true, category: 'Painkillers' },
      { id: '202', name: 'Calpol 500', generic_name: 'Paracetamol', dosage_form: 'Tablet', price: 15, in_stock: true, category: 'Painkillers' },
      { id: '203', name: 'Azithral 500', generic_name: 'Azithromycin', dosage_form: 'Tablet', price: 110, in_stock: true, category: 'Antibiotics' },
      { id: '204', name: 'Allegra 120mg', generic_name: 'Fexofenadine', dosage_form: 'Tablet', price: 180, in_stock: true, category: 'Antihistamines' },
      { id: '205', name: 'Digene', generic_name: 'Antacid', dosage_form: 'Syrup', price: 150, in_stock: true, category: 'Antacids' },
      { id: '206', name: 'Becosules', generic_name: 'Vitamin B Complex', dosage_form: 'Capsule', price: 45, in_stock: true, category: 'Vitamins' },
      { id: '207', name: 'Glycomet 500', generic_name: 'Metformin', dosage_form: 'Tablet', price: 60, in_stock: true, category: 'Antidiabetic' },
      { id: '208', name: 'Betadine 10%', generic_name: 'Povidone Iodine', dosage_form: 'Ointment', price: 120, in_stock: true, category: 'Antiseptics' }
    ];

    // No user data means it's clean for their own dashboard.
  }
};
