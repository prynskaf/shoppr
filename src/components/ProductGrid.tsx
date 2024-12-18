'use client'
import React from 'react'
import { Product } from '../../sanity.types'
import { AnimatePresence, motion } from 'framer-motion';
import ProductThumb from './ProductThumb';

const ProductGrid = ({ products }: { products: Product[] }) => {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-4  mt-4'>
            <AnimatePresence>
                {products?.map((product) => {
                    return (
                        <motion.div
                            key={product._id}
                            layout
                            initial={{ opacity: 0.2 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className='flex justify-center'
                        >
                            <ProductThumb product={product} />
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    )
}

export default ProductGrid


