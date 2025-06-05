import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import RatingReviewSection from "../pages/RatingReviewSection";
import { useAuth } from "../context/AuthContext";



const ProductDetails = () => {
  const { products, navigate, currency, addToCart } = useAppContext();
  const { id } = useParams();

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  const product = products.find((item) => String(item?.id) === String(id));

  useEffect(() => {
    if (products.length > 0 && product) {
      const filteredProducts = products.filter(
        (item) =>
          item?.id !== product?.id && item?.category === product?.category
      );
      setRelatedProducts(filteredProducts.slice(0, 5));
    }
  }, [products, product]);

  const getImageUrl = (imgPath) => {
    if (!imgPath) return '';
    if (imgPath.startsWith('http')) return imgPath;
    return `http://localhost:8000/media/${imgPath}`; // FIXED: Added /media/
  };

  useEffect(() => {
    if (Array.isArray(product?.images) && product.images.length > 0) {
      setThumbnail(getImageUrl(product.images[0].image));
    }
  }, [product]);

  if (!product) {
    return <div>Product not found or loading...</div>;
  }

  return (
    <div className="mt-12">
      <p>
        <Link to="/">Home</Link> /
        <Link to="/products"> Products</Link> /
        <Link to={`/products/${product?.category?.toLowerCase?.() || "unknown"}`}>
          {" "}
          {product.category}
        </Link>
        <span className="text-primary"> {product.name}</span>
      </p>

      <div className="flex flex-col md:flex-row gap-16 mt-4">
        <div className="flex gap-3">
          <div className="flex flex-col gap-3">
            {Array.isArray(product.images) &&
              product.images.map((imgObj, index) => (
                <div
                  key={index}
                  onClick={() => setThumbnail(getImageUrl(imgObj.image))}
                  className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer"
                >
                  <img src={getImageUrl(imgObj.image)} alt={`Thumbnail ${index + 1}`} />
                </div>
              ))}
          </div>

          {thumbnail && (
            <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
              <img src={thumbnail} alt="Selected product" />
            </div>
          )}
        </div>

        <div className="text-sm w-full md:w-1/2">
          <h1 className="text-3xl font-medium">{product.name}</h1>

          <div className="flex items-center gap-0.5 mt-1">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  src={i < 4 ? "/star_icon.svg" : "/star_dull_icon.svg"}
                  alt=""
                  className="md:w-4 w-3.5"
                />
              ))}
            <p className="text-base ml-2">(4)</p>
          </div>

          <div className="mt-6">
            <p className="text-gray-500/70 line-through">
              MRP: {currency}{product.price}
            </p>
            <p className="text-2xl font-medium">
              MRP: {currency}{product.offer_price}
            </p>
            <span className="text-gray-500/70">(inclusive of all taxes)</span>
            <div className="mt-4">
              <span className={`px-3 py-1 rounded-full text-sm ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>

          <p className="text-base font-medium mt-6">About Product</p>
          <ul className="list-disc ml-4 text-gray-500/70">
            {Array.isArray(product.description)
              ? product.description.map((desc, index) => (
                  <li key={index}>{desc}</li>
                ))
              : <li>{product.description}</li>}
          </ul>

          <div className="flex items-center mt-10 gap-4 text-base">
            <button
              onClick={() => addToCart(product.id)}
              className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                addToCart(product.id);
                navigate("/cart");
              }}
              className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-indigo-600 transition"
            >
              Buy now
            </button>
          </div>
        </div>
      </div>

<RatingReviewSection productId={product.id} />
      <div className="flex flex-col items-center mt-20">
        <div className="flex flex-col items-center w-max">
          <p className="text-3xl font-medium">Related Product</p>
          <div className="w-20 h-05 bg-primary rounded-full mt-2"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 w-full">
          {relatedProducts
            .filter((product) => product.inStock)
            .map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
        </div>
        <button
          onClick={() => {
            navigate(`/products/${product.category.toLowerCase().replace(/\s+/g, '_')}`);
            window.scrollTo(0, 0);
          }}
          className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition"
        >
          See More
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
