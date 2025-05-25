import React from 'react'
import { useAppContext } from '../context/AppContext';
const ProductCard = ({product}) => {

   const { currency, addToCart, removeFromCart, cartItems, navigate}= useAppContext();
  
  const getImageUrl = (imgObj) => {
    if (!imgObj || !imgObj.image) return '/placeholder.png';
    if (imgObj.image.startsWith('http')) return imgObj.image;
    return `http://localhost:8000${imgObj.image.startsWith('/') ? '' : '/media/'}${imgObj.image}`;
  };

  return product &&(
      <div onClick={()=> {navigate(`/products/${product.category.toLowerCase()}/${product.id}`);scrollTo(0,0)}}className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-56 max-w-56 w-full">
          <div className="group cursor-pointer flex items-center justify-center px-2">
              <img className="group-hover:scale-105 transition max-w-26 md:max-w-36" src={product.images && product.images.length > 0 ? getImageUrl(product.images[0]) : '/placeholder.png'} alt={product.name} />
          </div>
          <div className="text-gray-500/60 text-sm">
              <p>{product.category}</p>
              <p className="text-gray-700 font-medium text-lg truncate w-full">{product.name}</p>
             
              <div className="flex items-end justify-between mt-3">
                  <p className="md:text-xl text-base font-medium text-primary">
                      {currency}{product.offer_price} {" "}<span className="text-gray-500/60 md:text-sm text-xs line-through">{currency}${product.price}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <div onClick={(e) => {e.stopPropagation();}} className="text-primary">
                      {!cartItems[product.id]?.quantity ? (
                          <button className="flex items-center justify-center gap-1 bg-indigo-100 border border-indigo-300 md:w-[80px] w-[64px] h-[34px] rounded cursor-pointer" onClick={() => addToCart(product.id)} >
                              <img src="/cart_icon.svg" alt="carticon"/>
                              Add
                          </button>
                      ) : (
                          <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/25 rounded select-none">
                              <button onClick={() =>{removeFromCart(product.id)} } className="cursor-pointer text-md px-2 h-full" >
                                  -
                              </button>
                              <span className="w-5 text-center">{cartItems[product.id]?.quantity}</span>
                              <button onClick={() => {addToCart(product.id) }}className="cursor-pointer text-md px-2 h-full" >
                                  +
                              </button>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      </div>
  );
};
export default ProductCard;