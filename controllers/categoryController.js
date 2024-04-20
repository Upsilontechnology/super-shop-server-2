const { default: mongoose } = require("mongoose");
const categorySchema = require("../schemas/categorySchema");
const categoryDB = new mongoose.model("Category", categorySchema);

exports.getCategory = async (req, res) => {
  try {
    const result = await categoryDB.find();
    res.send(result);
  } catch (error) {
    res.status(500).json({ msg: "unable to get user data" });
  }
};
exports.addCategory = async (req, res) => {
  try {
    const data = req.body;
    const query = { category: data?.category };
    const existingCategory = await categoryDB.findOne(query);

    if (existingCategory) {
      return res
        .status(400)
        .json({ message: "Category has already been added" });
    }

    const newCategory = new Category(data);
    await newCategory.save();

    res.status(201).json({ message: "Category created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred" });
  }
};
exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const query = { _id: new Object(categoryId) };

    const deletedCount = await categoryDB.deleteOne(query);

    if (deletedCount.deletedCount === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ message: "An error occurred" }); // Generic message for security
  }
};
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = await categoryDB.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
