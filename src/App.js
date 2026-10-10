import {useEffect, useState} from 'react'
import './App.css'

const API_URL =
  'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details'

const App = () => {
  const [restaurantData, setRestaurantData] = useState(null)
  const [activeCategory, setActiveCategory] = useState(0)
  const [cart, setCart] = useState({})

  useEffect(() => {
    const getRestaurantData = async () => {
      const response = await fetch(API_URL)
      const data = await response.json()

      setRestaurantData(data[0])
    }

    getRestaurantData()
  }, [])

  const updateQuantity = (dishId, value) => {
    setCart(prevCart => {
      const currentQuantity = prevCart[dishId] || 0

      // Don't allow quantity to go below 0
      if (value === -1 && currentQuantity === 0) {
        return prevCart
      }

      const newQuantity = currentQuantity + value

      return {
        ...prevCart,
        [dishId]: newQuantity,
      }
    })
  }

  const getCartCount = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0)
  }

  if (restaurantData === null) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    )
  }

  const categories = restaurantData.table_menu_list
  const selectedCategory = categories[activeCategory]
  const dishes = selectedCategory.category_dishes

  return (
    <div className="restaurant-container">
      {/* Header */}
      <header className="header">
        <h1>{restaurantData.restaurant_name}</h1>

        <div className="header-right">
          <p>My Orders</p>

          <div className="cart-container">
            <span className="cart-icon">🛒</span>

            <span className="cart-count">{getCartCount()}</span>
          </div>
        </div>
      </header>

      {/* Categories */}
      <div className="categories-container">
        {categories.map((category, index) => (
          <button
            type="button"
            key={category.menu_category_id}
            className={
              activeCategory === index
                ? 'category-button active-category'
                : 'category-button'
            }
            onClick={() => setActiveCategory(index)}
          >
            {category.menu_category}
          </button>
        ))}
      </div>

      {/* Dishes */}
      <main className="menu-container">
        {dishes.map(dish => {
          const quantity = cart[dish.dish_id] || 0

          return (
            <div className="dish-card" key={dish.dish_id}>
              <div className="dish-details">
                <div className="dish-title-container">
                  <span
                    className={
                      dish.dish_Type === 2
                        ? 'food-type veg'
                        : 'food-type non-veg'
                    }
                  >
                    ●
                  </span>

                  <h2>{dish.dish_name}</h2>
                </div>

                <p className="price">
                  {dish.dish_currency} {dish.dish_price}
                </p>

                <p className="description">{dish.dish_description}</p>

                <p className="calories">{dish.dish_calories} calories</p>

                {dish.addonCat.length > 0 && dish.dish_Availability && (
                  <p className="customization">Customizations available</p>
                )}

                {!dish.dish_Availability && (
                  <p className="unavailable">Not available</p>
                )}

                {dish.dish_Availability && (
                  <div className="quantity-container">
                    <button
                      type="button"
                      onClick={() => updateQuantity(dish.dish_id, -1)}
                    >
                      -
                    </button>

                    <p>{quantity}</p>

                    <button
                      type="button"
                      onClick={() => updateQuantity(dish.dish_id, 1)}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

              <img
                src={dish.dish_image}
                alt={dish.dish_name}
                className="dish-image"
              />
            </div>
          )
        })}
      </main>
    </div>
  )
}

export default App
