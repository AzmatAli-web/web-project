import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  // Sample product data with MULTIPLE ITEMS for each category
  const allProducts = [
    // ========== BOOKS CATEGORY - Multiple Books ==========
    {
      id: 1,
      name: "Used Calculus Book",
      price: 500,
      category: "books",
      image: "/src/assets/images2/books.jpeg",
      description: "Great condition calculus book for engineering students"
    },
    {
      id: 2,
      name: "Software Engineering",
      price: 600,
      category: "books",
      image: "/src/assets/images2/software.jpeg",
      description: "Software engineering books second hand, lightly used"
    },
    {
      id: 3,
      name: "dsa in phython Textbook",
      price: 400,
      category: "books",
      image: "/src/assets/images2/dsainpython.jpg",
      description: " Data Structures and Algorithms in Python"
    },
    {
      id: 4,
      name: "dsa in java Textbook",
      price: 350,
      category: "books",
      image: "/src/assets/images2/dsainjava.jpg",
      description: " Data Structures and Algorithms in Java"
    },
    {
      id: 5,
      name: "calculus Textbook",
      price: 4500,
      category: "books",
      image: "/src/assets/images2/calc.jpg",
      description: "calculus Textbook for beginners"
    },
    {
      id: 6,
      name: "software handwrttin notes",
      price: 350,
      category: "books",
      image: "/src/assets/images2/handwritten.jpg",
      description: " full software engineering hand written notes"
    },

    // ========== GADGETS CATEGORY - Multiple Gadgets ==========
    {
      id: 7,
      name: "Second-hand Laptop",
      price: 30000,
      category: "gadgets",
      image: "/src/assets/images2/dell.jpg",
      description: "Dell laptop, 8GB RAM, 256GB SSD, good condition"
    },
    {
      id: 8,
      name: "simple Calculator",
      price: 1500,
      category: "gadgets",
      image: "/src/assets/images2/calc2.jpg",
      description: "simple calculator for engineering students"
    },
    {
      id: 9,
      name: "Graphing Calculator",
      price: 1500,
      category: "gadgets",
      image: "/src/assets/images2/cal1.jpg",
      description: "Scientific calculator for engineering students"
    },
    {
      id: 10,
      name: "hp laptop",
      price: 80000,
      category: "gadgets",
      image: "/src/assets/images2/hplap.jpg",
      description: " hp laptop, 16GB RAM, 512GB ssd, fair condition"
    },
    {
      id: 11,
      name: "huawei laptop",
      price: 100000,
      category: "gadgets",
      image: "/src/assets/images2/huawei.jpg",
      description: " huawei laptop, 16GB RAM, 512GB ssd, fair condition"
    },

    // ========== STATIONERY CATEGORY - Multiple Items ==========
    {
      id: 12,
      name: "complete set Box",
      price: 180,
      category: "stationery",
      image: "/src/assets/images2/statcompbox.jpg",
      description: "Complete set with compass and ruler and pen etc"
    },
    {
      id: 13,
      name: "Notebook Set",
      price: 200,
      category: "stationery",
      image: "/src/assets/images2/stat1.jpg",
      description: "Set of 5 notebooks for different subjects"
    },
    {
      id: 14,
      name: "Pen Collection",
      price: 150,
      category: "stationery",
      image: "/src/assets/images2/stat2.jpg",
      description: "10 high-quality pens for smooth writing"
    },

    // ========== ACCESSORIES CATEGORY - Multiple Items ==========
    {
      id: 15,
      name: "file folder",
      price: 150,
      category: "accessories",
      image: "/src/assets/images2/filefolder.jpg",
      description: "file folder for keeping documents organized"
    },
    {
      id: 16,
      name: "Book Cover",
      price: 80,
      category: "accessories",
      image: "/src/assets/images2/bookcvr1.jpg",
      description: "Protective cover for textbooks"
    },
    {
      id: 17,
      name: "lunch box",
      price: 1200,
      category: "accessories",
      image: "/src/assets/images2/lunchbox.jpg",
      description: "Waterproof backpack for college students"
    },
    {
      id: 18,
      name: "watter bottle",
      price: 1200,
      category: "accessories",
      image: "/src/assets/images2/watterbottle.jpg",
      description: " watter bottle for daily use"
    },
    {
      id: 19,
      name: "umbrella",
      price: 1200,
      category: "accessories",
      image: "/src/assets/images2/umbrella.jpg",
      description: "umbrella for rainy season"
    }
  ];

  // Filter products by the current category
  const categoryProducts = allProducts.filter(product => 
    product.category === categoryId
  );

  // Category titles for display
  const categoryTitles = {
    books: "Books",
    gadgets: "Gadgets", 
    stationery: "Stationery",
    accessories: "Accessories"
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="container py-5">
      <div className="container">
        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="h2 fw-bold">{categoryTitles[categoryId] || categoryId} Store</h1>
            <p className="text-muted">
              Found {categoryProducts.length} products in {categoryTitles[categoryId]?.toLowerCase() || categoryId}
            </p>
          </div>
        </div>

        {/* Products Grid - Shows MULTIPLE PRODUCTS */}
        <div className="row g-4">
          {categoryProducts.length > 0 ? (
            categoryProducts.map(product => (
              <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div 
                  className="card h-100 shadow-sm" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleProductClick(product.id)}
                >
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="card-img-top"
                    style={{ 
                      height: '200px', 
                      objectFit: 'cover',
                      width: '100%'  // Changed from fixed 300px to 100% for responsiveness
                    }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text flex-grow-1 text-muted small">
                      {product.description}
                    </p>
                    <div className="mt-auto">
                      <p className="h5 text-primary mb-2">Rs. {product.price}</p>
                      <button 
                        className="btn btn-primary w-100 btn-sm"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click when button is clicked
                          handleProductClick(product.id);
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <h3 className="text-muted">No products found</h3>
              <p>Check back later for new products!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;