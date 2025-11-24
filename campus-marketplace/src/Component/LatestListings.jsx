import ProductCard from './ProductCard';

// ✅ UPDATED: Include full product data for AddToCart
const sampleProducts = [
  { 
    id: 1, 
    image: '/images/books2.jpeg', 
    title: 'Used Calculus Book', 
    price: 500,
    name: 'Used Calculus Book', // ✅ ADD name for AddToCart
    status: 'available'
  },
  { 
    id: 4, 
    image: '/images/books.jpeg', 
    title: 'Lecture Notes Bundle', 
    price: 500,
    name: 'Lecture Notes Bundle', // ✅ ADD name for AddToCart
    status: 'available'
  },
  { 
    id: 3, 
    image: '/images/calculater.jpeg', 
    title: 'Graphing Calculator', 
    price: 1500,
    name: 'Graphing Calculator', // ✅ ADD name for AddToCart
    status: 'available'
  },
  { 
    id: 2, 
    image: '/images/laptop.jpeg', 
    title: 'Second-hand Laptop', 
    price: 30000,
    name: 'Second-hand Laptop', // ✅ ADD name for AddToCart
    status: 'available'
  },
];

function LatestListings() {
  return (
    <section className="container-fluid my-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h1 mb-0">Listed recently</h2>
        <a href="" className="small">View all</a>
      </div>

      <div className="row g-3">
        {sampleProducts.map((product) => ( // ✅ CHANGED: p → product
          <div className="col-6 col-md-3" key={product.id}>
            <div className="rounded">
              {/* ✅ UPDATED: Pass full product object instead of separate props */}
              <ProductCard product={product} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default LatestListings;