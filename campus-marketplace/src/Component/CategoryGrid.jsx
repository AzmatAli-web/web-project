import React from 'react';
import { useNavigate } from 'react-router-dom';

function CategoryGrid() {
  const navigate = useNavigate();

  const categories = [
    { id: 'books', name: 'Books', image: 'images/books.jpeg' },
    { id: 'gadgets', name: 'Gadgets', image: '/images/laptop.jpeg' },
    { id: 'stationery', name: 'Stationery', image: '/images/stationary.jpeg' },
    { id: 'accessories', name: 'Accessories', image: '/images/books2.jpeg' }
  ];

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <section className="container-fluid my-4 my-md-5 category-section bg-light">
      <h2 className="h5 mb-3 mb-md-4" style={{ padding: '0 10px' }}>Browse Categories</h2>
      <div className="row g-2 g-md-3 g-lg-4" style={{ padding: '0 5px' }}>
        {categories.map((category) => (
          <div 
            key={category.id}
            className="col-6 col-md-4 col-lg-3 text-center"
          >
            <div 
              className="card shadow-sm p-0 cursor-pointer category-card"
              onClick={() => handleCategoryClick(category.id)}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease', height: '100%', border: 'none' }}
            >
              <img 
                src={category.image} 
                alt={category.name} 
                className="img-fluid" 
                style={{ height: 'clamp(100px, 25vw, 200px)', objectFit: 'cover', width: '100%' }} 
              />
              <div style={{ padding: '10px 8px' }}>
                <h6 className="mb-0" style={{ fontSize: '0.9rem', fontWeight: '600', color: '#2c3e50' }}>{category.name}</h6>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CategoryGrid;