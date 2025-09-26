

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
    <section className="container-fluid my-5">
      <h2 className="h5 mb-4">Browse Categories</h2>
      <div className="row g-4">
        <div className="col-6 col-md-3 text-center" id="books">
          <div className="card shadow-sm p-3">
            <img src="/src/assets/images/books.jpeg" alt="Books" className="img-fluid rounded mb-2" style={{ height: '140px', objectFit: 'cover', width: '100%' }} />
            <h6 className="mb-0">Books</h6>
          </div>
        </div>

        <div className="col-6 col-md-3 text-center" id="gadgets">
          <div className="card shadow-sm p-3">
            <img src="/src/assets/images/laptop.jpeg" alt="Gadgets" className="img-fluid rounded mb-2" style={{ height: '140px', objectFit: 'cover', width: '100%' }} />
            <h6 className="mb-0">Gadgets</h6>
          </div>
        </div>

        <div className="col-6 col-md-3 text-center" id="stationery">
          <div className="card shadow-sm p-3">
            <img src="/src/assets/images/stationary.jpeg" alt="Stationery" className="img-fluid rounded mb-2" style={{ height: '140px', objectFit: 'cover', width: '100%' }} />
            <h6 className="mb-0">Stationery</h6>
          </div>
        </div>

        <div className="col-6 col-md-3 text-center" id="accessories">
          <div className="card shadow-sm p-3">
            <img src="/src/assets/images/books2.jpeg" alt="Accessories" className="img-fluid rounded mb-2" style={{ height: '140px', objectFit: 'cover', width: '100%' }} />
            <h6 className="mb-0">Accessories</h6>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategoryGrid;
