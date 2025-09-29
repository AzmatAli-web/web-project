import React from 'react';

// ProductCard displays an item image and basic meta. Props: image, title, price
function ProductCard({ image, title, price }) {
  return (
    <article className="card">
      <img src={image} alt={title} className="card-img-top" style={{ height: '180px', objectFit: 'cover' }} />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text  mb-3">Rs. {price}</p>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <div className="btn-group">
            <button className="btn btn-sm btn-outline-primary">View</button>
            <button className="btn btn-sm btn-primary">Contact</button>
          </div>
          <div className="text-muted">Just now</div>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
