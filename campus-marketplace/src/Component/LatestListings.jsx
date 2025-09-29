
 
import ProductCard from './ProductCard';

const sampleProducts = [
  { id: 1, image: '/src/assets/images/books2.jpeg', title: 'Used Calculus Book', price: 500 },
  { id: 2, image: '/src/assets/images/laptop.jpeg', title: 'Second-hand Laptop', price: 30000 },
  { id: 3, image: '/src/assets/images/calculater.jpeg', title: 'Graphing Calculator', price: 1500 },
  { id: 4, image: '/src/assets/images/books.jpeg', title: 'Lecture Notes Bundle', price: 500 },
];

function LatestListings() {
  return (
    <section className="container-fluid my-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h1 mb-0">Listed recently</h2>
        <a href="" className="small">View all</a>
      </div>

      <div className="row g-3">
        {sampleProducts.map((p) => (
          <div className="col-6 col-md-3" key={p.id}>
            <div className="rounded">
              <ProductCard image={p.image} title={p.title} price={p.price} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default LatestListings;
