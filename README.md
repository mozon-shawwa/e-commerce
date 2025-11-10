# 🛒 E-Commerce Website Backend API

## 📖 Project Description
This project is a **backend application** built using **Node.js** and **Express.js**, providing a **RESTful API** for an e-commerce platform that sells various types of **electronic devices**.

The system supports **user management, product management, cart and wishlist functionalities, order processing, and reviews**.  
It also includes **secure authentication** using JWT, **image uploads** with Cloudinary, and **online payment integration** via Stripe.

---

## 🎯 Project Goals
- Manage users (registration, login, and role-based access control).  
- Provide endpoints for CRUD operations on products.  
- Allow users to manage their shopping cart and wishlist.  
- Enable users to post and view product reviews.  
- Give admins full access to manage the platform content.  
- Integrate **Stripe** for online payment processing.  
- Secure the API with **JSON Web Tokens (JWT)**.

---

## 🚀 Core Features

### 👤 Authentication & Authorization
- User registration and login.  
- Role-based access control (Admin vs. Regular user).  
- JWT authentication and protected routes.  

### 🛍️ Product Management
- Add, update, delete, and view products.  
- Upload product images using **Cloudinary**.  
- Filter and search products by category, price, or name.  

### 🛒 Cart & Wishlist
- Add or remove products from the cart or wishlist.  
- Update product quantity in the cart.  

### 📦 Orders
- Place orders from the cart.  
- View user orders and order details.  
- Admin can update order status (Pending, Shipped, Delivered).  

### ⭐ Reviews
- Add and view product reviews.  
- Admin can delete inappropriate reviews.  

### 💳 Payments
- Secure payment processing using **Stripe API**.

---

## 🧰 Technologies Used
- **Node.js**  
- **Express.js**  
- **MongoDB + Mongoose**  
- **dotenv** (environment variables)  
- **CORS**  
- **jsonwebtoken (JWT)**  
- **bcryptjs** (for password hashing)  
- **Stripe API** (online payments)  
- **Cloudinary** (image uploads)  
- **Multer** (handling image uploads before sending to Cloudinary)  

---

## 🔐 Security & Best Practices
- Passwords are encrypted using **bcryptjs**.  
- Authentication and authorization handled via **JWT**.  
- Sensitive keys stored in `.env` file.

---

## ⚙️ How to Run Locally
```bash
git clone https://github.com/mozon-shawwa/ecommerce.git
cd ecommerce
npm install
npm start
```

---

## Create a .env file
```bash
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=your_stripe_key
```

## 📂 Project Structure (Example)
