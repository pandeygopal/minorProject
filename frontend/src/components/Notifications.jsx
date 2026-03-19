import React, { useEffect, useContext, useState } from "react";
import { io } from "socket.io-client";
import { Context } from "../main";
import toast from "react-hot-toast";

let socket;

const Notifications = () => {
    const { isAuthorized, user } = useContext(Context);
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (isAuthorized && user && user._id) {
            // Connect to Socket.IO matching backend URL
            socket = io("http://localhost:4000", {
                withCredentials: true,
            });

            socket.on("connect", () => {
                // Join namespace using user ID
                socket.emit("join", user._id.toString());
            });

            // Listen for specific business logic events
            socket.on("new_application", (data) => {
                // Trigger generic toast notification anywhere
                toast.custom((t) => (
                    <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white dark:bg-slate-900 shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black/5 dark:ring-white/10`}>
                        <div className="flex-1 w-0 p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 pt-0.5">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary">work</span>
                                    </div>
                                </div>
                                <div className="ml-3 flex-1">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">New Application Received!</p>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{data.message}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex border-l border-slate-200 dark:border-slate-800">
                            <button
                                onClick={() => toast.dismiss(t.id)}
                                className="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-sm font-medium text-primary hover:text-primary/80 focus:outline-none"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                ), { duration: 5000 });

                // Add to internal list
                setNotifications((prev) => [{ id: Date.now(), text: data.message, time: new Date() }, ...prev]);
                setUnreadCount((c) => c + 1);
            });

            return () => {
                socket.disconnect();
            };
        }
    }, [isAuthorized, user]);

    if (!isAuthorized) return null;

    return (
        <>
            {/* Floating Notification Toggle Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => { setIsOpen(!isOpen); setUnreadCount(0); }}
                    className="bg-primary hover:bg-primary/90 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center relative transition-transform hover:scale-105"
                >
                    <span className="material-symbols-outlined text-2xl">notifications</span>
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-black min-w-[20px] h-5 rounded-full flex items-center justify-center px-1 shadow-md">
                            {unreadCount}
                        </span>
                    )}
                </button>

                {/* Notification Panel */}
                {isOpen && (
                    <div className="absolute bottom-20 right-0 w-80 md:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-enter">
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">notifications_active</span>
                                Notifications List
                            </h3>
                            {notifications.length > 0 && (
                                <button onClick={() => setNotifications([])} className="text-xs font-bold text-slate-500 hover:text-red-500 transition-colors">
                                    Clear All
                                </button>
                            )}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-2">
                                    <span className="material-symbols-outlined text-4xl opacity-50">notifications_off</span>
                                    <p className="font-medium text-sm">No new notifications</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {notifications.map(n => (
                                        <div key={n.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{n.text}</p>
                                            <p className="text-xs text-slate-400 mt-2 font-semibold uppercase tracking-wider">
                                                {n.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Notifications;
