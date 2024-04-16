# IERG3842 Mobile App - Chinese Restaurant Online Ordering System

Welcome to the IERG3842 Mobile App, a streamlined online ordering system designed specifically for a delightful Chinese cuisine experience. Developed by Niu Ka Ngai, this app allows customers to easily register, log in, and place orders for their favorite Chinese dishes, all from the comfort of their smartphone.

## App Screenshots

Here are some screenshots that illustrate the features and user interface of the IERG3842 Mobile App:

### Home Screen
![Home Screen](https://github.com/AgentMrCow/Restaurant-Ordering-Mobile-App/blob/main/Screenshots/home.png)

This is the first screen users see when they open the app. It allows users to either log in to their existing account or register for a new account.

### Registration Screen
![Registration Screen](https://github.com/AgentMrCow/Restaurant-Ordering-Mobile-App/blob/main/Screenshots/register.png)

New users can create an account by providing their email, password, and date of birth.

### Cache
![Cache](https://github.com/AgentMrCow/Restaurant-Ordering-Mobile-App/blob/main/Screenshots/cache.png)
Once logged in, login tokens are saved in cache.

### Store Page
![Store Page](https://github.com/AgentMrCow/Restaurant-Ordering-Mobile-App/blob/main/Screenshots/store.png)

Users can browse the menu and select items to add to their cart.

### Shopping Cart
![Shopping Cart](https://github.com/AgentMrCow/Restaurant-Ordering-Mobile-App/blob/main/Screenshots/cart.png)

Users can remove or view the items they have added to their cart and proceed to checkout.

### Successful Purchase
![Successful Purchase](https://github.com/AgentMrCow/Restaurant-Ordering-Mobile-App/blob/main/Screenshots/purchase.png)

After a successful transaction, users receive a confirmation of their purchase.

### Saving Order
![Saving Order](https://github.com/AgentMrCow/Restaurant-Ordering-Mobile-App/blob/main/Screenshots/db.png)

The order is saved securely in MongoDB Atlas Database.

## Core Technologies of the IERG3842 Mobile App
Here's an overview of the technologies and frameworks used to build this application, providing a robust and user-friendly experience:

### 1. Mobile Application Frontend

- **React Native**: Utilized for developing the cross-platform mobile app which allows it to run on both Android and iOS devices. React Native is a popular choice for mobile development due to its efficiency and the rich ecosystem of plugins and community support.
- **Expo**: A framework and platform for universal React applications. It is used to accelerate the development process by simplifying the setup and deployment of the React Native app. Expo also handles a lot of configuration automatically, making it easier to manage multimedia, handle notifications, and compile the app.
- **React Navigation**: This library helps with navigating between different screens within the app smoothly and efficiently.
- **AsyncStorage from React Native**: Used for local storage of user data like tokens and session states across app restarts and reloads.

### 2. Backend API

- **FastAPI**: A modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints. The key features that make FastAPI a great choice for this kind of project include its speed, ease of use, and robustness.
- **Uvicorn**: An ASGI server for Python, used to run the FastAPI application. It helps in handling asynchronous requests and makes the application scalable and fast.

### 3. Database and Authentication

- **MongoDB Atlas**: A cloud database service used for storing all persistent data including user credentials, menu items, and order details. It offers high performance, scalability, and flexibility, making it a suitable choice for applications needing to handle large volumes of data.
- **JWT (JSON Web Tokens)**: Used for securing the backend communication and effectively managing user authentication and sessions. It ensures that each request to the server is authenticated and authorized properly.

### 4. Additional Python Packages

- **Pymongo**: A Python distribution containing tools for working with MongoDB, and is the recommended way to work with MongoDB from Python.
- **Passlib & python-jose**: These libraries are used for password hashing and JWT operations respectively, which are critical for secure authentication mechanisms.
- **Python-dotenv**: Used for loading environment variables from a `.env` file which is essential for managing configuration options and secret keys securely outside of the main codebase.

## Configuration and Integration

- The mobile app makes requests to the FastAPI backend, handling tasks such as user authentication (login/register), menu browsing, and order processing.
- Data is stored and retrieved from MongoDB Atlas, ensuring that all interactions are persistent and stateful.
- Security is a top priority with hashed passwords stored in the database and JWT used for session management to prevent unauthorized access.

This architecture not only ensures that the application is robust, secure, and scalable but also provides a seamless user experience whether on a web browser or on a mobile device. The use of modern frameworks and technologies like React Native, FastAPI, and MongoDB Atlas highlights the application's commitment to using cutting-edge technology to improve user satisfaction and operational efficiency.

## Features

- **User Authentication**: Secure login and registration system.
- **Intuitive Interface**: Simple and user-friendly interface for ordering.
- **Shopping Cart Functionality**: Add items to your cart and manage them effortlessly.
- **Order Checkout**: Review your selections and prices before finalizing the order.

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- npm
  ```sh
  npm install npm@latest -g
  ```
- Expo CLI
  ```sh
  npm install -g expo-cli
  ```

### Installation

1. Clone the repository.
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```
2. Install NPM packages.
   ```sh
   npm install
   ```
3. Start the application.
   ```sh
   expo start
   ```

For the backend service to handle user authentication and order processing:

1. Ensure you have Python installed on your system.
2. Install the necessary Python packages using `pip` (or `pip3` if Python 3 is not your default Python version):
   ```sh
   pip install fastapi uvicorn pymongo python-multipart python-jose passlib python-dotenv
   ```
3. Add Required Variables:
   Create a new `.env` file and add the following lines:

   ```plaintext
   DATABASE_URI="your_mongodb_connection_string_here"
   JWT_SECRET_KEY="your_secret_key_here"
   ```

   - Replace `your_mongodb_connection_string_here` with your actual MongoDB connection string.
   - Replace `your_secret_key_here` with a strong secret key for JWT authentication.
   
   Example Content for `.env` File:

   ```plaintext
   DATABASE_URI="mongodb+srv://username:password@cluster0.example.mongodb.net/"
   JWT_SECRET_KEY="thisisasecretkey"
   ```
4. Run the FastAPI server:
   ```sh
   uvicorn main:app --reload
   ```
