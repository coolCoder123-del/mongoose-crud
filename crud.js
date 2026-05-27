import mongoose from 'mongoose';

// 1. Define the Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [3, 'Product name must be at least 3 characters long'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Electronics', 'Books', 'Clothing', 'Home & Kitchen', 'Beauty'],
        message: '{VALUE} is not a supported category',
      },
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// 2. Create the Model
export const Product = mongoose.model('Product', productSchema);

// 3. Connection Helpers
export async function connectDB(uri) {
  try {
    await mongoose.connect(uri);
    console.log('\x1b[32m%s\x1b[0m', 'Successfully connected to MongoDB.');
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'Error connecting to MongoDB:', error.message);
    throw error;
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log('\x1b[36m%s\x1b[0m', 'Disconnected from MongoDB.');
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'Error disconnecting from MongoDB:', error.message);
  }
}

// 4. CRUD Operations

/**
 * Create/Insert a new product document.
 * @param {Object} productData - The product details.
 * @returns {Promise<Document>} The created product document.
 */
export async function createProduct(productData) {
  try {
    const product = new Product(productData);
    const savedProduct = await product.save();
    console.log('\x1b[32m%s\x1b[0m', `[CREATE] Product created: "${savedProduct.name}" (ID: ${savedProduct._id})`);
    return savedProduct;
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '[CREATE] Error creating product:', error.message);
    throw error;
  }
}

/**
 * Fetch/Read products matching a query filter.
 * @param {Object} filter - MongoDB query filter.
 * @returns {Promise<Array>} List of matching documents.
 */
export async function fetchProducts(filter = {}) {
  try {
    const products = await Product.find(filter);
    console.log('\x1b[34m%s\x1b[0m', `[READ] Fetched ${products.length} product(s) matching filter:`, JSON.stringify(filter));
    return products;
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '[READ] Error fetching products:', error.message);
    throw error;
  }
}

/**
 * Fetch/Read a single product by its ID.
 * @param {string} id - The MongoDB document ObjectId.
 * @returns {Promise<Document|null>} The product document or null if not found.
 */
export async function fetchProductById(id) {
  try {
    const product = await Product.findById(id);
    if (product) {
      console.log('\x1b[34m%s\x1b[0m', `[READ] Found product by ID (${id}): "${product.name}"`);
    } else {
      console.log('\x1b[33m%s\x1b[0m', `[READ] Product with ID ${id} not found.`);
    }
    return product;
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `[READ] Error fetching product by ID (${id}):`, error.message);
    throw error;
  }
}

/**
 * Update a product document by its ID.
 * @param {string} id - The MongoDB document ObjectId.
 * @param {Object} updateData - Fields to update.
 * @returns {Promise<Document|null>} The updated document.
 */
export async function updateProduct(id, updateData) {
  try {
    // { new: true } returns the document AFTER updates are applied
    // { runValidators: true } ensures the updates respect schema validation rules
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    
    if (updatedProduct) {
      console.log('\x1b[35m%s\x1b[0m', `[UPDATE] Updated product (${id}): "${updatedProduct.name}"`);
    } else {
      console.log('\x1b[33m%s\x1b[0m', `[UPDATE] Product with ID ${id} to update was not found.`);
    }
    return updatedProduct;
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `[UPDATE] Error updating product (${id}):`, error.message);
    throw error;
  }
}

/**
 * Delete a product document by its ID.
 * @param {string} id - The MongoDB document ObjectId.
 * @returns {Promise<Document|null>} The deleted document.
 */
export async function deleteProduct(id) {
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (deletedProduct) {
      console.log('\x1b[31m%s\x1b[0m', `[DELETE] Deleted product (${id}): "${deletedProduct.name}"`);
    } else {
      console.log('\x1b[33m%s\x1b[0m', `[DELETE] Product with ID ${id} to delete was not found.`);
    }
    return deletedProduct;
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `[DELETE] Error deleting product (${id}):`, error.message);
    throw error;
  }
}
