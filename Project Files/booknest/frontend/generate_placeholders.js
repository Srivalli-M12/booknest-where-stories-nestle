const components = [
    'Login', 'Register', 'Shop', 'BookDetails', 'Cart', 'Orders', 'SellerDashboard', 'AdminDashboard'
];

components.forEach(name => {
    console.log(`export default function ${name}() { return <div className="p-20 text-center text-2xl font-bold">Placeholder for ${name}</div> }`);
});
