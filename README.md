# Sego Project

This repository contains the source code for the **front-office** project, which includes the **back-office** and **front-office** React apps, a **server** built with **Express.js**, and a **machine learning model** for restaurant reservation prediction.

## Table of Contents

1. [Installation](#installation)
2. [Back-office](#back-office)
3. [Front-office](#front-office)
4. [Server](#server)
5. [Machine Learning Model](#machine-learning-model)
6. [Scripts](#scripts)
7. [License](#license)

---

## Installation

Follow these steps to set up the project locally.

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- Python 3.x (for ML-related files)
- MongoDB (or another database service for backend)

### Steps to Set Up

1. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/sego.git
   cd sego
   ```

2. **Back-office** (React app):

   - Navigate to the `back-office` folder:
     ```bash
     cd back-office
     ```
   - Install the dependencies:
     ```bash
     npm install
     ```
   - Start the development server:
     ```bash
     npm run dev
     ```

3. **Front-office** (React app):

   - Navigate to the `front-office` folder:
     ```bash
     cd front-office
     ```
   - Install the dependencies:
     ```bash
     npm install
     ```
   - Start the development server:
     ```bash
     npm run dev
     ```

4. **Server** (Express.js):

   - Navigate to the `server` folder:
     ```bash
     cd server
     ```
   - Install the dependencies:
     ```bash
     npm install
     ```
   - Start the server:
     ```bash
     npm run dev
     ```

5. **Machine Learning**:
   - Navigate to the `ML Modeling` folder:
     ```bash
     cd ML Modeling
     ```
   - Install the necessary Python dependencies:
     ```bash
     pip install -r requirements.txt
     ```

---

## Back-office

The **back-office** is a React application that provides an admin dashboard for managing reservations, user profiles, analytics, and more. It uses **Vite** for the development environment and includes key dependencies like **React**, **Formik**, **Axios**, and **PrimeReact**.

### Available Scripts

- `npm run dev`: Start the back-office app in development mode.
- `npm run build`: Build the app for production.
- `npm run lint`: Lint the source code using ESLint.
- `npm run sass`: Watch and compile SCSS files into CSS.

---

## Front-office

The **front-office** is a customer-facing React application that allows users to make restaurant reservations and interact with services like menus and booking.

### Available Scripts

- `npm run dev`: Start the front-office app in development mode.
- `npm run build`: Build the app for production.
- `npm run lint`: Lint the source code using ESLint.
- `npm run sass`: Watch and compile SCSS files into CSS.

---

## Server

The **server** is built using **Express.js** and is responsible for handling API requests, user authentication, data management, and other back-end services.

### Available Scripts

- `npm run dev`: Start the server in development mode.
- `npm run lint`: Lint the server-side code using ESLint.
- `npm run format`: Format the code using Prettier.
- `npm run seed`: Seed the database with initial data.
- `npm run seed:reset`: Reset the seeded data.

---

## Machine Learning Model

The **Machine Learning** folder includes scripts and models used to predict restaurant reservation trends. The model utilizes **scikit-learn** and other Python libraries to make predictions.

### Files

- `app.py`: Python script for model training and prediction.
- `improved_reservations.csv`: Training data used for the model.
- `model.pkl`: Trained model file for prediction.
- `month_ohe.pkl`: One-hot encoding for months.
- `scaler.pkl`: Scaler used for feature normalization.
- `restaurant_reservations_prediction_with_comparison.ipynb`: Jupyter notebook comparing various models.

### Running the Model

1. Open the Jupyter notebook `restaurant_reservations_prediction_with_comparison.ipynb` to train and test the model.
2. Follow the instructions in the notebook to perform model comparisons and predictions.

---

## Scripts

This project includes several helper scripts, including:

- `scripts/seed.js`: Script for populating the database with initial data.
- `scripts/seed-reset.js`: Script for resetting the seeded data.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
