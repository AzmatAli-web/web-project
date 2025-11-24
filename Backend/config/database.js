// In-memory database (replace with MongoDB later)
const users = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@campus.edu",
    password: "123123", // password: password
    createdAt: new Date('2024-01-15')
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@campus.edu", 
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password: password
    createdAt: new Date('2024-01-20')
  },
  {
    id: 3,
    name: "Mike Chen",
    email: "azmat082003@gmail.com",
    password: "1231234", // password: password
    createdAt: new Date('2024-02-01')
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@campus.edu",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password: password
    createdAt: new Date('2024-02-10')
  },
  {
    id: 5,
    name: "Alex Rodriguez",
    email: "alex.r@campus.edu",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password: password
    createdAt: new Date('2024-02-15')
  }
];

const products = [
  {
    id: 1,
    name: "Calculus Textbook",
    price: 45,
    description: "Like new condition, 5th edition",
    createdAt: new Date('2024-02-20'),
    userId: 1
  },
  {
    id: 2, 
    name: "MacBook Pro 2022",
    price: 1200,
    description: "13-inch, 256GB SSD, excellent condition",
    createdAt: new Date('2024-02-18'),
    userId: 2
  },
  {
    id: 3,
    name: "Bicycle",
    price: 85,
    description: "Mountain bike, barely used",
    createdAt: new Date('2024-02-22'),
    userId: 3
  }
];

const listings = [
  {
    id: 1,
    title: "Room for rent near campus",
    description: "Single room available, utilities included",
    price: 650,
    userId: 4,
    createdAt: new Date('2024-02-25')
  },
  {
    id: 2,
    title: "Graphic Calculator TI-84",
    description: "Used for engineering courses, works perfectly",
    price: 60,
    userId: 5,
    createdAt: new Date('2024-02-24')
  }
];

let userIdCounter = 6; // Start from 6 since we have 5 users already
let productIdCounter = 4; // Start from 4 since we have 3 products already  
let listingIdCounter = 3; // Start from 3 since we have 2 listings already

// Use module.exports correctly
module.exports = {
  users,
  products,
  listings,
  userIdCounter,
  productIdCounter,
  listingIdCounter
};