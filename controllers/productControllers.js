exports.getAllProducts = async (req, res) => {
  res.send('get all products');
};

exports.getProductById = async (req, res) => {
  const productId = req.params.id;
  res.send(`get product by id: ${productId}`);
};

exports.createProduct = async (req, res) => {
  res.send('create product');
};

exports.updateProduct = async (req, res) => {
  const productId = req.params.id;
  res.send(`update product with id: ${productId}`);
};

exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;
  res.send(`delete product with id: ${productId}`);
};

exports.getProductsByQuery = async (req, res) => {
  res.send('get product by query');
};

exports.getProductsStats = async (req, res) => {
  res.send('get product stats');
};
