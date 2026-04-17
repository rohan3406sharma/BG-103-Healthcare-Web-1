# 🏥 MediConnect: Comprehensive Patient Portal

A full-stack, scalable Healthtech platform built for hackathons. MediConnect provides patients with an intuitive interface to manage their healthcare ecosystem—from booking doctor appointments to tracking complex medical records and pharmacy orders.

## ✨ Features

- **🔐 Secure Authentication**: JWT-based login and registration securely gating sensitive medical information.
- **👨‍⚕️ Intelligent Doctor Search**: Advanced robust filtering allowing patients to dynamically search for doctors by specialty, location, or name (integrated Indian-subcontinent demographic data).
- **📅 Appointment Management**: Full CRUD capability enabling patients to Book, Views, Reschedule, or securely Soft-Delete (Cancel) clinical appointments.
- **💊 Pharmacy E-Commerce**: Seamlessly browse local medicine generic inventory, place digital orders, and dynamically parse carts into database models without timeouts.
- **📁 Medical Record Tracking**: Direct upload in terface allowing patients to digitally capture and parse historic Lab Reports and documents directly into their profiles.

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla CSS3, Vanilla JavaScript (DOM specific)
- **Backend Framework**: Node.js & Express.js server mapping RESTful APIs.
- **Database Engine**: Custom architecture heavily mimicking **Mongoose/MongoDB**. Specifically built as an "In-Memory Simulation" database to ensure flawless offline hackathon demonstrations, while supporting absolute ease-of-migration to an actual remote MongoDB Atlas cluster.
- **Security & Networking**: Built-in generic routing wrappers mapping endpoints through JWT-validated Custom Middleware components.

## 🚀 Local Development Setup

To run this application locally on your machine for a demonstration:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/YourUsername/Healthtech-Web-1-main.git
   cd Healthtech-Web-1-main
   ```

2. **Start the Backend Server**
   ```bash
   cd backend
   npm install
   node server.js
   ```
   *The backend will initialize and launch actively on `http://localhost:3000`.*

3. **Start the Frontend UI**
   - You can securely view the project straight from `Healthtech-Web-1-main/index.html` by opening it natively in your browser.
   - For an optimal localized development experience, host it using a simple Live Server extension in VS Code.

## 📁 System Architecture

```text
├── 📂 Healthtech-Web-1-main/    # Frontend UI Tier
│   ├── css/                    # Modular Style structure
│   ├── js/                     # Component hooks mapping Frontend payload formatting to backend APIs
│   └── *.html                  # Interface views
└── 📂 backend/                  # RESTful API Tier
    ├── controllers/            # Business validation logic mapping endpoints to database events
    ├── middleware/             # Security routing for encrypted Token Validation
    ├── models/                 # Database structure models replicating Mongoose schemas
    ├── routes/                 # Consolidated routing mapping logic arrays
    └── server.js               # Primary Express bootloader handling CORS & JSON environments
```

## 🤝 Contribution Strategy
Built with a strong MVC separation architecture. All incoming data structures securely map against `ModelMock` schemas ensuring generic injection handling for scalable medical expansion mapping.
