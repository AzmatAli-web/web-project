import React from 'react';
import { useNavigate } from 'react-router-dom';

function CategoryGrid() {
  const navigate = useNavigate();

  const categories = [
    { id: 'books', name: 'Books', image: '/src/assets/images/books.jpeg' },
    { id: 'gadgets', name: 'Gadgets', image: '/src/assets/images/laptop.jpeg' },
    { id: 'stationery', name: 'Stationery', image: '/src/assets/images/stationary.jpeg' },
    { id: 'accessories', name: 'Accessories', image: '/src/assets/images/books2.jpeg' }
  ];

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <section className="container-fluid my-5">
      <h2 className="h5 mb-4">Browse Categories</h2>
      <div className="row g-4" style={{minWidth:'430px'}}>
        {categories.map((category) => (
          <div 
            key={category.id}
            className="col-6 col-md-3 col-lg-3 col-xl-3 text-center"
          >
            <div 
              className="card shadow-sm p-3 cursor-pointer"
              onClick={() => handleCategoryClick(category.id)}
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img 
                src={category.image} 
                alt={category.name} 
                className="img-fluid rounded mb-2" 
                style={{ height: '140px', objectFit: 'cover', width: '100%' }} 
              />
              <h6 className="mb-0">{category.name}</h6>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CategoryGrid;