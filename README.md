# 🌍 Atithi — House Accomodation Platform (MERN Stack)

A full-stack Airbnb-inspired web application where users can explore, create, and manage travel listings.  
This project demonstrates real-world backend architecture, RESTful APIs, authentication, and responsive UI design.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- User signup & login (JWT-based)  
- Secure session handling  
- Authorization for protected routes  

### 🏡 Listings Management
- Create, edit, and delete listings  
- View all listings with responsive grid layout  
- Detailed listing pages  

### 🖼️ Image Handling
- Image URL storage (Unsplash / external sources)  
- Default image fallback for broken/missing images  
- Structured image object (`filename + url`)  

### 🔍 Search Functionality
- Search listings by country/location  
- Dynamic filtering of results  

### 💻 Responsive UI
- Mobile-first design  
- Bootstrap-based grid system  
- Adaptive layout (1–4 cards per row)  

---

## 🛠️ Tech Stack

### 🎨 Frontend
- HTML  
- CSS  
- Bootstrap  
- EJS (Embedded JavaScript Templates)  

### ⚙️ Backend
- Node.js  
- Express.js  

### 🗄️ Database
- MongoDB  
- Mongoose ODM  

---

## 📁 Project Structure

```
project/
│
├── models/
│   └── listing.js
│
├── routes/
│   └── listings.js
│
├── views/
│   ├── layouts/
│   └── listings/
│
├── public/
│   └── css/
│
├── init/
│   └── data.js   (sample listings)
│
├── app.js
└── package.json
```

---

## 🧠 Key Learnings

- RESTful API design  
- MVC architecture  
- MongoDB schema design  
- Dynamic rendering using EJS  
- Handling real-world UI edge cases (broken images, responsiveness)  
- Debugging full-stack applications  

---

## 👨‍💻 Author

**Shubham**  
Full Stack Developer (MERN)
