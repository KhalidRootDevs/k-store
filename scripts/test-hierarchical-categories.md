# Hierarchical Categories Testing Guide

## Features Implemented

### 1. Database Model Updates
- ✅ Added `parentCategoryId` field to Category model
- ✅ Added validation to prevent circular references
- ✅ Added indexes for efficient hierarchy queries
- ✅ Added methods: `getHierarchyPath()`, `getChildCategories()`, `getDescendants()`, `getAncestors()`

### 2. API Endpoints

#### POST /api/admin/categories
- ✅ Accept optional `parentCategoryId` in request
- ✅ Validate parent category exists and is active
- ✅ Prevent circular references

#### PUT /api/admin/categories/[id]
- ✅ Allow updating `parentCategoryId`
- ✅ Validate parent changes don't create circular hierarchies
- ✅ Prevent setting a category as its own parent

#### DELETE /api/admin/categories/[id]
- ✅ Prevent deletion of categories with children
- ✅ Error message guides user to reassign children first

#### GET /api/admin/categories
- ✅ Maintain existing pagination and filtering
- ✅ Return `parentCategoryId` in responses

#### GET /api/categories (Public)
- ✅ Support `hierarchical=true` parameter for nested responses
- ✅ Support `parentId` parameter to filter by parent

### 3. Admin UI

#### Category Form
- ✅ Added "Parent Category" dropdown selector
- ✅ Filters out self and descendants from parent selection
- ✅ Shows hierarchy hint text
- ✅ Loads available parent categories on mount

#### Categories List Page
- ✅ Converted from flat table to tree view structure
- ✅ Expand/collapse functionality for subcategories
- ✅ Visual hierarchy with indentation
- ✅ Icons for expand/collapse
- ✅ Category images in tree view
- ✅ Maintains all existing features (search, filters, pagination, edit, delete)

## Testing Checklist

### 1. Create Hierarchical Categories
```
1. Create top-level category: "Electronics"
2. Create child: "Electronics > Phones"
3. Create grandchild: "Electronics > Phones > Smartphones"
```

### 2. Test Form Validation
- ✅ Parent category selector filters correctly
- ✅ Cannot select self as parent
- ✅ Cannot select a descendant as parent
- ✅ Cannot set a category as both parent and child (circular reference)

### 3. Test Tree View Display
- ✅ Categories appear with expand/collapse buttons
- ✅ Clicking expand shows child categories
- ✅ Indentation shows hierarchy depth
- ✅ All edit/delete buttons work correctly

### 4. Test Deletion Logic
- ✅ Cannot delete category with children (shows error)
- ✅ Can delete leaf categories (no children)
- ✅ Can move children to different parent before deleting

### 5. Test API Responses
```bash
# Get hierarchical response
curl "http://localhost:3000/api/categories?hierarchical=true"

# Filter by parent
curl "http://localhost:3000/api/categories?parentId=<id>"

# Admin create with parent
curl -X POST "http://localhost:3000/api/admin/categories" \
  -H "Content-Type: application/json" \
  -d '{"name":"Subcategory","parentCategoryId":"<id>"}'
```

## Files Modified

1. `/models/Category.ts` - Added parentCategoryId and hierarchy methods
2. `/app/api/admin/categories/route.ts` - Updated POST to support parentCategoryId
3. `/app/api/admin/categories/[id]/route.ts` - Updated PUT/DELETE with validation
4. `/app/(admin)/admin/categories/_components/category-form.tsx` - Added parent selector
5. `/app/(admin)/admin/categories/page.tsx` - Converted to tree view
6. `/app/api/categories/route.ts` - Added hierarchical response support

## Future Enhancements

- Drag-and-drop reordering within tree
- Bulk move operations
- Tree export/visualization
- Maximum nesting depth limit
- Performance optimization for very large hierarchies
