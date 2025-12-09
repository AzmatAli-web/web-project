const Cart = require('../models/cart');
const Product = require('../models/product');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_51SYsgX0xHe8lXm4KsItpcvO5UYTf0G9OEbkCP361Jj4XGC70txhIDlDs1tz62mbxCGOXdv4eNdhTs2y8W7Svtq2700YUFCuJUA');

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

// @desc    Create Stripe Checkout Session
// @route   POST /api/cart/create-checkout-session
// @access  Private
const createCheckoutSession = async (req, res) => {
    const userId = req.user.id;
    try {
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const line_items = cart.items
            .filter(item => item.product) // Filter out items with null product
            .map(item => {
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: item.product.name,
                        },
                        unit_amount: item.product.price * 100,
                    },
                    quantity: item.quantity,
                };
            });
        
        if (line_items.length === 0) {
            return res.status(400).json({ message: 'No valid items in cart' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL || 'https://web-project-theta-gray.vercel.app'}/cart?payment_success=true`,
            cancel_url: `${process.env.FRONTEND_URL || 'https://web-project-theta-gray.vercel.app'}/cart`,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};


module.exports = {
    addToCart,
    getCart,
    removeFromCart,
    clearCart,
    createCheckoutSession
};
