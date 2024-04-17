import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { StatusBar } from "expo-status-bar";
import React, { useEffect, createContext, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode as atob } from 'base-64';
import { Card } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart(currentCart => {
      const index = currentCart.findIndex(i => i.name === item.name);
      if (index > -1) {
        const newCart = [...currentCart];
        newCart[index].quantity += 1;
        return newCart;
      } else {
        return [...currentCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemToRemove) => {
    setCart(currentCart => {
      const index = currentCart.findIndex(i => i.name === itemToRemove.name);
      if (index > -1 && currentCart[index].quantity > 1) {
        const newCart = [...currentCart];
        newCart[index].quantity -= 1;
        return newCart;
      } else {
        return currentCart.filter(item => item.name !== itemToRemove.name);
      }
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Store" component={StoreScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}

function getEmailFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub;
  } catch (e) {
    console.error('Failed to decode token:', e);
    return null;
  }
}

const HomeScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      alert('You have already logged in.');
      navigation.navigate("Store");
    }
  }

  function onLoginPressed() {
    checkLoginStatus();
    // Resetting error states
    setEmailError("");
    setPasswordError("");

    let valid = true;

    // Basic validation for email and password
    if (email === "") {
      setEmailError("Please enter your email");
      valid = false;
      console.log("Email validation failed: No email provided.");
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError("Please enter a valid email");
      valid = false;
      console.log("Email validation failed: Invalid email format.");
    }

    if (password === "") {
      setPasswordError("Please enter a password");
      valid = false;
      console.log("Password validation failed: No password provided.");
    } else if (password.length < 8) {
      setPasswordError("The password must be 8 characters or longer");
      valid = false;
      console.log("Password validation failed: Password is too short.");
    }

    // If validation passes, proceed to make a login request
    if (valid) {
      console.log("Validation passed, attempting to log in.");
      fetch("http://10.0.2.2:8000/auth", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
        .then(r => r.json())
        .then(r => {
          if ('success' === r.message) {
            console.log("Login successful.");
            // Store the token received upon successful login
            const token = r.token; // Assuming the token is returned in the response
            console.log("Token received:", token);

            // Verify the token by calling the `/verify` endpoint
            console.log("Attempting to verify token.");
            fetch("http://10.0.2.2:8000/verify", {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
                'jwt-token': token // Sending the token in the request headers
              },
            })
              .then(verifyResponse => verifyResponse.json())
              .then(async (verifyResult) => {
                if (verifyResult.status === 'logged in') {
                  console.log("Token verification successful.");
                  // If the token is verified successfully, navigate to the Store screen
                  console.log("Login successful, token:", r.token);
                  try {
                    await AsyncStorage.setItem('userToken', r.token);
                    navigation.navigate("Store");
                  } catch (error) {
                    console.error("AsyncStorage error:", error);
                  }
                } else {
                  console.log("Token verification failed with status:", verifyResult.status);
                }
              })
              .catch(verifyError => console.error("Verification error:", verifyError));
          } else if (r.message === 'fail') {
            setEmailError('Login failed. Please check your credentials.');
          } else {
            console.log(r)
            console.log("Login failed with message:", r.message);
          }
        })
        .catch(loginError => console.error("Login error:", loginError));
    } else {
      console.log("Validation failed, not attempting to log in.");
    }
  }

  const onRegisterPressed = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      alert('You have already register.');
      navigation.navigate("Store");
    } else {
      navigation.navigate("Register");
    }
  }


  return (
    <View style={styles.container}>
      <Text style={styles.storeTitle}>IERG3842 Mobile App</Text>
      <Text style={styles.describe}>Chinese Restaurant Online Ordering SYSTEM</Text>
      <Text style={styles.userInfo}>By Niu Ka Ngai</Text>
      <Text style={styles.userInfo}>Student ID: 1155174712</Text>
      <Image style={styles.image} source={require("./assets/food.png")} />
      <StatusBar style="auto" />

      <View style={styles.inputWithErrorView}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Email"
            placeholderTextColor="#003f5c"
            onChangeText={(email) => setEmail(email)}
          />
        </View>
        {emailError !== "" && <Text style={styles.errorText}>{emailError}</Text>}
      </View>

      <View style={styles.inputWithErrorView}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Password"
            placeholderTextColor="#003f5c"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
        </View>
        {passwordError !== "" && <Text style={styles.errorText}>{passwordError}</Text>}
      </View>

      <TouchableOpacity style={styles.loginBtn} onPress={onLoginPressed}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginBtn} onPress={onRegisterPressed}>
        <Text style={styles.loginText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [gender, setGender] = useState('male');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [dobError, setDobError] = useState("");

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date) => {
    setDateOfBirth(date);
    hideDatePicker();
  };

  const validateFields = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setDobError('');

    if (email === '') {
      setEmailError("Please enter your email");
      isValid = false;
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError("Please enter a valid email");
      isValid = false;
    }

    if (password === '') {
      setPasswordError("Please enter your password");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("The password must be 8 characters or longer");
      isValid = false;
    }

    if (confirmPassword === '') {
      setConfirmPasswordError("Please enter your confirm password");
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords don't match!");
      isValid = false;
    }

    if (!dateOfBirth) {
      setDobError("Please select your date of birth");
      isValid = false;
    } else if (1) {
      // xxx
    }

    return isValid;
  };

  const handleRegister = () => {
    if (validateFields()) {
      // Step 1: Invoke the check-account endpoint
      fetch("http://10.0.2.2:8000/check-account", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })
        .then(response => response.json())
        .then(data => {
          // Step 2: Process the response
          if (data.userExists) {
            // If user exists, set an email error
            setEmailError("An account with this email already exists.");
          } else {
            // Step 3: Proceed with registration if user does not exist
            console.log("Proceeding with registration for:", email);
            fetch("http://10.0.2.2:8000/register", {
              method: "POST",
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email, password, confirmPassword, dateOfBirth, gender })
            })
              .then(registerResponse => registerResponse.json())
              .then(async (data) => {
                if (data.message === 'User registered successfully') {
                  console.log("Register successful. Token:", data.token);
                  try {
                    await AsyncStorage.setItem('userToken', data.token);
                    navigation.navigate("Store");
                  } catch (error) {
                    console.error("AsyncStorage error:", error);
                  }
                } else {
                  setEmailError(data.message || "Registration failed. Please try again.");
                }
              })
              .catch(error => {
                console.error("Registration error:", error);
                setEmailError("An error occurred during registration. Please try again.");
              });
          }
        })
        .catch(error => {
          console.error("Error checking account:", error);
          setEmailError("An error occurred. Please try again later.");
        });
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.registerContainer}>
      <Text style={styles.title}>Register</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
        />
        {emailError !== "" && <Text style={styles.errorText}>{emailError}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
        {passwordError !== "" && <Text style={styles.errorText}>{passwordError}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Confirm Password"
          secureTextEntry
          onChangeText={setConfirmPassword}
          value={confirmPassword}
        />
        {confirmPasswordError !== "" && <Text style={styles.errorText}>{confirmPasswordError}</Text>}
      </View>

      <TouchableOpacity style={styles.datePickerButton} onPress={showDatePicker}>
        <Text style={styles.datePickerText}>
          {`Date of Birth: ${dateOfBirth ? dateOfBirth.toLocaleDateString() : "Please Select Date"}`}
        </Text>
      </TouchableOpacity>
      {dobError !== "" && <Text style={styles.errorText}>{dobError}</Text>}

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        maximumDate={new Date()}
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
      />
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={gender === 'male' ? styles.genderButtonSelected : styles.genderButton}
          onPress={() => setGender('male')}
        >
          <Text style={styles.genderButtonText}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={gender === 'female' ? styles.genderButtonSelected : styles.genderButton}
          onPress={() => setGender('female')}
        >
          <Text style={styles.genderButtonText}>Female</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const StoreScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const { cart, addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch('http://10.0.2.2:8000/items')
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error('Error fetching items:', error));
  }, []);

  return (
    <View style={styles.storeContainer}>
      <View style={styles.navigationBar}>
        <Text style={styles.navItem}>Appetizer</Text>
        <Text style={styles.navItemActive}>Main Course</Text>
        <Text style={styles.navItem}>Dessert</Text>
        <Text style={styles.navItem}>Beverage</Text>
      </View>
      <ScrollView style={styles.storeScreen}>
        <View style={styles.menuBar}>
          <TouchableOpacity
            style={[styles.menuButton, cart.length === 0 && styles.menuButtonDisabled]}
            onPress={() => cart.length > 0 && navigation.navigate('Cart')}
            disabled={cart.length === 0}>
            <Image source={require('./assets/shopping-cart.png')} style={styles.icon} />
            <Text style={styles.menuText}>Cart ({cart.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={() => {
            AsyncStorage.removeItem('userToken');
            navigation.navigate("Home");
          }}>
            <Image source={require('./assets/log-out.512x512.png')} style={styles.icon} />
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>
        </View>
        {items.map((item, index) => (
          <Card key={index}>
            <Card.Title title={item.name} subtitle={`$${item.price}`} />
            <Card.Cover source={{ uri: item.image_url }} style={styles.cardImage} />
            <Card.Actions>
              <Button onPress={() => addToCart(item)} title="Add to Cart" color="#ac2925" />
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};



const CartScreen = ({ navigation }) => {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);

  const total_price = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const userEmail = getEmailFromToken(token);
    const items = cart.map(item => ({ name: item.name, quantity: item.quantity }));

    fetch('http://10.0.2.2:8000/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, items, total_price })
    })
      .then(response => response.json())
      .then(data => {
        alert("Purchase successful!");
        clearCart();
        navigation.navigate('Store');
      })
      .catch(error => {
        console.error('Checkout error:', error);
        alert("Error processing your purchase.");
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.cartContainer}>
      {cart.map((item, index) => (
        <View key={index} style={styles.cartItem}>
          <Image source={{ uri: item.image_url }} style={styles.cartItemImage} />
          <View style={styles.cartItemDetail}>
            <Text style={styles.itemName}>{item.name} - ${item.price} x {item.quantity} (Subtotal: ${item.price * item.quantity})</Text>
            <TouchableOpacity onPress={() => removeFromCart(item)} style={styles.removeItemBtn}>
              <Text style={styles.removeItemText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <Text style={styles.totalPriceText}>Total: ${total_price.toFixed(2)}</Text>
      <Button title="Continue Ordering" onPress={() => navigation.goBack()} />
      <View style={styles.space}></View>
      <Button title="Checkout" onPress={handleCheckout} color="#007bff" />
    </ScrollView>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  storeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 10,
  },
  describe: {
    fontSize: 16,
    color: "#ac2925",
    marginBottom: 5,
    fontWeight: "bold",
  },
  userInfo: {
    fontSize: 16,
    color: "#008080",
    marginBottom: 5,
    fontWeight: "bold",
  },
  image: {
    width: 400,
    height: 200,
  },
  inputWithErrorView: {
    width: "100%",
    marginBottom: 15,
  },
  inputView: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  TextInput: {
    height: 40,
    fontSize: 16,
  },
  loginBtn: {
    width: "100%",
    borderRadius: 20,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#007bff",
    elevation: 5,
  },
  loginText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  // error text define below
  // Register
  registerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  textInput: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  datePickerButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  datePickerText: {
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  genderButton: {
    padding: 10,
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#e7e7e7',
    borderRadius: 5,
    marginHorizontal: 0, //5
  },
  genderButtonSelected: {
    padding: 10,
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginHorizontal: 0, // 5
  },
  genderButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  registerButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  datePickerButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#e8e8e8',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d0d0d0',
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    textAlign: 'left',
    marginBottom: 5,
  },

  // store
  storeContainer: {
    flex: 1,
    paddingTop: 10,
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  navItem: {
    fontWeight: 'bold',
    color: '#666',
  },
  navItemActive: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  storeScreen: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  menuBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  menuButton: {
    flexDirection: 'row',
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  menuButtonDisabled: {
    backgroundColor: "#ccc",
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  menuText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  cardImage: {
    width: '100%',
    height: 150,
  },

  // cart
  cartContainer: {
    padding: 20,
    backgroundColor: "#fff",
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  cartItemImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  cartItemDetail: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeItemBtn: {
    padding: 10,
    backgroundColor: '#ff4444',
    borderRadius: 5,
  },
  removeItemText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  totalPriceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    paddingVertical: 10
  },
  space: {
    height: 20,
  }
});

