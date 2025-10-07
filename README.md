# Splitwise Clone — Expense Sharing Application

A full-stack **expense sharing application** similar to Splitwise. Built with the **MERN stack** (MongoDB, Express, React, Node.js), supporting group management, expense tracking, balance calculations, and settlement optimization.

---

## Table of Contents

- [Overview](#overview)
- [Flow & Functioning](#flow--functioning)
- [Tech Stack](#tech-stack)
- [Project Levels](#project-levels)
  - [Level 1: Basic Expense Tracker](#level-1-basic-expense-tracker)
  - [Level 2: User Authentication & Enhanced Splitting](#level-2-user-authentication--enhanced-splitting)
  - [Level 3: Advanced Group Management & Settlement Optimization](#level-3-advanced-group-management--settlement-optimization)
- [Backend Documentation](#backend-documentation)
  - [Models](#models)
  - [API Endpoints](#api-endpoints)
- [Frontend Documentation](#frontend-documentation)
  - [Pages & Components](#pages--components)
  - [State Management](#state-management)
  - [API Integration](#api-integration)
- [Environment Variables](#environment-variables)
- [Installation & Run](#installation--run)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Testing & Utilities](#testing--utilities)
- [Security & Production Considerations](#security--production-considerations)
- [Future Improvements](#future-improvements)
- [Screenshots](#screenshots)
- [Assessment Structure & Evaluation](#assessment-structure--evaluation)
- [Deployment Links](#deployment-links)

---

## Overview

Splitwise Clone allows users to:

- Track personal and group expenses
- Manage groups and group members
- Calculate balances and settlements
- Suggest minimal transactions to settle debts
- Record manual settlements

The application progressively covers three levels of complexity:

1. **Level 1 (Mandatory):** Basic expense tracker with equal splits  
2. **Level 2 (Optional):** User authentication and enhanced splitting  
3. **Level 3 (Optional):** Group management, unequal/percentage splits, and settlement optimization  

---

## Flow & Functioning

### End-to-End Workflow

1. **User Authentication**  
   Signup/Login → JWT token issued → Access protected routes

2. **Group Management**  
   Create group → Add members → Store group info in DB

3. **Expense Management**  
   Add expense → Specify participants & split type → Store in DB

4. **Balance Calculation**  
   Compute net balance per user → Display balances

5. **Settlement Suggestions**  
   Suggest minimal transactions → Confirm & record settlements → Update balances

6. **Continuous Flow**  
   New expenses automatically update balances and suggested settlements

**Example Flow:**

Signup/Login → Create Group → Add Members → Add Expenses → View Balances → Suggest Settlements → Mark Paid → Updated Balances


## Tech Stack

**Backend:**

- Node.js + Express.js (ESM modules)  
- MongoDB + Mongoose  
- JWT authentication  
- express-validator  
- dotenv, multer, socket.io (optional real-time features)  

**Frontend:**

- React.js (Vite)  
- React Router v6  
- Redux Toolkit  
- Tailwind CSS  
- Axios for API calls  

**Dev Tools:**

- nodemon (backend)  
- Vite (frontend)  
- ESLint  

---

## Project Levels

### Level 1: Basic Expense Tracker (Mandatory)

**Time:** 3–4 hours  

**Backend:**

- **Model:** Expense
```json
{
  "description": "Lunch",
  "amount": 1200,
  "paidBy": "Alice",
  "participants": ["Alice", "Bob"],
  "date": "2025-10-07T00:00:00Z"
}
````

* **Endpoints:**

  * `POST /api/expenses` — Create expense
  * `GET /api/expenses` — List all expenses
  * `DELETE /api/expenses/:id` — Delete expense
  * `GET /api/balances` — Calculate balances

* **Logic:**

  * Equal split calculation
  * Balance computation

**Frontend:**

* **Pages:**

  * Home: List all expenses
  * Add Expense: Form
  * Balances: Display who owes whom

* **Features:**

  * Add/Delete expense
  * View balances

---

### Level 2: User Authentication & Enhanced Splitting (Optional)

**Time:** 3–4 hours

**Backend:**

* **Models:** User, Expense
* **Endpoints:**

  * `POST /api/auth/signup`
  * `POST /api/auth/login`
  * `GET /api/users`
  * All Level 1 endpoints
* **Logic:**

  * JWT authentication
  * Equal split among participants
  * Balance calculation

**Frontend:**

* **Pages:** Login / Signup, Dashboard, Add Expense (equal split), Balances

* **Features:**

  * User authentication
  * Add/view expenses
  * View overall balances

* **State Management:** Context API

* **Styling:** Tailwind CSS / Material-UI

---

### Level 3: Advanced Group Management & Settlement Optimization (Optional)

**Time:** 3–4 hours

**Backend:**

* **Models:** User, Group, Expense, Settlement

* Expense model includes `splitType` and `splitDetails`

* **Endpoints:**

  * Level 2 endpoints +
  * `POST /api/groups`
  * `GET /api/groups`
  * `GET /api/groups/:id`
  * `GET /api/expenses/group/:groupId`
  * `GET /api/balances/group/:groupId`
  * `PUT /api/expenses/:id`
  * `DELETE /api/expenses/:id`

* **Logic:**

  * Equal, unequal, percentage split
  * Group-wise balance calculation
  * Settlement optimization

**Frontend:**

* **Pages:** Groups Dashboard, Group Details, Create Group, Add Expense, Expense Details

* **Features:**

  * Manage groups
  * Add expense with any split type
  * View group-wise balances
  * Settlement optimization display

* **State Management:** Redux Toolkit

* Responsive design, code splitting

---

## Backend Documentation

### Models

**User**

```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "password": "hashed",
  "avatarUrl": "string",
  "createdAt": "Date"
}
```

**Group**

```json
{
  "_id": "string",
  "name": "string",
  "members": ["userId"],
  "createdBy": "userId",
  "createdAt": "Date"
}
```

**Expense**

```json
{
  "_id": "string",
  "groupId": "string",
  "description": "string",
  "amount": "number",
  "paidBy": "userId",
  "participants": ["userId"],
  "splitType": "equal|unequal|percentage",
  "splitDetails": [{"userId":"string","amount":number}],
  "createdAt": "Date"
}
```

**Settlement**

```json
{
  "_id": "string",
  "groupId": "string",
  "fromUser": "userId",
  "toUser": "userId",
  "amount": "number",
  "note": "string",
  "createdBy": "userId",
  "createdAt": "Date"
}
```

---

## API Endpoints

### Authentication

| Method | Endpoint         | Auth | Body                      | Response        |
| ------ | ---------------- | ---- | ------------------------- | --------------- |
| POST   | /api/auth/signup | No   | { name, email, password } | { user, token } |
| POST   | /api/auth/login  | No   | { email, password }       | { user, token } |
| GET    | /api/auth/me     | Yes  | -                         | { user }        |

### Expenses

| Method | Endpoint                     | Auth | Body / Params                                                     | Response                |
| ------ | ---------------------------- | ---- | ----------------------------------------------------------------- | ----------------------- |
| POST   | /api/expenses                | Yes  | { description, amount, paidBy, participants, splitType, groupId } | created expense         |
| GET    | /api/expenses                | Yes  | -                                                                 | array of expenses       |
| DELETE | /api/expenses/:id            | Yes  | -                                                                 | success msg             |
| GET    | /api/expenses/group/:groupId | Yes  | -                                                                 | array of group expenses |

### Groups

| Method | Endpoint                | Auth | Body / Params                   | Response      |
| ------ | ----------------------- | ---- | ------------------------------- | ------------- |
| POST   | /api/groups             | Yes  | { name, description, members? } | created group |
| GET    | /api/groups             | Yes  | -                               | user's groups |
| GET    | /api/groups/:id         | Yes  | -                               | group details |
| PUT    | /api/groups/:id/members | Yes  | { email }                       | updated group |

### Balances & Settlements

| Method | Endpoint                        | Auth | Response              |
| ------ | ------------------------------- | ---- | --------------------- |
| GET    | /api/balances                   | Yes  | overall balances      |
| GET    | /api/balances/group/:groupId    | Yes  | group balances        |
| GET    | /api/settlements/group/:groupId | Yes  | suggested settlements |
| POST   | /api/settlements/record         | Yes  | created settlement    |

---

## Frontend Documentation

**Pages & Components:**

* Auth: Login.jsx, Signup.jsx
* Dashboard: Dashboard.jsx
* Groups: GroupsList.jsx, GroupAdd.jsx, GroupDetails.jsx
* Expenses: ExpensesList.jsx, ExpenseAdd.jsx, ExpenseDetails.jsx
* Balances: Balances.jsx
* Settlement UI: SettlementView.jsx, ConfirmModal.jsx

**State Management:**

* Redux Toolkit with slices: authSlice, balancesSlice, expensesSlice, groupsSlice
* Async thunks for API calls and state updates

**API Integration:**

* Axios configured with base URL (`VITE_API_BASE_URL`)
* Authorization header from token in localStorage

---

## Environment Variables

**Backend (.env):**

```
MONGO_URI=<mongo-connection-string>
JWT_SECRET=<jwt-secret>
JWT_EXPIRES_IN=7d
PORT=5001
```

**Frontend (.env):**

```
VITE_API_BASE_URL=http://localhost:5001/api
```

---

## Installation & Run

**Backend:**

```bash
cd backend
npm install
npm run dev
# Visit http://localhost:5001/api/health
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
# Visit http://localhost:5173
```

---

## Testing & Utilities

* `create_settlement_test.js` — create settlement directly in DB
* `api_settlement_test.js` — test authenticated API settlement flow

---

## Security & Production Considerations

* Use strong JWT secret and bcrypt hashing
* Limit rate on auth endpoints
* Validate & sanitize uploads
* Use HTTPS and proper CORS
* Token expiration and refresh logic recommended

---

## Future Improvements

* Wire recorded settlements into group UI
* Unit & integration tests
* OpenAPI / Postman documentation
* CI/CD workflow & Dockerization
* Loading states & UX improvements
* Real-time updates using Socket.io

---

## Screenshots

![Screenshot1](frontend/src/assets/Screenshot 2025-10-07 191132.png)

---

## Assessment Structure & Evaluation

* **Level 1 (Done):** Basic expense tracker with equal splits
* **Level 2 (Done):** Authentication, enhanced splitting, protected routes
* **Level 3 (Done):** Group management, advanced splits, settlement optimization

---

## Deployment Links

* **Backend on Render:** [Check Health](https://splitwise-04ma.onrender.com/api/health)
* **Frontend on Vercel:** [Splitwise Clone](https://splitwise-xi.vercel.app/)

**Note:** Backend may hibernate after 24 hrs of inactivity on free-tier hosting.

**Created by:** Deepanshu Chauhan

```



```
