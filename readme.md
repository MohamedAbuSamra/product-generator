# 🚀 Product Generator (Express.js + OpenAI)

A backend API that leverages OpenAI to automatically generate product descriptions, titles, or ideas. Built with **Node.js**, **Express**, and **Sequelize** using **PostgreSQL**.

---

## 📦 Features

- 🔐 Secure configuration using `.env` files
- ⚙️ Seamless integration with OpenAI API
- 📦 Database management with Sequelize ORM for PostgreSQL
- 🌍 Organized and clean project structure
- 🔄 Support for global constants

---

## 🛠 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/product-generator.git
cd product-generator
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory with the following content:

```env
PORT=3000

# PostgreSQL
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME_DEV=your_dev_db_name
DB_NAME_PROD=your_prod_db_name
DB_HOST=your_db_host
DB_PORT=5432

# OpenAI
OPENAI_API_KEY=your_openai_api_key
```

### 4. Run the Project

Start the development server:

```bash
npm run dev
```

---

## 📡 API Endpoints

| Method | Endpoint        | Description                     |
| ------ | --------------- | ------------------------------- |
| POST   | `/generate`     | Generate a product via OpenAI   |
| GET    | `/products`     | Retrieve all generated products |
| DELETE | `/products/:id` | Delete a product by ID          |
