import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Context } from "../../main";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import API_BASE_URL from "../../utils/api";

const Dashboard = () => {
    const { user, isAuthorized } = useContext(Context);
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            if (!isAuthorized || user?.role !== "Admin") return;
            try {
                const [statsRes, usersRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/v1/admin/stats`, { withCredentials: true }),
                    axios.get(`${API_BASE_URL}/api/v1/admin/users`, { withCredentials: true })
                ]);
                setStats(statsRes.data.stats);
                setUsers(usersRes.data.users);
            } catch (err) {
                toast.error("Failed to fetch admin telemetry");
            } finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, [isAuthorized, user]);

    if (!isAuthorized || user?.role !== "Admin") {
        return <Navigate to="/" />;
    }

    if (loading) return <div className="p-10 text-center font-bold">Loading Admin Matrix...</div>;

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-[calc(100vh-64px)] p-6 lg:p-12">
            <div className="max-w-7xl mx-auto space-y-8">

                <header>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Admin <span className="text-primary">Terminal</span></h1>
                    <p className="text-slate-500 font-medium">Platform Health & Telemetry Metrics</p>
                </header>

                {/* Telemetry Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-primary/5">
                        <p className="text-sm font-bold text-slate-500 uppercase">Total Users</p>
                        <h3 className="text-4xl font-black text-slate-900 dark:text-white mt-2">{stats?.totalUsers || 0}</h3>
                    </div>
                    <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-primary/5">
                        <p className="text-sm font-bold text-slate-500 uppercase">Total Employers</p>
                        <h3 className="text-4xl font-black text-primary mt-2">{stats?.employers || 0}</h3>
                    </div>
                    <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-primary/5">
                        <p className="text-sm font-bold text-slate-500 uppercase">Total Seekers</p>
                        <h3 className="text-4xl font-black text-slate-900 dark:text-white mt-2">{stats?.jobSeekers || 0}</h3>
                    </div>
                    <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-primary/5">
                        <p className="text-sm font-bold text-slate-500 uppercase">Active Jobs</p>
                        <h3 className="text-4xl font-black text-green-500 mt-2">{stats?.totalJobs || 0}</h3>
                    </div>
                </div>

                {/* User Management Table */}
                <div className="bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-primary/5 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">group</span>
                            Platform Users
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-950/50">
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email / Phone</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {users.map(u => (
                                    <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4 text-xs text-slate-400 font-mono">{u._id}</td>
                                        <td className="p-4 text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            {u.role === "Admin" && <span className="material-symbols-outlined text-red-500 text-sm">security</span>}
                                            {u.name}
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                                            <div>{u.email}</div>
                                            <div className="text-xs text-slate-400">{u.phone} {u.phoneVerified && <span className="text-green-500 text-[10px] uppercase">Verified</span>}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${u.role === 'Admin' ? 'bg-red-100 text-red-600' : u.role === 'Employer' ? 'bg-primary/20 text-primary' : 'bg-blue-100 text-blue-600'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
