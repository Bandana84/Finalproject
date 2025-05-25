import potato1 from './images/potato_image_1.jpg';
import potato2 from './images/potato_image_2.jpg';
import potato3 from './images/potato_image_3.jpg';
import potato4 from './images/potato_image_4.jpg';
import tomato1 from './images/tomato1.jpg';
import tomato2 from './images/tomato2.jpg';
import tomato3 from './images/tomato3.jpg';
import tomato4 from './images/tomato4.jpg';
import mushroom1 from './images/mushroom1.jpg';
import mushroom2 from './images/mushroom2.jpg';
import mushroom3 from './images/mushroom3.jpg';
import mushroom4 from './images/mushroom4.jpg';
import cucumber1 from './images/cucumber1.jpg';
import cucumber2 from './images/cucumber2.jpg';
import cucumber3 from './images/cucumber3.jpg';
import cucumber4 from './images/cucumber4.jpg';
import spinach1 from './images/spinach1.jpg';
import spinach2 from './images/spinach2.jpg';
import spinach3 from './images/spinach3.jpg';
import spinach4 from './images/spinach4.jpg';

import delivery_truck_icon from './images/delivery_truck.jpg';
import leaf_icon from './images/leaf.jpg';
import price_tag_icon from './images/price_tag.jpg';
import shield_icon from './images/shield.jpg';

// ... import all other images
export const dummyProducts = [
    // Vegetables
    {
      _id: "gd46g23h",
      name: "Potato 500g",
      category: "Vegetables",
      price: 25,
      offerPrice: 20,
      image: [potato1, potato2, potato3, potato4], // ✅ Correct (imported variables)
      description: [
        "Fresh and organic",
        "Rich in carbohydrates",
        "Ideal for curries and fries"
      ],
      createdAt: "2025-03-25T07:17:46.018Z",
      updatedAt: "2025-03-25T07:18:13.103Z",
      inStock: true,
    },
    {
      _id: "df67h8k1",
      name: "Tomato 1kg",
      category: "Vegetables",
      price: 30,
      offerPrice: 25,
      image: [tomato1, tomato2, tomato3, tomato4],
      description: [
        "Juicy and ripe",
        "Perfect for salads and sauces",
        "Rich in antioxidants"
      ],
      createdAt: "2025-03-25T07:20:00.018Z",
      updatedAt: "2025-03-25T07:21:10.103Z",
      inStock: true,
    },
    {
      _id: "ha23bf8j",
      name: "Mushroom 1kg",
      category: "Vegetables",
      price: 20,
      offerPrice: 15,
      image: [mushroom1, mushroom2, mushroom3, mushroom4],
      description: [
        "Fresh and organic",
        "Rich in umami flavor",
        "Perfect for stir-fries and soups"
      ],
      createdAt: "2025-03-25T07:22:30.018Z",
      updatedAt: "2025-03-25T07:23:50.103Z",
      inStock: true,
    },
    {
      _id: "kb89zx10",
      name: "Cucumber 500g",
      category: "Vegetables",
      price: 18,
      offerPrice: 15,
      image: [cucumber1, cucumber2, cucumber3, cucumber4],
      description: [
        "Cool and refreshing",
        "Great for hydration",
        "Ideal for salads"
      ],
      createdAt: "2025-03-25T07:24:10.018Z",
      updatedAt: "2025-03-25T07:25:25.103Z",
      inStock: true,
    },
    {
      _id: "vn234ghk",
      name: "Spinach 250g",
      category: "Vegetables",
      price: 22,
      offerPrice: 18,
      image: [spinach1, spinach2, spinach3, spinach4], 
      description: [
        "Rich in iron",
        "Boosts immunity",
        "Fresh and green leaves"
      ],
      createdAt: "2025-03-25T07:26:50.018Z",
      updatedAt: "2025-03-25T07:28:05.103Z",
      inStock: true,
    },
    {
      _id: "pq45ln78",
      name: "Broccoli 500g",
      category: "Vegetables",
      price: 35,
      offerPrice: 30,
      image: ["broccoli_image_1", "broccoli_image_2", "broccoli_image_3", "broccoli_image_4"],
      description: [
        "High in fiber",
        "Perfect for steaming or roasting",
        "Nutrient-dense superfood"
      ],
      createdAt: "2025-03-25T07:29:15.018Z",
      updatedAt: "2025-03-25T07:30:30.103Z",
      inStock: true,
    },
    
  ];

export const features = [
    {
      icon: delivery_truck_icon,
      title: "Fastest Delivery",
      description: "Products in specified time",
    },
    {
      icon: leaf_icon,
      title: "Freshness Guaranteed",
      description: "Fresh produce straight from the farm.",
    },
    {
      icon: price_tag_icon,
      title: "Best Prices",
      description: "Top quality at the most affordable prices.",
    },
    {
      icon: shield_icon,
      title: "Secure Shopping",
      description: "Your personal information is safe with our secure checkout.",
    }
];
  
export const categories = [
    {
      text: "Fresh Fruits",
      path: "Fruits",
      image: "/categories/fruits.jpg",
      bgColor: "#EF60A1"
    },
    {
      text: " Organic Vegetables",
      path: "Vegetables",
      image: "/categories/vegetables.jpg",
      bgColor: "#EF60A2"
    },
    {
      text: "Grains & Pulses",
      path: "Grains-Pulses",
      image: "/categories/grains-pulses.jpg",
      bgColor: "#EF60A3"
    },
    {
      text: "Dairy Products",
      path: "Dairy-Products",
      image: "/categories/dairy-products.jpg",
      bgColor: "#EF60A4"
    },
    {
      text: "Fertilizers",
      path: "Fertilizers",
      image: "/categories/fertilizers.jpg",
      bgColor: "#EF60A5"
    },
    {
      text: "Fishery",
      path: "Fishery",
      image: "/categories/fishery.jpg",
      bgColor: "#EF60A6"
    },
    {
      text: "Flowers",
      path: "Flowers",
      image: "/categories/flowers.jpg",
      bgColor: "#EF60A7"
    },
    {
      text: "Nursery Plants",
      path: "Nursery-Plants",
      image: "/categories/nursery-plants.jpg",
      bgColor: "#EF60A8"
    },
    {
      text: "Poultry Products",
      path: "poultry_products",
      image: "/categories/poultry-products.jpg",
      bgColor: "#EF60A9"
    },
    {
      text: "Spices",
      path: "Spices",
      image: "/categories/spices.jpg",
      bgColor: "#EF60B0"
    },
    {
      text: "Nuts & Dry Fruits",
      path: "Nuts-Dry-Fruits",
      image: "/categories/nuts-dry-fruits.jpg",
      bgColor: "#EF60B1"
    },
    {
      text: "Oils & Ghee",
      path: "Oils_Ghee",
      image: "/categories/oils-ghee.jpg",
      bgColor: "#EF60B2"
    },
    {
      text: "Manure",
      path: "Manure",
      image: "/categories/manure.jpg",
      bgColor: "#EF60B3"
    },
    {
      text: "Coffee & Tea",
      path: "Coffee-Tea",
      image: "/categories/coffee-tea.jpg",
      bgColor: "#EF60B4"
    }
];

  export const Products = [
    // Vegetables
    {
      id: "gd46g23h",
      name: "Potato 500g",
      category: "Vegetables",
      price: 25,
      offerPrice: 20,
      image: [potato1, potato2, potato3, potato4], // 
      description: [
        "Fresh and organic",
        "Rich in carbohydrates",
        "Ideal for curries and fries"
      ],
      createdAt: "2025-03-25T07:17:46.018Z",
      updatedAt: "2025-03-25T07:18:13.103Z",
      inStock: true,
    },
    {
      id: "df67h8k1",
      name: "Tomato 1kg",
      category: "Vegetables",
      price: 30,
      offerPrice: 25,
      image: [tomato1, tomato2, tomato3, tomato4],
      description: [
        "Juicy and ripe",
        "Perfect for salads and sauces",
        "Rich in antioxidants"
      ],
      createdAt: "2025-03-25T07:20:00.018Z",
      updatedAt: "2025-03-25T07:21:10.103Z",
      inStock: true,
    },
    {
      id: "ha23bf8j",
      name: "Mushroom 1kg",
      category: "Vegetables",
      price: 20,
      offerPrice: 15,
      image: [mushroom1, mushroom2, mushroom3, mushroom4],
      description: [
        "Fresh and organic",
        "Rich in umami flavor",
        "Perfect for stir-fries and soups"
      ],
      createdAt: "2025-03-25T07:22:30.018Z",
      updatedAt: "2025-03-25T07:23:50.103Z",
      inStock: true,
    },
    {
      id: "kb89zx10",
      name: "Cucumber 500g",
      category: "Vegetables",
      price: 18,
      offerPrice: 15,
      image: [cucumber1, cucumber2, cucumber3, cucumber4],
      description: [
        "Cool and refreshing",
        "Great for hydration",
        "Ideal for salads"
      ],
      createdAt: "2025-03-25T07:24:10.018Z",
      updatedAt: "2025-03-25T07:25:25.103Z",
      inStock: true,
    },
    {
      id: "vn234ghk",
      name: "Spinach 250g",
      category: "Vegetables",
      price: 22,
      offerPrice: 18,
      image: [spinach1, spinach2, spinach3, spinach4], 
      description: [
        "Rich in iron",
        "Boosts immunity",
        "Fresh and green leaves"
      ],
      createdAt: "2025-03-25T07:26:50.018Z",
      updatedAt: "2025-03-25T07:28:05.103Z",
      inStock: true,
    },
    {
      id: "pq45ln78",
      name: "Broccoli 500g",
      category: "Vegetables",
      price: 35,
      offerPrice: 30,
      image: ["broccoli_image_1", "broccoli_image_2", "broccoli_image_3", "broccoli_image_4"],
      description: [
        "High in fiber",
        "Perfect for steaming or roasting",
        "Nutrient-dense superfood"
      ],
      createdAt: "2025-03-25T07:29:15.018Z",
      updatedAt: "2025-03-25T07:30:30.103Z",
      inStock: true,
    },

    // Nursery Plants
    {
      id: "np001",
      name: "Money Plant",
      category: "nursery_plants",
      price: 150,
      offerPrice: 120,
      image: ["money_plant_1", "money_plant_2", "money_plant_3", "money_plant_4"],
      description: [
        "Easy to care",
        "Air purifying",
        "Perfect for indoor spaces"
      ],
      createdAt: "2025-03-25T07:31:15.018Z",
      updatedAt: "2025-03-25T07:32:15.103Z",
      inStock: true
    },
    {
      id: "np002",
      name: "Peace Lily",
      category: "nursery_plants",
      price: 200,
      offerPrice: 180,
      image: ["peace_lily_1", "peace_lily_2", "peace_lily_3", "peace_lily_4"],
      description: [
        "Beautiful white flowers",
        "Low maintenance",
        "Air purifying"
      ],
      createdAt: "2025-03-25T07:33:15.018Z",
      updatedAt: "2025-03-25T07:34:15.103Z",
      inStock: true
    },
    {
      id: "np003",
      name: "Snake Plant",
      category: "nursery_plants",
      price: 250,
      offerPrice: 220,
      image: ["snake_plant_1", "snake_plant_2", "snake_plant_3", "snake_plant_4"],
      description: [
        "Tolerates low light",
        "Air purifying",
        "Modern look"
      ],
      createdAt: "2025-03-25T07:35:15.018Z",
      updatedAt: "2025-03-25T07:36:15.103Z",
      inStock: true
    },
    {
      id: "np004",
      name: "Spider Plant",
      category: "nursery_plants",
      price: 180,
      offerPrice: 160,
      image: ["spider_plant_1", "spider_plant_2", "spider_plant_3", "spider_plant_4"],
      description: [
        "Easy to propagate",
        "Air purifying",
        "Beautiful variegated leaves"
      ],
      createdAt: "2025-03-25T07:37:15.018Z",
      updatedAt: "2025-03-25T07:38:15.103Z",
      inStock: true
    }
  ];





  
export const dummyAddress = [
  {
    _id: "67b5b9e54ea97f71bbc196a0",
    userId: "67b5880e4d09769c5ca61644",
    firstName: "Great",
    lastName: "Stack",
    email: "user.greatstack@gmail.com",
    street: "Street 123",
    city: "Main City",
    state: "New State",
    zipcode: 123456,
    country: "IN",
    phone: "1234567890",
  },
];

export const dummyOrders = [
  {
    _id: "67e2589a8f87e63366786400",
    userId: "67b5880e4d09769c5ca61644",
    items: [
      {
        product: dummyProducts[3],
        quantity: 2,
        _id: "67e2589a8f87e63366786401",
      },
    ],
    amount: 89,
    address: dummyAddress[0],
    status: "Order Placed",
    paymentType: "Online",
    isPaid: true,
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
  },
  {
    _id: "67e258798f87e633667863f2",
    userId: "67b5880e4d09769c5ca61644",
    items: [
      {
        product: dummyProducts[0],
        quantity: 1,
        _id: "67e258798f87e633667863f3",
      },
      {
        product: dummyProducts[1],
        quantity: 1,
        _id: "67e258798f87e633667863f4",
      },
    ],
    amount: 43,
    address: dummyAddress[0],
    status: "Order Placed",
    paymentType: "COD",
    isPaid: false,
    createdAt: "2025-03-25T07:17:13.068Z",
    updatedAt: "2025-03-25T07:17:13.068Z",
  },
];
