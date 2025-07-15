import { Order } from '../types';

export const mockOrders: Order[] = [
  {
    id: 1,
    userId: 2,
    items: [
      {
        id: 1,
        name: "Yomari",
        description: "Traditional steamed dumpling filled with sweet sesame seeds and jaggery",
        price: 250,
        image: "/Pic/Yomari.jpeg",
        category: "Traditional Sweets",
        quantity: 2
      },
      {
        id: 3,
        name: "Chatamari",
        description: "Newari rice crepe topped with vegetables, eggs, and meat",
        price: 180,
        image: "/Pic/Chatamari.jpg",
        category: "Snacks",
        quantity: 1
      }
    ],
    total: 680,
    status: 'delivered',
    createdAt: '2025-01-15 14:30',
    customerInfo: {
      name: 'John Doe',
      email: 'customer@example.com',
      phone: '+977 9876543210',
      address: 'Lalitpur, Nepal'
    }
  },
  {
    id: 2,
    userId: 2,
    items: [
      {
        id: 2,
        name: "Newari Khaja Set",
        description: "Complete traditional meal with beaten rice, curry, pickles, and meat",
        price: 850,
        image: "/Pic/Newari Khaja Set.jpg",
        category: "Main Course",
        quantity: 1
      }
    ],
    total: 850,
    status: 'preparing',
    createdAt: '2025-01-16 12:15',
    customerInfo: {
      name: 'John Doe',
      email: 'customer@example.com',
      phone: '+977 9876543210',
      address: 'Lalitpur, Nepal'
    }
  },
  {
    id: 3,
    userId: 3,
    items: [
      {
        id: 4,
        name: "Wo (Bara)",
        description: "Traditional black lentil pancake, crispy and flavorful",
        price: 120,
        image: "/Pic/Bara.jpg",
        category: "Snacks",
        quantity: 3
      },
      {
        id: 7,
        name: "Juju Dhau",
        description: "King of yogurt, creamy and sweet Bhaktapur specialty",
        price: 150,
        image: "/Pic/JujuDhau.jpg",
        category: "Desserts",
        quantity: 2
      }
    ],
    total: 660,
    status: 'pending',
    createdAt: '2025-01-16 18:45',
    customerInfo: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+977 9812345678',
      address: 'Bhaktapur, Nepal'
    }
  }
];