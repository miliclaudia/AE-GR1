const express = require('express');
const router = express.Router();
const { verifyToken } = require('../utils/token');
const { Cart, CartItem, Product, User } = require('../database/models');

// All routes in this file will be protected
router.use(verifyToken);

// GET /api/cart - Get the current user's cart
router.get('/', async (req, res) => {
    try {
        let cart = await Cart.findOne({
            where: { userId: req.userId },
            include: [{
                model: CartItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product'
                }]
            }]
        });

        if (!cart) {
            cart = await Cart.create({ userId: req.userId });
        }

        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching cart', data: error.message });
    }
});

// POST /api/cart/items - Add a product to the cart or update its quantity
router.post('/items', async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        let cart = await Cart.findOne({ where: { userId: req.userId } });
        if (!cart) {
            cart = await Cart.create({ userId: req.userId });
        }

        let cartItem = await CartItem.findOne({
            where: { cartId: cart.id, productId: productId }
        });

        const currentQuantityInCart = cartItem ? cartItem.quantity : 0;
        const requestedQuantity = currentQuantityInCart + quantity;

        if (product.stock < requestedQuantity) {
            return res.status(400).json({ success: false, message: `Not enough stock. Only ${product.stock} items available.` });
        }

        if (cartItem) {
            cartItem.quantity = requestedQuantity;
            await cartItem.save();
        } else {
            cartItem = await CartItem.create({
                cartId: cart.id,
                productId: productId,
                quantity: quantity
            });
        }

        res.status(201).json({ success: true, data: cartItem });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding item to cart', data: error.message });
    }
});

// PUT /api/cart/items/:id - Update the quantity of a cart item
router.put('/items/:id', async (req, res) => {
    const { quantity } = req.body;
    const { id } = req.params;
    try {
        const cartItem = await CartItem.findByPk(id, { include: [{ model: Product, as: 'product' }] });
        if (!cartItem) {
            return res.status(404).json({ success: false, message: 'Cart item not found' });
        }

        // Check if the cart item belongs to the user's cart
        const cart = await Cart.findOne({ where: { userId: req.userId } });
        if (cartItem.cartId !== cart.id) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }

        if (cartItem.product.stock < quantity) {
            return res.status(400).json({ success: false, message: `Not enough stock. Only ${cartItem.product.stock} items available.` });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        res.status(200).json({ success: true, data: cartItem });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating cart item', data: error.message });
    }
});

// DELETE /api/cart/items/:id - Remove a product from the cart
router.delete('/items/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const cartItem = await CartItem.findByPk(id);
        if (!cartItem) {
            return res.status(404).json({ success: false, message: 'Cart item not found' });
        }

        // Check if the cart item belongs to the user's cart
        const cart = await Cart.findOne({ where: { userId: req.userId } });
        if (cartItem.cartId !== cart.id) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }

        await cartItem.destroy();

        res.status(200).json({ success: true, message: 'Cart item removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error removing cart item', data: error.message });
    }
});


module.exports = router;
