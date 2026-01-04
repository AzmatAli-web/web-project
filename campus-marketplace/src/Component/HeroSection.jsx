import './Herosection.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      // Navigate to search results page with query parameter
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <section className="hero-section container-fluid py-2 py-md-4">
      <div className="hero-wrapper mx-auto px-2 px-md-4" style={{
        maxWidth: '1700px',
        borderRadius: '20px',
        overflow: 'hidden',
        minHeight: 'clamp(300px, 60vw, 600px)'
      }}>
        {/* Background with overlay */}
        <div
          className="hero-background position-relative w-100"
          style={{
            backgroundImage: "url('/images/backgroundimg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            minHeight: 'clamp(300px, 60vw, 600px)',
            width: '100%'
          }}
        >
          {/* Dark overlay for text contrast */}
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{
            background: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1,
            pointerEvents: 'none'
          }}></div>

          {/* Hero Content */}
          <div className="hero-content w-100" style={{
            zIndex: 2,
            padding: 'clamp(1rem, 5vw, 3rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'clamp(300px, 60vw, 600px)',
            position: 'relative'
          }}>
            <div className="container-fluid">
              <div className="text-center" style={{ maxWidth: '95%', margin: '0 auto' }}>
                {/* Responsive Heading */}
                <h1 className="hero-title fw-bold text-white mb-2 mb-md-3" style={{
                  fontSize: 'clamp(1.5rem, 6vw, 3.5rem)',
                  lineHeight: '1.3',
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}>
                  Buy & Sell with Your Campus Community
                </h1>

                {/* Responsive Subtitle */}
                <p className="hero-subtitle text-white-50 mb-3 mb-md-4" style={{
                  fontSize: 'clamp(0.95rem, 3vw, 1.25rem)',
                  lineHeight: '1.5',
                  textShadow: '0 1px 4px rgba(0,0,0,0.2)'
                }}>
                  Find affordable books, gadgets, and supplies from fellow students.
                </p>

                {/* Search Form - Responsive */}
                <form className="hero-search-form d-flex justify-content-center" onSubmit={handleSearch}>
                  <div className="input-group" style={{
                    maxWidth: '95%',
                    width: 'min(500px, 95vw)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search products..."
                      aria-label="Search products"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        padding: 'clamp(0.75rem, 2vw, 0.875rem) 1rem',
                        fontSize: '1rem',
                        borderRadius: '8px 0 0 8px',
                        border: 'none'
                      }}
                    />
                    <button
                      className="btn btn-primary"
                      type="submit"
                      style={{
                        borderRadius: '0 8px 8px 0',
                        border: 'none',
                        minWidth: '50px',
                        fontWeight: 600
                      }}
                    >
                      <span className="d-none d-sm-inline">Search</span>
                      <span className="d-inline d-sm-none">🔍</span>
                    </button>
                  </div>
                </form>

                {/* Quick Categories - Shown on larger screens */}
                <div className="hero-quick-links d-none d-md-flex justify-content-center gap-2 mt-4" style={{
                  flexWrap: 'wrap'
                }}>
                  <span className="badge bg-white text-primary">Books</span>
                  <span className="badge bg-white text-primary">Gadgets</span>
                  <span className="badge bg-white text-primary">Stationery</span>
                  <span className="badge bg-white text-primary">Furniture</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;