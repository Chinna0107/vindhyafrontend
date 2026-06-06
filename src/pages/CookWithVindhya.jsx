import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiUsers, FiStar, FiChevronDown, FiChevronUp, FiShoppingCart, FiMessageCircle } from 'react-icons/fi';
import './Cook.css';

const WHATSAPP_NUMBER = '919949085469';

const recipes = [
  {
    id: 1,
    title: 'Palli Karam Rice',
    subtitle: 'Hot steaming rice mixed with Palli Karam Podi and ghee — the ultimate Telangana comfort meal',
    time: '10 min',
    servings: '2 servings',
    difficulty: 'Easy',
    image: 'https://snakzee.com/_next/image?url=%2Fproducts%2FPodis_Powders%2FPeanut_Spice_Powder.jpg&w=3840&q=75',
    ingredientsQuery: 'Hi, I would like to order Palli Karam Podi for the Palli Karam Rice recipe.',
    steps: [
      'Cook 1 cup of rice and let it cool slightly so grains stay separate.',
      'Add 2-3 tbsp Vindhya Palli Podi directly onto the hot rice.',
      'Add 1 tbsp of ghee and mix gently until evenly coated.',
      'Garnish with roasted peanuts and curry leaves. Serve hot!'
    ]
  },
  {
    id: 2,
    title: 'Spicy Podi Dosa',
    subtitle: 'Crispy dosa sprinkled generously with Idli Podi and ghee — a South Indian breakfast dream',
    time: '15 min',
    servings: '2 servings',
    difficulty: 'Easy',
    image: 'https://snakzee.com/_next/image?url=%2Fproducts%2FPodis_Powders%2FIdli_Podi.jpg&w=3840&q=75',
    ingredientsQuery: 'Hi, I would like to order Idli Podi for the Spicy Podi Dosa recipe.',
    steps: [
      'Prepare dosa batter and heat a tawa (griddle).',
      'Pour batter and spread it thin.',
      'Sprinkle a generous amount of Vindhya Idli Podi all over the dosa.',
      'Drizzle ghee around the edges and on top. Cook until crispy and serve hot!'
    ]
  },
  {
    id: 3,
    title: 'Instant Pulihora',
    subtitle: 'Tangy tamarind rice made instantly with our Pulihora Paste — perfect for festivals and lunchboxes',
    time: '15 min',
    servings: '4 servings',
    difficulty: 'Easy',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWX8yC_HB8Ss8YIKWNJgkc8G3pmLp-ed-Pnw&s',
    ingredientsQuery: 'Hi, I would like to order Pulihora Paste for the Instant Pulihora recipe.',
    steps: [
      'Cook 2 cups of rice and spread it on a wide plate to cool.',
      'Add 3-4 tbsp of Vindhya Pulihora Paste to the cooled rice.',
      'Add a little warm oil and mix thoroughly until the paste coats the rice evenly.',
      'Let it rest for 30 mins for the flavors to absorb before serving.'
    ]
  },
  {
    id: 4,
    title: 'Traditional Sambar',
    subtitle: 'Rich, aromatic sambar made with our stone-ground Sambar Podi — perfect with rice, idli or dosa',
    time: '30 min',
    servings: '4 servings',
    difficulty: 'Medium',
    image: 'https://snakzee.com/_next/image?url=%2Fproducts%2FPodis_Powders%2FSambar_Powder.jpg&w=3840&q=75',
    ingredientsQuery: 'Hi, I would like to order Sambar Podi for the Traditional Sambar recipe.',
    steps: [
      'Boil toor dal and set aside. Extract tamarind juice.',
      'In a pot, boil vegetables with tamarind juice and salt.',
      'Add 2 tbsp of Vindhya Sambar Podi and mix well.',
      'Add the boiled dal, let it simmer, and finish with a mustard seed and curry leaf tempering.'
    ]
  }
];

const bulkItems = [
  { name: 'మురుకులు', price: '₹250', quantity: '500g' },
  // { name: 'నిప్పట్లు', price: '₹220', quantity: '500g' },
  { name: 'జంతికలు', price: '₹240', quantity: '500g' },
  { name: 'డ్రై ఫ్రూట్స్ కారం బూందీ', price: '₹350', quantity: '500g' },
  // { name: 'నవధాన్యాల మిక్స్చర్', price: '₹280', quantity: '500g' },
  { name: 'కార్న్ ఫ్లేక్స్ మిక్స్చర్', price: '₹260', quantity: '500g' },
  { name: 'మిల్లెట్ మిక్స్చర్', price: '₹300', quantity: '500g' },
  { name: 'బటర్ మురుకులు', price: '₹280', quantity: '500g' },
  { name: 'గవ్వలు', price: '₹230', quantity: '500g' },
  { name: 'రిబ్బన్ మురుకులు', price: '₹250', quantity: '500g' },
  { name: 'చేగోడీలు', price: '₹280', quantity: '500g' },
  { name: 'సన్నకరపూస', price: '₹260', quantity: '500g' },
  { name: 'కజ్జికాయలు', price: '₹350', quantity: '500g' },
  { name: 'పల్లీ లడ్డు', price: '₹300', quantity: '500g' },
  { name: 'అత్రసాలు/అరిసెలు', price: '₹400', quantity: '500g' },
  { name: 'నవధాన్యాల లడ్డు', price: '₹350', quantity: '500g' },
  { name: 'ప్రోటీన్ లడ్డు', price: '₹400', quantity: '500g' },
  { name: 'మిల్లెట్ లడ్డు', price: '₹350', quantity: '500g' },
  { name: 'డ్రై ఫ్రూట్స్ లడ్డు', price: '₹500', quantity: '500g' },
  { name: 'ఓట్స్ లడ్డు', price: '₹320', quantity: '500g' },
  { name: 'బేసన్ లడ్డు', price: '₹350', quantity: '500g' },
  { name: 'రవ్వ లడ్డు', price: '₹320', quantity: '500g' },
  { name: 'సున్నుండాలు', price: '₹450', quantity: '500g' },
  // { name: 'శంకరపాళీ', price: '₹280', quantity: '500g' },
  // { name: 'సాంబార్ పొడి', price: '₹180', quantity: '250g' },
  { name: 'రసం పొడి', price: '₹160', quantity: '250g' },
  { name: 'ఇడ్లీ పొడి', price: '₹170', quantity: '250g' },
  { name: 'కంది పొడి', price: '₹180', quantity: '250g' },
  { name: 'పల్లి కారం పొడి', price: '₹200', quantity: '250g' },
  { name: 'కరివేపాకు పొడి', price: '₹200', quantity: '250g' },
  // { name: 'వాంగీ బాత్ పొడి', price: '₹190', quantity: '250g' },
  { name: 'వెల్లుల్లి కారం పొడి', price: '₹200', quantity: '250g' },
  { name: 'పులిహోర పేస్ట్', price: '₹180', quantity: '250g' },
  // { name: 'బిసి బేలె బాత్ పొడి', price: '₹190', quantity: '250g' },
  { name: 'జంతికాల వడియాలు', price: '₹200', quantity: '250g' },
  { name: 'పూల వడియాలు', price: '₹220', quantity: '250g' },
  { name: 'రైస్ పాపడ్లు', price: '₹180', quantity: '250g' },
  { name: 'రవ్వ పాపడ్లు', price: '₹190', quantity: '250g' },
  { name: 'సగ్గు బియ్యం అప్పడాలు', price: '₹200', quantity: '250g' },
  { name: 'గుమ్మడికాయ వడియాలు', price: '₹220', quantity: '250g' },
  { name: 'మజ్జిగ మిర్చి', price: '₹200', quantity: '250g' },
  { name: 'మినప వడియాలు', price: '₹220', quantity: '250g' }
];

export default function CookWithVindhya() {
  const [openRecipeId, setOpenRecipeId] = useState(null);
  const [bulkQuantities, setBulkQuantities] = useState({});

  const toggleRecipe = (id) => {
    setOpenRecipeId(openRecipeId === id ? null : id);
  };

  const handleOrderIngredients = (query) => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  };

  const handleItemClick = (name) => {
    if (!bulkQuantities[name]) {
      setBulkQuantities(prev => ({ ...prev, [name]: 5 }));
    }
  };

  const handleIncrement = (e, name) => {
    e.stopPropagation();
    setBulkQuantities(prev => ({ ...prev, [name]: (prev[name] || 0) + 5 }));
  };

  const handleDecrement = (e, name) => {
    e.stopPropagation();
    setBulkQuantities(prev => {
      const newQuantity = (prev[name] || 0) - 5;
      if (newQuantity <= 0) {
        const newState = { ...prev };
        delete newState[name];
        return newState;
      }
      return { ...prev, [name]: newQuantity };
    });
  };

  const handleBulkOrderSubmit = () => {
    const items = Object.entries(bulkQuantities);
    if (items.length === 0) return;

    const itemsList = items.map(([name, qty]) => `${name} (${qty} units)`).join(', ');
    const query = `Hi, I am planning an event and would like to place a bulk order for: ${itemsList}. Please let me know the process.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="cook-page">
      <div className="cook-header">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1>Cook with Vindhya</h1>
            <p>Quick, delicious recipes using our products — from easy breakfasts to festive feasts</p>
          </motion.div>
        </div>
      </div>

      <div className="container">
        <div className="recipes-list">
          {recipes.map(recipe => (
            <motion.div key={recipe.id} className="recipe-card glass-panel"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}>
              <div className="recipe-img-box">
                <img src={recipe.image} alt={recipe.title} className="recipe-img" />
              </div>
              <div className="recipe-info">
                <h2>{recipe.title}</h2>
                <p className="recipe-subtitle">{recipe.subtitle}</p>
                <div className="recipe-meta">
                  <span><FiClock /> {recipe.time}</span>
                  <span><FiUsers /> {recipe.servings}</span>
                  <span><FiStar /> {recipe.difficulty}</span>
                </div>

                <AnimatePresence>
                  {openRecipeId === recipe.id && (
                    <motion.div className="recipe-steps"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}>
                      {recipe.steps.map((step, idx) => (
                        <div key={idx} className="recipe-step">
                          <div className="step-num">{idx + 1}</div>
                          <div className="step-text">{step}</div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="recipe-actions">
                  <button className="btn-toggle-recipe" onClick={() => toggleRecipe(recipe.id)}>
                    {openRecipeId === recipe.id ? (
                      <><FiChevronUp /> Hide Steps</>
                    ) : (
                      <><FiChevronDown /> View Recipe</>
                    )}
                  </button>
                  <button className="btn-order-ingredients" onClick={() => handleOrderIngredients(recipe.ingredientsQuery)}>
                    <FiShoppingCart /> Order Ingredients
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bulk-section glass-panel">
          <div className="bulk-header">
            <h2>Planning an Event?</h2>
            <p>Weddings, housewarmings, festivals, or corporate events — we handle bulk orders with custom packaging and special pricing</p>
          </div>

          <div className="bulk-grid">
            {bulkItems.map((item, idx) => {
              const qty = bulkQuantities[item.name] || 0;
              const isSelected = qty > 0;

              return (
                <div key={idx}
                  className={`bulk-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleItemClick(item.name)}>
                  <div className="bulk-item-name">{item.name}</div>
                  <div className="bulk-item-price">{item.price}/{item.quantity}</div>

                  {isSelected ? (
                    <div className="bulk-quantity-controls">
                      <button className="qty-btn" onClick={(e) => handleDecrement(e, item.name)}>-</button>
                      <span className="qty-val">{qty}</span>
                      <button className="qty-btn" onClick={(e) => handleIncrement(e, item.name)}>+</button>
                    </div>
                  ) : (
                    <div className="bulk-check">+</div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bulk-footer">
            <p>👆 Select products above to build your bulk order</p>
            <button
              className={`btn-bulk-submit ${Object.keys(bulkQuantities).length > 0 ? 'active' : ''}`}
              onClick={handleBulkOrderSubmit}
              disabled={Object.keys(bulkQuantities).length === 0}
            >
              <FiMessageCircle /> Continue to Order ({Object.keys(bulkQuantities).length} Items)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
