const Item = require("../models/item");

// Create a new item
exports.createItem = async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res
      .status(201)
      .json({ item, error: null, message: "Item created successfully." });
  } catch (error) {
    res.status(400).json({ error: error.message, item: null });
  }
};

// Get all items or perform aggregation
exports.getItems = async (req, res) => {
  try {
    const { aggregate } = req.query;

    if (aggregate === "true") {
      const result = await Item.aggregate([
        {
          $group: {
            _id: "$_id",
            category: { $first: "$category" },
            totalStock: { $sum: "$stock" },
            avgPrice: { $avg: "$price" },
          },
        },
        { $sort: { category: 1 } },
      ]);
      return res.json(result);
    } else {
      const items = await Item.find().sort({ category: 1 });
      res.json({ items, error: null, message: "Get All Items." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message, items: null });
  }
};

// Get item by ID
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json({ item, error: null, message: "Get Item By ID" });
  } catch (error) {
    res.status(500).json({ error: error.message, item: null });
  }
};

// Update an item
exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json({ item, error: null, message: "Item updated successfully." });
  } catch (error) {
    res.status(400).json({ error: error.message, item: null });
  }
};

// Delete an item
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
