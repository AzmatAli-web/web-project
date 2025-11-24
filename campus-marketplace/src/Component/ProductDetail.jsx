import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AddToCartButton from '../Component/Cart/AddToCartButton'; // ✅ ADD THIS IMPORT

function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();

  // Extended product data with Pakistani details
  const allProducts = [
    // ... your existing products array (keep all your products as they are)
    // ========== BOOKS CATEGORY ==========
    {
      id: 1,
      name: "Used Calculus Book",
      price: 500,
      category: "books",
      image: "/images/books.jpeg", // ✅ CHANGED: Use public folder path
      description: "This calculus textbook is in excellent condition with minimal highlighting. Perfect for first-year engineering students at NUST or FAST University. Covers all essential topics including derivatives, integrals, and multivariable calculus.",
      condition: "Good",
      seller: "Azmat Ali",
      contact: "0300-1234567",
      location: "abbotabad, Mirpur",
      postedDate: "2024-01-15",
      specifications: {
        "Author": "James Stewart",
        "Edition": "8th Edition",
        "Year": "2020",
        "Pages": "1200",
        "Publisher": "Cengage Learning",
        "Language": "URDU and English"
      }
    },
    {
      id: 2,
      name: "Software Engineering",
      price: 600,
      category: "books",
      image: "/images2/software.jpeg",
      description: "Comprehensive software engineering textbook used in CS programs at LUMS and UET. Covers SDLC, Agile methodologies, and software design patterns. Includes solved examples and practice problems.",
      condition: "Like New",
      seller: "Ahmad Raza",
      contact: "0333-9876543",
      location: " abbotabad, Jinnahabad",
      postedDate: "2024-01-10",
      specifications: {
        "Author": "Ian Sommerville",
        "Edition": "10th Edition", 
        "Year": "2019",
        "Pages": "800",
        "Publisher": "Pearson",
        "Language": "English"
      }
    },
    {
      id: 3,
      name: "DSA in Python Textbook",
      price: 400,
      category: "books",
      image: "/images2/dsainpython.jpg",
      description: "Perfect book for computer science students learning Data Structures and Algorithms in Python. Includes coding examples and interview preparation questions. Used by students at COMSATS and FAST.",
      condition: "Very Good",
      seller: "Fatima Noor",
      contact: "0312-5556677",
      location: "Karachi, Gulshan-e-Iqbal",
      postedDate: "2024-01-08",
      specifications: {
        "Author": "Michael T. Goodrich",
        "Edition": "1st Edition",
        "Year": "2021",
        "Pages": "750",
        "Publisher": "Wiley",
        "Language": "English"
      }
    },
    {
      id: 4,
      name: "DSA in Java Textbook",
      price: 350,
      category: "books",
      image: "/images2/dsainjava.jpg",
      description: "Complete guide to Data Structures and Algorithms in Java. Essential for software engineering students at PUCIT and UET. Includes practical implementations and coding exercises.",
      condition: "Good",
      seller: "Bilal Ahmed",
      contact: "0345-7788990",
      location: "Rawalpindi, Bahria Town",
      postedDate: "2024-01-12",
      specifications: {
        "Author": "Robert Lafore",
        "Edition": "2nd Edition",
        "Year": "2018",
        "Pages": "680",
        "Publisher": "Sams Publishing",
        "Language": "English"
      }
    },
    {
      id: 5,
      name: "Calculus Textbook",
      price: 4500,
      category: "books",
      image: "/images2/calc.jpg",
      description: "Brand new calculus textbook for beginners. Perfect for pre-engineering students or first semester mathematics. Includes solved examples and practice problems with step-by-step solutions.",
      condition: "New",
      seller: "Sara Khan",
      contact: "0321-4455667",
      location: "Islamabad, F-10",
      postedDate: "2024-01-05",
      specifications: {
        "Author": "Ron Larson",
        "Edition": "11th Edition",
        "Year": "2022",
        "Pages": "1150",
        "Publisher": "Cengage",
        "Language": "English"
      }
    },
    {
      id: 6,
      name: "Software Handwritten Notes",
      price: 350,
      category: "books",
      image: "/images2/handwritten.jpg",
      description: "Complete handwritten notes for Software Engineering course. Compiled by a NUST graduate with excellent grades. Includes diagrams, flowcharts, and important concepts highlighted.",
      condition: "Good",
      seller: "Usman Sheikh",
      contact: "0301-9988776",
      location: "Islamabad, H-13",
      postedDate: "2024-01-14",
      specifications: {
        "Subject": "Software Engineering",
        "Pages": "150",
        "University": "NUST",
        "Semester": "5th",
        "Quality": "Neat Handwriting"
      }
    },

    // ========== GADGETS CATEGORY ==========
    {
      id: 7,
      name: "Second-hand Dell Laptop",
      price: 30000,
      category: "gadgets",
      image: "/images2/dell.jpg",
      description: "Dell Inspiron laptop in perfect working condition. Ideal for programming, assignments, and online classes. Battery life 4-5 hours. Comes with original charger and carrying bag.",
      condition: "Good",
      seller: "Ali Hassan",
      contact: "0333-1122334",
      location: "Lahore, Johar Town",
      postedDate: "2024-01-12",
      specifications: {
        "Brand": "Dell",
        "Model": "Inspiron 15",
        "RAM": "8GB DDR4",
        "Storage": "256GB SSD",
        "Processor": "Intel Core i5 8th Gen",
        "Screen Size": "15.6 inch",
        "Battery Life": "4-5 hours"
      }
    },
    {
      id: 8,
      name: "Scientific Calculator",
      price: 1500,
      category: "gadgets",
      image: "/images2/calc2.jpg",
      description: "Casio scientific calculator perfect for engineering students. Supports complex calculations, trigonometry, and statistical functions. Like new condition with original packaging.",
      condition: "Like New",
      seller: "Zainab Malik",
      contact: "0314-6677889",
      location: "Karachi, North Nazimabad",
      postedDate: "2024-01-09",
      specifications: {
        "Brand": "Casio",
        "Model": "fx-991ES",
        "Functions": "417",
        "Power": "Solar + Battery",
        "Display": "Dot Matrix"
      }
    },
    {
      id: 9,
      name: "Graphing Calculator",
      price: 1500,
      category: "gadgets",
      image: "/images2/cal1.jpg",
      description: "Advanced graphing calculator for engineering and mathematics students. Can plot graphs, solve equations, and perform complex calculations. Essential for exams and assignments.",
      condition: "Very Good",
      seller: "Omar Farooq",
      contact: "0302-3344556",
      location: "Rawalpindi, Satellite Town",
      postedDate: "2024-01-11",
      specifications: {
        "Brand": "Texas Instruments",
        "Model": "TI-84 Plus",
        "Color": "Black",
        "Memory": "480 KB",
        "Connectivity": "USB"
      }
    },
    {
      id: 10,
      name: "HP Laptop",
      price: 80000,
      category: "gadgets",
      image: "/images2/hplap.jpg",
      description: "HP Pavilion laptop in excellent condition. Perfect for computer science students for coding, video editing, and gaming. High performance with dedicated graphics card.",
      condition: "Very Good",
      seller: "Hamza Iqbal",
      contact: "0331-5566778",
      location: "Islamabad, E-11",
      postedDate: "2024-01-07",
      specifications: {
        "Brand": "HP",
        "Model": "Pavilion 15",
        "RAM": "16GB DDR4",
        "Storage": "512GB SSD",
        "Processor": "Intel Core i7 10th Gen",
        "Graphics": "NVIDIA GeForce GTX",
        "Screen": "15.6 inch FHD"
      }
    },
    {
      id: 11,
      name: "Huawei Laptop",
      price: 100000,
      category: "gadgets",
      image: "/images2/huawei.jpg",
      description: "Huawei MateBook in pristine condition. Lightweight and powerful, perfect for students who need portability. Excellent battery life and stunning display.",
      condition: "Like New",
      seller: "Ayesha Rahman",
      contact: "0346-8899001",
      location: "Lahore, Cantt",
      postedDate: "2024-01-06",
      specifications: {
        "Brand": "Huawei",
        "Model": "MateBook D15",
        "RAM": "16GB DDR4",
        "Storage": "512GB SSD",
        "Processor": "Intel Core i7 11th Gen",
        "Screen": "15.6 inch IPS",
        "Weight": "1.5 kg"
      }
    },

    // ========== STATIONERY CATEGORY ==========
    {
      id: 12,
      name: "Geometry Complete Set Box",
      price: 180,
      category: "stationery",
      image: "/images2/statcompbox.jpg",
      description: "Complete geometry set including compass, divider, ruler, protractor, and pencils. Perfect for engineering and architecture students. Durable plastic case.",
      condition: "New",
      seller: "Rashid Mahmood",
      contact: "0307-2233445",
      location: "Karachi, Gulistan-e-Johar",
      postedDate: "2024-01-13",
      specifications: {
        "Items": "Compass, Divider, Ruler, Protractor",
        "Material": "Plastic & Metal",
        "Color": "Transparent",
        "Brand": "Dollar"
      }
    },
    {
      id: 13,
      name: "Notebook Set",
      price: 200,
      category: "stationery",
      image: "/images2/stat1.jpg",
      description: "Set of 5 high-quality notebooks for different subjects. Each notebook has 120 pages with premium paper quality. Perfect for university students.",
      condition: "New",
      seller: "Saima Akhtar",
      contact: "0322-7788990",
      location: "Islamabad, I-8",
      postedDate: "2024-01-10",
      specifications: {
        "Quantity": "5 Notebooks",
        "Pages per Notebook": "120",
        "Paper Quality": "Premium",
        "Cover": "Hard Cover"
      }
    },
    {
      id: 14,
      name: "Pen Collection",
      price: 150,
      category: "stationery",
      image: "/images2/stat2.jpg",
      description: "Collection of 10 high-quality pens for smooth writing. Includes different colors and tip sizes. Perfect for note-taking and assignments.",
      condition: "New",
      seller: "Nasir Ahmed",
      contact: "0335-4455667",
      location: "Rawalpindi, Westridge",
      postedDate: "2024-01-08",
      specifications: {
        "Quantity": "10 Pens",
        "Colors": "Blue, Black, Red",
        "Type": "Ballpoint",
        "Brand": "Piano and others"
      }
    },

    // ========== ACCESSORIES CATEGORY ==========
    {
      id: 15,
      name: "File Folder",
      price: 150,
      category: "accessories",
      image: "/images2/filefolder.jpg",
      description: "Sturdy file folder for organizing documents, assignments, and certificates. Multiple compartments for different subjects. Durable material.",
      condition: "New",
      seller: "Kashif Mehmood",
      contact: "0311-6677889",
      location: "Lahore, Model Town",
      postedDate: "2024-01-11",
      specifications: {
        "Material": "Plastic",
        "Compartments": "5",
        "Color": "Black",
        "Size": "A4"
      }
    },
    {
      id: 16,
      name: "Book Cover",
      price: 80,
      category: "accessories",
      image: "/images2/bookcvr1.jpg",
      description: "Protective plastic covers for textbooks. Keep your books safe from damage and spills. Transparent design shows book title.",
      condition: "New",
      seller: "Tahir Mahmood",
      contact: "0304-9988776",
      location: "Karachi, Korangi",
      postedDate: "2024-01-09",
      specifications: {
        "Material": "Plastic",
        "Transparency": "Clear",
        "Size": "Fits all textbooks",
        "Pack": "5 covers"
      }
    },
    {
      id: 17,
      name: "Lunch Box",
      price: 1200,
      category: "accessories",
      image: "/images2/lunchbox.jpg",
      description: "High-quality insulated lunch box for students. Keeps food warm for hours. Multiple compartments for different food items. Leak-proof design.",
      condition: "Like New",
      seller: "Nadia Shah",
      contact: "0336-5544332",
      location: "abbotabad, Jinnahabad",
      postedDate: "2024-01-07",
      specifications: {
        "Material": "Plastic & Insulation",
        "Compartments": "3",
        "Capacity": "1.5 L",
        "Feature": "Heat Insulated"
      }
    },
    {
      id: 18,
      name: "Water Bottle",
      price: 1200,
      category: "accessories",
      image: "/images2/watterbottle.jpg",
      description: "Stainless steel water bottle with thermal insulation. Keeps water cold for 24 hours or hot for 12 hours. Perfect for long university days.",
      condition: "New",
      seller: "Faisal Nadeem",
      contact: "0320-1122334",
      location: "Abbotabad, Jinnahabad",
      postedDate: "2024-01-06",
      specifications: {
        "Material": "Stainless Steel",
        "Capacity": "1 Liter",
        "Insulation": "Double Wall",
        "Feature": "BPA Free"
      }
    },
    {
      id: 19,
      name: "Umbrella",
      price: 1200,
      category: "accessories",
      image: "/images2/umbrella.jpg",
      description: "Large automatic umbrella with windproof design. Perfect for rainy season in Pakistan. Compact and easy to carry in backpack.",
      condition: "New",
      seller: "Maria Saeed",
      contact: "0315-6655443",
      location: "abbotabad, Jinnahabad",
      postedDate: "2024-01-05",
      specifications: {
        "Type": "Automatic Open/Close",
        "Size": "Large (48 inch)",
        "Material": "Fiberglass & Polyester",
        "Feature": "Windproof"
      }
    }
  ];

  
  // Find the specific product by ID
  const product = allProducts.find(p => p.id === parseInt(productId));

  // If product not found
  if (!product) {
    return (
      <div className="container-fluid py-5">
        <div className="container text-center">
          <h2>Product Not Found</h2>
          <button 
            onClick={() => navigate(-1)}
            className="btn btn-primary mt-3"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleContactSeller = () => {
    alert(`Contacting seller: ${product.seller}\nPhone: ${product.contact}\nLocation: ${product.location}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // ✅ CREATE PRODUCT OBJECT FOR AddToCartButton
  const productForCart = {
    _id: product.id.toString(), // Convert to string for MongoDB-like ID
    name: product.name,
    price: product.price,
    image: product.image,
    status: 'available' // All products are available
  };

  return (
    <div className="container-fluid py-5 bg-light">
      <div className="container">
        {/* Back Button */}
        <button 
          onClick={handleGoBack}
          className="btn btn-outline-secondary mb-4"
        >
          ← Back to Products
        </button>

        {/* Product Details Card */}
        <div className="card shadow-lg">
          <div className="row g-0">
            {/* Product Image */}
            <div className="col-md-6">
              <img 
                src={product.image} 
                alt={product.name}
                className="img-fluid rounded-start h-100"
                style={{ objectFit: 'cover', minHeight: '500px' }}
              />
            </div>
            
            {/* Product Information */}
            <div className="col-md-6">
              <div className="card-body p-4">
                <h1 className="h2 fw-bold text-dark mb-3">{product.name}</h1>
                <p className="h3 text-primary mb-4">Rs. {product.price}</p>
                
                {/* ✅ ADDED: Add to Cart Button */}
                <div className="mb-4">
                  <AddToCartButton 
                    product={productForCart}
                    size="lg"
                    showQuantity={true}
                  />
                </div>

                {/* Product Details */}
                <div className="mb-4">
                  <h5 className="fw-bold mb-3">Product Details</h5>
                  <div className="row">
                    <div className="col-6 mb-2">
                      <strong>Category:</strong> 
                      <span className="text-capitalize"> {product.category}</span>
                    </div>
                    <div className="col-6 mb-2">
                      <strong>Condition:</strong> {product.condition}
                    </div>
                    <div className="col-6 mb-2">
                      <strong>Seller:</strong> {product.seller}
                    </div>
                    <div className="col-6 mb-2">
                      <strong>Contact:</strong> {product.contact}
                    </div>
                    <div className="col-6 mb-2">
                      <strong>Location:</strong> {product.location}
                    </div>
                    <div className="col-6 mb-2">
                      <strong>Posted:</strong> {product.postedDate}
                    </div>
                  </div>
                </div>

                {/* Specifications */}
                {product.specifications && (
                  <div className="mb-4">
                    <h5 className="fw-bold mb-3">Specifications</h5>
                    <div className="row">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="col-6 mb-2">
                          <strong>{key}:</strong> {value}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="mb-4">
                  <h5 className="fw-bold mb-3">Description</h5>
                  <p className="text-muted">{product.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="d-grid gap-2">
                  <button 
                    onClick={handleContactSeller}
                    className="btn btn-primary btn-lg py-3"
                  >
                    📞 Contact Seller - {product.contact}
                  </button>
                  <button className="btn btn-outline-secondary">
                    💬 Send WhatsApp Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;