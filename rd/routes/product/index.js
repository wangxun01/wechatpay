import express from 'express';
import {MongodbApi} from '../../mongodb/index.js';

const router = express.Router();

router.get('/getProducts', async (req, res, _) => {
    const products = await MongodbApi.getProducts('products');

    if (products) {
        return res.status(200).json({
            message: 'success',
            products
        });
    }

    res.status(500).json({
        message: 'failed',
        info: 'server error'
    });
});

const product = router;
export {
    product
}