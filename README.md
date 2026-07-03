# 🌾 Rice Shop Order Management System

A Java Full Stack web application developed to simplify rice shop order management. Customers can place rice orders online, and the shop owner can manage orders, update their status, delete cancelled orders, and generate printable invoices.

---

## 📌 Features

### 👤 Customer Module

- Enter Customer Name
- Enter Mobile Number
- Auto Generate Customer ID
- Search Rice Types
- Select Multiple Rice Types
- Enter Quantity (KG)
- Enter Number of Bags
- Automatic Price Calculation
- View Order Summary
- Submit Order

### 👨‍💼 Owner Module

- Secure Login
- View All Customer Orders
- View Order Details
- Update Order Status
- Delete Cancelled Orders
- Generate Printable Invoice
- Manage Customer Orders

---

## 🛠️ Tech Stack

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

### Build Tool

- Maven

### IDE

- IntelliJ IDEA

### API Testing

- Postman

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

## 🗄️ Database Tables

- Customer
- Rice
- Order
- OrderItem
- Admin

---

## 🔗 REST APIs

### Customer

```http
POST /api/customers

GET /api/customers/{id}
```

### Rice

```http
GET /api/rice

GET /api/rice/search?name=
```

### Orders

```http
POST /api/orders

GET /api/orders

GET /api/orders/{id}

PUT /api/orders/{id}

DELETE /api/orders/{id}
```

### Admin

```http
POST /api/admin/login
```

---

## 🌾 Rice Types

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

## 🚀 Project Workflow

```text
Customer
     │
     ▼
Enter Customer Details
     │
     ▼
Search & Select Rice
     │
     ▼
Choose Quantity & Bags
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
View / Delete / Print Invoice
```

---

## 💡 Future Enhancements

- Customer Login
- Online Payment
- Stock Management
- PDF Invoice
- WhatsApp Notification
- Email Notification
- Sales Dashboard
- Order Tracking
- GST Calculation

---

## 🎯 Learning Outcomes

This project demonstrates:

- Java Full Stack Development
- Spring Boot REST APIs
- PostgreSQL Database Integration
- CRUD Operations
- MVC Architecture
- Spring Data JPA
- Hibernate ORM
- RESTful Web Services
- Order Management System
- Invoice Generation

---

## 👨‍💻 Author

**Arul Prakash S**

Java Full Stack Developer

---

## 📜 License

This project is developed for educational and portfolio purposes.

---

⭐ If you like this project, don't forget to **Star** this repository!
