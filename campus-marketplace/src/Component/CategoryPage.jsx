import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AddToCartButton from './Cart/AddToCartButton'; // ✅ ADD THIS IMPORT

function CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  // Sample product data with MULTIPLE ITEMS for each category
  const allProducts = [
    // ... your existing products array (keep all products as they are)
    // ========== BOOKS CATEGORY - Multiple Books ==========
    {
      id: 1,
      name: "Used Calculus Book",
      price: 500,
      category: "books",
      image: "/images2/books.jpeg",
      description: "Great condition calculus book for engineering students",
      status: 'available' // ✅ ADD status field
    },
    {
      id: 2,
      name: "Software Engineering",
      price: 600,
      category: "books",
      image: "/images2/software.jpeg",
      description: "Software engineering books second hand, lightly used",
      status: 'available' // ✅ ADD status field
    },
    // ... add status: 'available' to ALL your products
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
                      width: '100%'
                    }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text flex-grow-1 text-muted small">
                      {product.description}
                    </p>
                    <div className="mt-auto">
                      <p className="h5 text-primary mb-2">Rs. {product.price}</p>
                      
                      {/* ✅ ADDED: Add to Cart Button */}
                      <div className="mb-2">
                        <AddToCartButton 
                          product={{
                            _id: product.id.toString(),
                            name: product.name,
                            price: product.price,
                            image: product.image,
                            status: product.status || 'available'
                          }}
                          size="sm"
                          showQuantity={false}
                        />
                      </div>
                      
                      <button 
                        className="btn btn-outline-primary w-100 btn-sm"
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