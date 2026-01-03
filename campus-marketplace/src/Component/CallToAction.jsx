 

// Layout-only call-to-action section.
function CallToAction() {
  return (
    <section className="container-fluid my-5">
      <div className="card bg-primary text-white">
        <div className="card-body text-center py-5">
          <h3 className="mb-3">Ready to sell your item?</h3>
          <p className="mb-4">Reach thousands of students on campus — it's quick and easy to post an item.</p>
          <div className="d-flex justify-content-center gap-2">
            {/* Link to the Sell page */}
            <a href="/sell"><button className="btn btn-outline-light">post an item</button></a>
            <button className="btn btn-outline-light">Learn more</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CallToAction;
