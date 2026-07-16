# StrawDesk CRM - Full-Stack Support Ticketing System

A functional, high-performance, enterprise-grade customer support management system designed to triage, track, and log technical customer tickets. Built end-to-end to satisfy the core and extended criteria for the Datastraw Intern Technical Assessment[cite: 1].

## 🔗 Live Deployments & Deliverables
* Production Frontend Web App: [INSERT YOUR LIVE VERCEL URL HERE][cite: 1]
* Production Backend API Endpoints: [INSERT YOUR LIVE RAILWAY URL HERE][cite: 1]
* Technical Video Walkthrough (3-5 Mins): [INSERT YOUR YOUTUBE/LOOM VIDEO LINK HERE][cite: 1]

---

## 🏗️ Technical Architecture & Stack Choices

The application implements a decoupled, modern architecture optimized for speed, explicit data validation, and responsive state management:

* Backend Tier: Built with Python & FastAPI due to its asynchronous execution performance, automatic OpenAPI documentation, and robust request filtering using Pydantic schemas[cite: 1].
* Database Infrastructure: PostgreSQL linked using SQLAlchemy ORM. The relational model utilizes an internal auto-increment index for optimized foreign-key join constraints, while exposing a clean string business identifier (TKT-XXX) to clients[cite: 1].
* Frontend Interface: Engineered on Next.js 15 (App Router) and styled using Tailwind CSS. State handlers leverage micro-debouncing (250ms delay windows) to prevent network query flooding during live search actions[cite: 1].

---

## 💎 Advanced Features Beyond Expectations

Exceeding the baseline project requirements, the following enterprise-focused features were custom layered into the client application:
1. ⚡ Quick Action Macro Templates: Support agents can instantly click pre-defined templates (+ Request Logs, + Escalate) to auto-populate the internal timeline log text field, standardizing agent workflows.
2. 📊 Relational Audit Metadata Badges: The ticket detail page computes client-side state mapping over relational data arrays to display the total number of notes and real-time operational counts on dashboard metrics cards.
3. 📥 Client-Side CSV Data Exporter: Integrated a zero-dependency streaming exporter that reads active filtered state rows and generates structured downloadable .csv data sheets for data administration.

---

## 🛠️ Complete Local Setup Instructions

Follow these steps to run the complete workspace locally on your system:

### 1. Clone the Workspace
git clone https://github.com/Soham14-2005/support-crm-fullstack.git
cd support-crm-fullstack

### 2. Configure & Boot the FastAPI Backend API
cd support-crm-backend
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\activate

# Install required modules
pip install -r requirements.txt

# Run the live reload development server
uvicorn app.main:app --reload

*The API interface will initialize locally on http://127.0.0.1:8000.*

### 3. Configure & Boot the Next.js Client Portal
Open a new terminal window in the root space:
cd support-crm-frontend
npm install
npm run dev

*The web portal interface will initialize locally on http://localhost:3000.*

---

## 📐 Unified Database Diagram
The relational schema uses 2 optimized tables mapped out inside PostgreSQL[cite: 1]:

### tickets Table
* id (BigInteger, Primary Key)[cite: 1]
* ticket_id (String, Unique Index, format: TKT-00X)[cite: 1]
* customer_name (String)[cite: 1]
* customer_email (String)[cite: 1]
* subject (String)[cite: 1]
* description (Text)[cite: 1]
* status (String: Open / In Progress / Closed)[cite: 1]
* created_at / updated_at (Timestamp)[cite: 1]

### notes Table
* id (BigInteger, Primary Key)[cite: 1]
* ticket_id (String, Foreign Key pointing to tickets.ticket_id)[cite: 1]
* note_text (Text)[cite: 1]
* created_at (Timestamp)[cite: 1]
