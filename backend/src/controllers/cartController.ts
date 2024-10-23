import { Request, Response } from 'express';
import prisma from '../db/prisma.js';  // Adjust the path according to your project structure





/** 
1. Add to Cart
-- Check if the user-product mapping exists
SELECT * FROM mapping 
WHERE userId = '<userId>' AND productId = '<productId>';

-- If exists and stock is sufficient, update the count
UPDATE mapping 
SET count = count + <parsedCount> 
WHERE id = '<existingMapping.id>';

-- If not exists, insert a new row in mapping
INSERT INTO mapping (userId, productId, count) 
VALUES ('<userId>', '<productId>', <parsedCount>);
 */

export const addToCart = async (req: Request, res: Response) => {
    try {
        const { userId, productId, count } = req.body;
        const parsedCount = parseInt(count, 10)

        const existingMapping = await prisma.mapping.findFirst({
            where: {
                userId: userId,
                productId: productId
            },
            include:{product:true}
        });

        if (existingMapping ) {
            if(existingMapping.product.count - parsedCount < 0){
                res.status(403).json({success:false, msg:"Not enough stock"})
                return 
            }

            const updatedMapping = await prisma.mapping.update({
                where: { id: existingMapping.id },
                data: { count: { increment: parsedCount } }
            });
            res.status(200).json({ success: true, data: updatedMapping });
        } else {

            const newMapping = await prisma.mapping.create({
                data: {
                    userId: userId,
                    productId: productId,
                    count: parsedCount
                }
            });
            res.status(200).json({ success: true, data: newMapping });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: String(err) });
    }
};


/**
 * 
 2. Remove from Cart
-- Check if the user-product mapping exists
SELECT * FROM mapping 
WHERE userId = '<userId>' AND productId = '<productId>';

-- If count is greater than the parsedCount, decrease the count
UPDATE mapping 
SET count = count - <parsedCount> 
WHERE id = '<existingMapping.id>';

-- If count is less than or equal to parsedCount, delete the mapping
DELETE FROM mapping 
WHERE id = '<existingMapping.id>';
 * 
 */


export const removeFromCart = async (req: Request, res: Response) => {
    try {
        const { userId, productId, count } = req.body;
        const parsedCount = parseInt(count, 10)


        const existingMapping = await prisma.mapping.findFirst({
            where: {
                userId: userId,
                productId: productId
            }
        });

        if (existingMapping) {
            if (existingMapping.count > parsedCount) {
                // If there's more than the specified count, decrease the count
                const updatedMapping = await prisma.mapping.update({
                    where: { id: existingMapping.id },
                    data: { count: { decrement: parsedCount } }
                });
                res.status(200).json({ success: true, data: updatedMapping });
            } else {
                // If the count to remove is greater than or equal to the existing count, remove the product from the cart
                await prisma.mapping.delete({
                    where: { id: existingMapping.id }
                });
                res.status(200).json({ success: true, message: 'Product removed from cart' });
            }
        } else {
            res.status(404).json({ success: false, message: 'Product not found in cart' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: String(err) });
    }
};


/** 
 * 
 * 
 3. Change Cart Item Count
-- Check if the user-product mapping exists
SELECT * FROM mapping 
WHERE userId = '<userId>' AND productId = '<productId>';

-- If exists, update the count
UPDATE mapping 
SET count = <parsedCount> 
WHERE id = '<existingMapping.id>';

-- If not exists, insert a new row in mapping
INSERT INTO mapping (userId, productId, count) 
VALUES ('<userId>', '<productId>', <parsedCount>);
 * 
 */

export const change = async (req: Request, res: Response) => {
    try {
        const { userId, productId, count } = req.body;
        const parsedCount = parseInt(count, 10)

        const existingMapping = await prisma.mapping.findFirst({
            where: {
                userId: userId,
                productId: productId
            },
            include:{product:true}
        });

        if (existingMapping ) {

            const updatedMapping = await prisma.mapping.update({
                where: { id: existingMapping.id },
                data: { count:  parsedCount  }
            });
            res.status(200).json({ success: true, data: updatedMapping });
        } else {

            const newMapping = await prisma.mapping.create({
                data: {
                    userId: userId,
                    productId: productId,
                    count: parsedCount
                }
            });
            res.status(200).json({ success: true, data: newMapping });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: String(err) });
    }
};



/**  
 * 
 *4 .Fetch all products in the user's cart
SELECT * FROM mapping 
JOIN product ON mapping.productId = product.id 
WHERE userId = '<userId>';
 * 
 */



export const getCart = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const cartItems = await prisma.mapping.findMany({
            where: { userId: userId },
            include: { product: true }
        });

        res.status(200).json({ success: true, data: cartItems });
    } catch (err) {
        res.status(500).json({ success: false, message: String(err) });
    }
};

