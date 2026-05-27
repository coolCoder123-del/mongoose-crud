import { MongoMemoryServer } from 'mongodb-memory-server';
import {
  connectDB,
  disconnectDB,
  createProduct,
  fetchProducts,
  fetchProductById,
  updateProduct,
  deleteProduct
} from './crud.js';

// Helper to log section headers in the console
function logHeader(title) {
  console.log('\n' + '='.repeat(60));
  console.log(`\x1b[1m\x1b[36m>>> ${title} <<<\x1b[0m`);
  console.log('='.repeat(60));
}

async function runDemo() {
  let mongoServer;

  try {
    logHeader('STARTING IN-MEMORY MONGODB SERVER');
    // Spin up an in-memory MongoDB instance to run the demo instantly
    // without requiring a local/remote MongoDB installation.
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    console.log(`In-memory MongoDB started at: ${uri}\n`);

    // 1. CONNECT to Database
    logHeader('CONNECTING TO DATABASE');
    await connectDB(uri);

    // 2. CREATE (Insert Documents)
    logHeader('INSERTING DOCUMENTS (CREATE)');
    const product1 = await createProduct({
      name: 'Wireless Noise-Canceling Headphones',
      category: 'Electronics',
      price: 299.99,
      stock: 45,
    });

    const product2 = await createProduct({
      name: 'Professional JavaScript Cookbook',
      category: 'Books',
      price: 49.99,
      stock: 120,
    });

    const product3 = await createProduct({
      name: 'Ergonomic Office Chair',
      category: 'Home & Kitchen',
      price: 249.50,
      stock: 15,
    });

    // 3. READ (Fetch Documents)
    logHeader('FETCHING ALL DOCUMENTS (READ)');
    const allProducts = await fetchProducts();
    console.log('\nAll Products Table:');
    console.table(
      allProducts.map(p => ({
        id: p._id.toString(),
        name: p.name,
        category: p.category,
        price: `$${p.price.toFixed(2)}`,
        stock: p.stock,
      }))
    );

    logHeader('FETCHING WITH FILTERS (READ)');
    // Filter for products that cost more than $100
    const expensiveProducts = await fetchProducts({ price: { $gt: 100 } });
    console.log('\nExpensive Products (> $100):');
    console.table(expensiveProducts.map(p => ({ name: p.name, price: `$${p.price.toFixed(2)}` })));

    // Fetch a single document by ID
    logHeader('FETCHING SINGLE PRODUCT BY ID (READ)');
    await fetchProductById(product2._id);

    // 4. UPDATE (Modify Documents)
    logHeader('UPDATING DOCUMENTS (UPDATE)');
    // Let's discount the headphones and decrease stock
    const updatedHeadphones = await updateProduct(product1._id, {
      price: 249.99,
      stock: 44,
    });
    console.log('\nUpdated product details:');
    console.log(JSON.stringify(updatedHeadphones, null, 2));

    // 5. DELETE (Remove Documents)
    logHeader('DELETING DOCUMENTS (DELETE)');
    // Delete the office chair product
    await deleteProduct(product3._id);

    // Fetch all remaining products to verify deletion
    logHeader('FINAL LIST OF PRODUCTS (VERIFY)');
    const remainingProducts = await fetchProducts();
    console.table(
      remainingProducts.map(p => ({
        id: p._id.toString(),
        name: p.name,
        category: p.category,
        price: `$${p.price.toFixed(2)}`,
        stock: p.stock,
      }))
    );

  } catch (error) {
    console.error('An error occurred during the demo:', error);
  } finally {
    logHeader('CLEANING UP AND CLOSING CONNECTION');
    // Disconnect Mongoose
    await disconnectDB();
    
    // Stop the in-memory MongoDB server
    if (mongoServer) {
      await mongoServer.stop();
      console.log('\x1b[36m%s\x1b[0m', 'In-memory MongoDB server stopped.');
    }
    console.log('\nDemo finished successfully!');
  }
}

runDemo();
