const Cart = require('../models/cart');
const Product = require('../models/product');

// @desc    Add product to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ user: userId });

        if (cart) {
            // Cart exists for user
            let itemIndex = cart.items.findIndex(p => p.product.toString() === productId);

            if (itemIndex > -1) {
                // Product exists in the cart, update the quantity
                let productItem = cart.items[itemIndex];
                productItem.quantity += quantity || 1;
                cart.items[itemIndex] = productItem;
            } else {
                // Product does not exists in cart, add new item
                cart.items.push({ product: productId, quantity: quantity || 1 });
            }
            cart = await cart.save();
            await cart.populate('items.product');
            return res.status(200).json(cart);
        } else {
            // No cart for user, create new cart
            const newCart = await Cart.create({
                user: userId,
                items: [{ product: productId, quantity: quantity || 1 }]
            });
            await newCart.populate('items.product');
            return res.status(201).json(newCart);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    const userId = req.user.id;
    try {
        let cart = await Cart.findOne({ user: userId }).populate({
            path: 'items.product',
            select: 'name price image' // Keep populating the base fields
        });

        if (!cart) {
            // If no cart, create an empty one
            cart = new Cart({ user: userId, items: [] });
            await cart.save();
        }

        const cartObj = cart.toObject();
        if (cartObj.items && cartObj.items.length > 0) {
            cartObj.items = cartObj.items.map(item => {
                if (item.product && item.product.image) {
                    const baseUrl = `${req.protocol}://${req.get('host')}`;
                    item.product.imageUrl = `${baseUrl}${item.product.image}`;
                } else if (item.product) {
                    item.product.imageUrl = null;
                }
                return item;
            });
        }
        res.status(200).json(cartObj);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeFromCart = async (req, res) => {
    const { itemId } = req.params; // This is product ID
    const userId = req.user.id;

    try {
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(p => p.product.toString() === itemId);

        if (itemIndex > -1) {
            cart.items.splice(itemIndex, 1);
            cart = await cart.save();
            await cart.populate('items.product');
            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// @desc    Clear all items from cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
    const userId = req.user.id;

    try {
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        } else {
            cart.items = [];
        }
        
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};


module.exports = {
    addToCart,
    getCart,
    removeFromCart,
    clearCart
};
