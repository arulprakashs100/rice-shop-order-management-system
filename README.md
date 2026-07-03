# 🌾 Rice Shop Order Management System

A Java Full Stack web application that helps rice shops manage customer orders efficiently. Customers can place rice orders, while owners can view, manage, update, delete, and print invoices through an admin dashboard.

---

## 🚀 Features

### 👤 Customer Module

- Register customer details
- Auto-generated Customer ID
- Search rice varieties
- Select multiple rice types
- Enter quantity and number of bags
- Automatic price calculation
- Order summary before submission
- Submit order

### 👨‍💼 Owner Module

- Secure owner login
- View all customer orders
- View order details
- Update order status
- Delete cancelled orders
- Print customer invoice

---

## 🛠 Tech Stack

### Frontend
- HTML5
- CSS3
- Bootstrap 5
- JavaScript

### Backend
- Java 17
- Spring Boot
- Spring MVC
- Spring Data JPA
- Hibernate

### Database
- PostgreSQL

### Tools
- Maven
- IntelliJ IDEA
- Postman
- Git
- GitHub

---

## 📂 Project Structure

```text
RiceShop
│
├── controller
├── service
├── repository
├── entity
├── dto
├── config
├── exception
├── resources
│
└── RiceShopApplication.java
```

---

## 🗄 Database Tables

- Customer
- Rice
- Orders
- Order Items
- Admin

---

## 🌾 Available Rice Types

- Seeraga Samba Rice
- Nattu Ponni Rice
- Karnataka Ponni Rice
- Karnataka Rice
- Idli Rice
- Raw Rice
- Small Grain Rice
- Varagu Rice
- Samai Rice
- Kuthiraivali Rice
- Kambu Rice

---

## 📡 REST API Endpoints

### Customer

```http
POST /api/customers
GET  /api/customers/{id}
```

### Rice

```http
GET /api/rice
GET /api/rice/search
```

### Orders

```http
POST   /api/orders
GET    /api/orders
GET    /api/orders/{id}
PUT    /api/orders/{id}
DELETE /api/orders/{id}
```

### Admin

```http
POST /api/admin/login
```

---

## 🔄 Project Workflow

```text
Customer
     │
     ▼
Enter Customer Details
     │
     ▼
Search Rice
     │
     ▼
Select Quantity & Bags
     │
     ▼
Price Calculation
     │
     ▼
Submit Order
     │
     ▼
Spring Boot REST API
     │
     ▼
PostgreSQL Database
     │
     ▼
Owner Dashboard
     │
     ▼
View • Update • Delete • Print Invoice
```

---

## 🎯 Learning Outcomes

- Java Full Stack Development
- Spring Boot REST APIs
- PostgreSQL Integration
- Spring Data JPA
- Hibernate ORM
- CRUD Operations
- MVC Architecture
- Invoice Generation
- Order Management System

---

## 🔮 Future Enhancements

- Customer Login
- Online Payment Gateway
- PDF Invoice Download
- Stock Management
- Sales Dashboard
- WhatsApp Notifications
- Email Notifications
- GST Calculation
- Order Tracking

---

## 👨‍💻 Author

**Arul Prakash S**

Java Full Stack Developer

- GitHub: https://github.com/arulprakashs100

---

## ⭐ Support

If you found this project useful, consider giving it a **Star ⭐** on GitHub.
