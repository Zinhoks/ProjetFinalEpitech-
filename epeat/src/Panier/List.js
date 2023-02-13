import React, { useEffect, useState } from "react";


  const products = [
       {
          id:'1',
          name: 'Macbook',
          price: 140,
       },
       {
          id:'2',
          name: 'iphone',
          price: 14,
       },
       {
          id:'3',
          name: 'airpods',
          price: 89,
       },
       {
          id:'4',
          name: 'ipad',
          price: 190,
       },

  ]


const List = () => {
//Add to cart
  const [cartItems, setCartItems] = useState([]);
  const onAdd = (product) => {
    const exist = cartItems.find((x) => x.id === product.id);
    if (exist) {
      const newCartItems = cartItems.map((x) =>
        x.id === product.id ? { ...exist, qty: exist.qty + 1 } : x
      );
      setCartItems(newCartItems);
      localStorage.setItem('cartItems', JSON.stringify(newCartItems));

    } else {
      const newCartItems = [...cartItems, { ...product, qty: 1 }];
      setCartItems(newCartItems);
      localStorage.setItem('cartItems', JSON.stringify(newCartItems));
    }
  };
  const onRemove = (product) => {
    const exist = cartItems.find((x) => x.id === product.id);
    if(exist.qty ===1){
        const newCartItems = cartItems.filter((x) => x.id!==product.id);
        setCartItems(newCartItems);
        localStorage.setItem('cartItems', JSON.stringify(newCartItems));

    }else {
        const newCartItems = cartItems.map((x)=> 
        x.id === product.id ? {...exist, qty: exist.qty -1} : x
        );
        setCartItems(newCartItems);
        localStorage.setItem('cartItems', JSON.stringify(newCartItems));

    }
  }
  useEffect(() => {
setCartItems(localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems'))
: [] );
  },[])
  // Count item in cart
  let countCartItems = cartItems.length;

  console.log(countCartItems);

  //Price 
  console.log(cartItems)
  console.log(cartItems.reduce((a, c) => a + c.qty * c.Dish_Price,0))
  const itemsPrice = cartItems.reduce((a, c) => a + c.qty * c.price,0);
  const taxPrice = itemsPrice * 0.14;
  const shippingPrice =  20;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;
  console.log(itemsPrice)
  

  return (
    <div>
        <aside> <h2>

            Cart Items 
        </h2>
        <div>
            {cartItems.length === 0 && <div> Cart is empty</div>}
            {cartItems.map((item)=> (
                <div key={item.id}>
                    <div>{item.name}</div>
                    <div>
                        <button onClick={()=> onRemove(item)}>-</button>
                        <button onClick={()=> onAdd(item)}>+</button>

                    </div>
                    <div> {item.qty} x ${item.price.toFixed(2)}
                    </div>

                </div>
            ))}
            {cartItems.length !==0 &&(
                <>
                <hr />
                <div>
                    Items Price
                </div>
                <div> ${itemsPrice.toFixed(2)}</div>
                <div>
                    Tax Price
                </div>
                <div> ${taxPrice.toFixed(2)}</div>
                <div>
                    Shipping Price
                </div>
                <div> ${shippingPrice.toFixed(2)}</div>
                <div>
                    Total Price
                </div>
                <div> ${totalPrice.toFixed(2)}</div>
                <hr />
                </>
            )}
        </div>
            </aside>
      <a href="#">
        <h2>Test Cart </h2>
      </a>
      <div>
        {" "}
        <a href="#">
          Cart{" "}
          {countCartItems ? (
            <button className="badge">{countCartItems}</button>
          ) : (
            ""
          )}
        </a>{" "}
      </div>

      <h1> products </h1>
      <div>
        {products.map((product) => (
          <div key={products.id}>
            <h3>
              {product.name} {product.price}
            </h3>
            <div>
                
              <button onClick={() => onAdd(product)}>Add to cart</button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default List;
