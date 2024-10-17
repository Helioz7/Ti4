// Mettre à jour les compteurs
document.addEventListener('DOMContentLoaded', () => {
    // Remplacez ces valeurs par les valeurs réelles que vous souhaitez afficher
    const totalProducts = 10; // Remplacez par le nombre total de produits
    const totalCustomers = 200; // Remplacez par le nombre total de clients
    const totalOrders = 150; // Remplacez par le nombre total de commandes

    // Mettre à jour les éléments HTML
    document.getElementById('product-count').textContent = totalProducts;
    document.getElementById('customer-count').textContent = totalCustomers;
    document.getElementById('order-count').textContent = totalOrders;
});
