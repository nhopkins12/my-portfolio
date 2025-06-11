
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const LinkPreviewCard = ({ url, className = "" }) => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setLoading(true);
        setError(false);
        
        // Call your preview API
        const response = await fetch(`http://localhost:5000/api/preview?url=${encodeURIComponent(url)}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const previewData = await response.json();
        
        // Fallback image if none found
        if (!previewData.image) {
          previewData.image = `https://via.placeholder.com/400x300/667eea/ffffff?text=${encodeURIComponent(previewData.domain)}`;
        }
        
        setPreview(previewData);
        
      } catch (err) {
        console.error('Failed to fetch preview:', err);
        setError(true);
        
        // Fallback preview data
        setPreview({
          title: 'Unable to load preview',
          description: 'Click to visit this page',
          image: 'https://via.placeholder.com/400x300/999999/ffffff?text=Preview+Unavailable',
          domain: url.replace(/^https?:\/\//, '').split('/')[0],
          url: url
        });
        
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchPreview();
    }
  }, [url]);

  if (loading) {
    return (
      <div 
        className={`w-80 h-48 rounded-xl bg-gray-200 animate-pulse flex items-center justify-center border border-gray-300 ${className}`}
        style={{
          flexShrink: 0,
          transform: 'scale(1)',
          transition: 'transform 0.3s ease-out'
        }}
      >
        <div className="text-gray-500">Loading preview...</div>
      </div>
    );
  }

  if (error && !preview) {
    return (
      <div 
        className={`w-80 h-48 rounded-xl bg-gray-300 flex items-center justify-center border border-gray-300 ${className}`}
        style={{
          flexShrink: 0,
          transform: 'scale(1)',
          transition: 'transform 0.3s ease-out'
        }}
      >
        <div className="text-gray-600">Preview unavailable</div>
      </div>
    );
  }

  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative block w-80 h-48 rounded-xl overflow-hidden shadow-lg border border-gray-300 bg-white ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        flexShrink: 0,
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        boxShadow: isHovered ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease-out'
      }}
    >
      {/* Preview Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-gray-100"
        style={{
          backgroundImage: `url('${preview?.image}')`
        }}
      />
      
      {/* Information overlay */}
      <div 
        className="absolute inset-0 flex flex-col justify-end p-6"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.4), transparent)',
          transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.4s ease-out'
        }}
      >
        <div className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: '#93c5fd' }}>
          {preview?.domain}
        </div>
        <h3 className="text-white text-xl font-bold mb-3 leading-tight">
          {preview?.title}
        </h3>
        <p className="text-gray-100 text-sm leading-relaxed">
          {preview?.description}
        </p>
      </div>
    </a>
  );
};


// FilterableProductTable
  // SearchBar
  // ProductTable
    // ProductCategoryRow
    // ProductRow

    function ProductCategoryRow({ category }) {
      return (
        <tr>
          <th colSpan="2">
            {category}
          </th>
        </tr>
      );
    }
    
    function ProductRow({ product }) {
      const name = product.stocked ? product.name :
        <span style={{ color: 'red' }}>
          {product.name}
        </span>;
    
      return (
        <tr>
          <td>{name}</td>
          <td>{product.price}</td>
        </tr>
      );
    }
    
    function ProductTable({ products, filterText, inStockOnly }) {
      const rows = [];
      let lastCategory = null;
    
      products.forEach((product) => {
        if (
          product.name.toLowerCase().indexOf(
            filterText.toLowerCase()
          ) === -1
        ) {
          return;
        }
        if (inStockOnly && !product.stocked) {
          return;
        }
        if (product.category !== lastCategory) {
          rows.push(
            <ProductCategoryRow
              category={product.category}
              key={product.category} />
          );
        }
        rows.push(
          <ProductRow
            product={product}
            key={product.name} />
        );
        lastCategory = product.category;
      });
    
      return (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      );
    }
    
    function SearchBar({filterText, inStockOnly, onFilterTextChange, onInStockOnlyChange}) {
      return (
        <form>
          <input type="text" value={filterText} placeholder="Search..." onChange={(e) => onFilterTextChange(e.target.value)} />
          <label>
            <input type="checkbox" value={inStockOnly} onChange={(e) => onInStockOnlyChange(e.target.checked)}/>
            {' '}
            Only show products in stock
          </label>
        </form>
      );
    }
    
    function FilterableProductTable({ products }) {
      const [search, setSearch] = useState('')
      const [inStock, setInStock] = useState(false)
      return (
        <div>
          <SearchBar 
            filterText={search} 
            inStockOnly={inStock}
            onFilterTextChange={setSearch}
            onInStockOnlyChange={setInStock}
            />
          <ProductTable 
            products={products}
            filterText={search}
            inStockOnly={inStock} />
        </div>
      );
    }
    
    const PRODUCTS = [
      {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
      {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
      {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
      {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
      {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
      {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
    ];
    
    export default function App() {
      return (
        <>
          <div className="p-8 bg-gray-100 min-h-screen flex items-center justify-center gap-8">
            
          <h1>Noah Hopkins</h1>
            <LinkPreviewCard url="https://github.com" />
            <LinkPreviewCard url="https://stackoverflow.com" />
          </div>
          </>
        );
      
      // <FilterableProductTable products={PRODUCTS} />;
    }
    