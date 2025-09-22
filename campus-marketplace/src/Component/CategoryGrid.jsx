

const categories = [
  { name: 'Books & Notes', icon: '📚' },
  { name: 'Gadgets', icon: '💻' },
  { name: 'Stationery', icon: '✏️' },
  { name: 'Miscellaneous', icon: '🎒' },
];

import React from 'react';

// Layout-only category grid using Bootstrap classes. Icons are placeholders (book, pencil, gadget, tag).
function CategoryGrid() {
  return (
    <section className="container my-5">
      <h2 className="h4 mb-4">Browse Categories</h2>
      <div className="row g-3">
        <div className="col-6 col-md-3" id="books">
          <div className="card h-100 text-center">
            <img src="/src/assets/images/books.jpeg" className="card-img-top" alt="Books" style={{ height: '140px', objectFit: 'cover' }} />
            <div className="card-body">
              <h6 className="card-title mb-0">Books</h6>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3" id="gadgets">
          <div className="card h-100 text-center">
            <img src="/src/assets/images/laptop.jpeg" className="card-img-top" alt="Gadgets" style={{ height: '140px', objectFit: 'cover' }} />
            <div className="card-body">
              <h6 className="card-title mb-0">Gadgets</h6>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3" id="stationery">
          <div className="card h-100 text-center">
            <img src="/src/assets/images/stationary.jpeg" className="card-img-top" alt="Stationery" style={{ height: '140px', objectFit: 'cover' }} />
            <div className="card-body">
              <h6 className="card-title mb-0">Stationery</h6>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3" id="accessories">
          <div className="card h-100 text-center">
            <img src="/src/assets/images/books2.jpeg" className="card-img-top" alt="Accessories" style={{ height: '140px', objectFit: 'cover' }} />
            <div className="card-body">
              <h6 className="card-title mb-0">Accessories</h6>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategoryGrid;
