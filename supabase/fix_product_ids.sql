-- Step 1: Run this first to see what's in your products table
SELECT id, id::text, name, slug FROM products ORDER BY created_at;
