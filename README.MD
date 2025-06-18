# 🌍 Family Travel Tracker

A simple and fun web application that allows each family member to create a profile, select a favorite color, and track the countries they've visited. Built with Node.js, Express, PostgreSQL, and EJS.

---

## ✨ Features

- 👨‍👩‍👧 Create profiles for each family member.
- 🌈 Choose a unique color for each user.
- 🗼 Track visited countries per user.
- 🧠 Auto-suggest countries based on name input.
- 📊 View total countries visited per user.
- 🔄 Switch between users easily.
- 🎨 Color-coded country highlights.

---

## ⚙️ Tech Stack

- **Backend:** Node.js, Express
- **Frontend:** EJS Templates
- **Database:** PostgreSQL
- **Styles:** Public folder (static CSS/JS)

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/family-travel-tracker.git
cd family-travel-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup PostgreSQL

Create a PostgreSQL database named `world` and run the following SQL commands:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL
);

CREATE TABLE countries (
  country_code VARCHAR(2) PRIMARY KEY,
  country_name TEXT NOT NULL
);

CREATE TABLE visited_countries (
  id SERIAL PRIMARY KEY,
  country_code VARCHAR(2) REFERENCES countries(country_code),
  user_id INTEGER REFERENCES users(id)
);
```

> 💡 Populate the `countries` table with ISO 3166-1 country names and codes for best results.

### 4. Update `app.js` Database Config

In `app.js`, update the PostgreSQL connection details:

```js
const db = new pg.Client({
  user: "your_user",
  host: "localhost",
  database: "world",
  password: "your_password",
  port: 5432,
});
```

### 5. Run the App

```bash
node index.js
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```
.
├── public/             # Static assets (CSS, JS, images)
├── views/
│   ├── index.ejs       # Main UI
│   └── new.ejs         # New user form
├── index.js              # Main server file
├── package.json
└── README.md
```

---

## 🧹 Future Features (Ideas)

- 🌍 Interactive world map
- 📷 User profile pictures
- 📊 Family stats dashboard
- 🌐 Filter by continent or region

---

## 🧑‍💻 Author

**Your Name** – [@Linusman001](https://github.com/Linusman001)

---

## 📜 License

This project is licensed under the MIT License.

