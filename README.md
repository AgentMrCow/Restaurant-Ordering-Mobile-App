# IERG3842 Mobile App - Chinese Restaurant Online Ordering System

Welcome to the IERG3842 Mobile App, a streamlined online ordering system designed specifically for a delightful Chinese cuisine experience. Developed by Niu Ka Ngai, this app allows customers to easily register, log in, and place orders for their favorite Chinese dishes, all from the comfort of their smartphone.

## Features:

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

## Usage

Once the app is running, you can:

- **Register**: Create a new account using your email.
- **Login**: Access the system by entering your credentials.
- **Browse Menu**: Explore the variety of dishes available.
- **Add to Cart**: Select the quantity and add items to your cart.
- **Checkout**: Review your order and proceed to purchase.

For more information, please refer to the [Documentation](https://example.com).

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Your Name - Niu Ka Ngai - email@example.com

Project Link: [https://github.com/your_username/repo_name](https://github.com/your_username/repo_name)

> Note: Replace placeholder URLs and email address with your information.

---

This README includes all the basic setup instructions for your mobile app. Adjust it according to your specific needs and additional functionalities.
