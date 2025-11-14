import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AdminDashboardPage = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-64 bg-gray-800 text-white">
                <div className="p-4 text-2xl font-bold">Admin</div>
                <nav>
                    <Link to="users" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
                        Users
                    </Link>
                    <Link to="products" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
                        Products
                    </Link>
                </nav>
            </div>
            <div className="flex-1 p-10">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminDashboardPage;
