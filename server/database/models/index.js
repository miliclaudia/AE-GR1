const User = require('./User');
const Product = require('./Product');
const Cart = require('./Cart');
const CartItem = require('./CartItem');

// Associations

// User-Cart (One-to-One)
User.hasOne(Cart, {
  foreignKey: 'userId',
  as: 'cart'
});
Cart.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Cart-CartItem (One-to-Many)
Cart.hasMany(CartItem, {
  foreignKey: 'cartId',
  as: 'items'
});
CartItem.belongsTo(Cart, {
  foreignKey: 'cartId',
  as: 'cart'
});

// Product-CartItem (One-to-Many)
Product.hasMany(CartItem, {
  foreignKey: 'productId',
  as: 'cartItems'
});
CartItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product'
});


module.exports = { User, Product, Cart, CartItem };