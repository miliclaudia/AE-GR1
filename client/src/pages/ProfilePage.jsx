import React, { useEffect, useState } from 'react';
import { getProfile } from '../api/user.routes';
import { decodeToken } from '../utils/decodeToken';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decodedToken = decodeToken(token);
                    const userId = decodedToken.id;
                    const response = await getProfile(userId);
                    if (response.success) {
                        setUser(response.data);
                    } else {
                        setError(response.message);
                    }
                }
            } catch (err) {
                setError('Failed to fetch profile.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!user) {
        return <div>User not found.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white shadow rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">Profile</h1>
                <div className="flex items-center space-x-4 mb-4">
                    <div>
                        <p className="text-lg font-semibold">{user.firstName} {user.lastName}</p>
                        <p className="text-gray-500">{user.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
