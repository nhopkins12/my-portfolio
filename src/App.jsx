
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const LinkPreviewCard = ({ url = "/blog/getting-started" }) => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setLoading(true);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock preview data based on URL
        const mockPreviews = {
          "/blog/getting-started": {
            title: "Getting Started Guide",
            description: "Learn the basics and get up and running quickly with our comprehensive starter guide. This tutorial covers everything you need to know to become productive.",
            image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23667eea'/><circle cx='100' cy='100' r='20' fill='%23764ba2' opacity='0.7'/><circle cx='300' cy='80' r='30' fill='%23f093fb' opacity='0.6'/><circle cx='200' cy='200' r='25' fill='%234facfe' opacity='0.8'/><text x='200' y='150' text-anchor='middle' fill='white' font-size='24' font-family='Arial'>Guide</text></svg>",
            domain: "yoursite.com"
          },
          "/products/dashboard": {
            title: "Analytics Dashboard",
            description: "Powerful analytics and insights for your business. Track performance, monitor key metrics, and make data-driven decisions with our comprehensive dashboard.",
            image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23ff6b6b'/><rect x='50' y='50' width='300' height='200' fill='white' opacity='0.9' rx='10'/><rect x='70' y='80' width='60' height='100' fill='%23ff6b6b'/><rect x='150' y='120' width='60' height='60' fill='%23ff6b6b'/><rect x='230' y='100' width='60' height='80' fill='%23ff6b6b'/><rect x='310' y='90' width='60' height='90' fill='%23ff6b6b'/></svg>",
            domain: "yoursite.com"
          }
        };

        const previewData = mockPreviews[url] || {
          title: "Page Preview",
          description: "This is a preview of the linked page content with detailed information about what you'll find when you visit this page.",
          image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23999'/></svg>",
          domain: "yoursite.com"
        };

        setPreview(previewData);
        setError(false);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [url]);

  if (loading) {
    return (
      <div 
        className="w-80 h-48 rounded-xl bg-gray-200 animate-pulse flex items-center justify-center border border-gray-300"
        style={{
          transform: 'scale(1)',
          transition: 'transform 0.3s ease-out'
        }}
      >
        <div className="text-gray-500">Loading preview...</div>
      </div>
    );
  }

  if (error || !preview) {
    return (
      <div 
        className="w-80 h-48 rounded-xl bg-gray-300 flex items-center justify-center border border-gray-300"
        style={{
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
      className="relative block w-80 h-48 rounded-xl overflow-hidden shadow-lg border border-gray-300 bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        boxShadow: isHovered ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease-out'
      }}
    >
      {/* Preview Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${preview.image}')`
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
          {preview.domain}
        </div>
        <h3 className="text-white text-xl font-bold mb-3 leading-tight">
          {preview.title}
        </h3>
        <p className="text-gray-100 text-sm leading-relaxed">
          {preview.description}
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
        <div className="p-8 bg-gray-100 min-h-screen flex items-center justify-center gap-8">
          <LinkPreviewCard url="/blog/getting-started" />
          <LinkPreviewCard url="/products/dashboard" />
        </div>
      );
      // <FilterableProductTable products={PRODUCTS} />;
    }
    