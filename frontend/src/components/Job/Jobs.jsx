import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import toast from "react-hot-toast";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
// Fix default leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [radius, setRadius] = useState(5);
  const [useLocationFilter, setUseLocationFilter] = useState(false);
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  // User location states (default New York, overridden by browser geolocate)
  const [userLocation, setUserLocation] = useState({ lat: 40.7128, lng: -74.0060 });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [radius, userLocation, useLocationFilter]);

  const fetchJobs = () => {
    if (!useLocationFilter) {
      axios
        .get("http://localhost:4000/api/v1/job/getall", {
          withCredentials: true,
        })
        .then((res) => {
          setJobs(res.data.jobs || []);
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to fetch jobs");
        });
    } else {
      axios
        .get(`http://localhost:4000/api/v1/job/radius/${radius}/center/${userLocation.lat},${userLocation.lng}`, {
          withCredentials: true,
        })
        .then((res) => {
          setJobs(res.data.jobs || []);
        })
        .catch((error) => {
          console.error(error);
          axios
            .get("http://localhost:4000/api/v1/job/getall", {
              withCredentials: true,
            })
            .then((fallbackRes) => {
              setJobs(fallbackRes.data.jobs || []);
              setUseLocationFilter(false);
              toast.error("Location search failed. Showing all jobs.");
            })
            .catch((err) => console.log(err));
        });
    }
  };

  if (!isAuthorized) {
    navigateTo("/");
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-[calc(100vh-64px)] overflow-hidden">
      <main className="mx-auto flex max-w-[1440px] h-[calc(100vh-64px)] overflow-hidden">
        {/* Sidebar Filters */}
        <aside className="w-72 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark p-6 overflow-y-auto hidden xl:block">
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">Filters</h3>
              <div className="space-y-1">
                <button className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 ${useLocationFilter ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                  <span className="material-symbols-outlined text-xl">map</span>
                  <span className="text-sm font-semibold">Distance</span>
                </button>
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <span className="material-symbols-outlined text-xl">payments</span>
                  <span className="text-sm font-medium">Salary Range</span>
                </button>
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <span className="material-symbols-outlined text-xl">work</span>
                  <span className="text-sm font-medium">Job Category</span>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-900 dark:text-white">Near Me</label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={useLocationFilter} onChange={(e) => setUseLocationFilter(e.target.checked)} className="sr-only peer" />
                    <div className="relative w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                  </label>
                </div>
                {useLocationFilter && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-slate-500">Search Radius</span>
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{radius} km</span>
                    </div>
                    <input
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                      max="50" min="1" type="range"
                      value={radius}
                      onChange={(e) => setRadius(e.target.value)}
                    />
                    <div className="flex justify-between mt-2 text-[10px] text-slate-400 uppercase font-bold">
                      <span>1 km</span>
                      <span>50 km</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-900 dark:text-white block mb-3">Salary Range ($)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input className="px-2 py-1.5 rounded-lg border border-slate-200 text-sm focus:ring-primary focus:border-primary dark:bg-slate-800 dark:border-slate-700" placeholder="Min" type="number" />
                  <input className="px-2 py-1.5 rounded-lg border border-slate-200 text-sm focus:ring-primary focus:border-primary dark:bg-slate-800 dark:border-slate-700" placeholder="Max" type="number" />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Map View */}
        <div className="flex-1 relative hidden md:block border-r border-slate-200 dark:border-slate-800 z-10 bg-slate-50 dark:bg-slate-900">
          <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={useLocationFilter ? 12 : 3} style={{ height: "100%", width: "100%", zIndex: 0 }}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {/* User Location Circle (Only show when filtering by location) */}
            {useLocationFilter && (
              <>
                <Circle
                  center={[userLocation.lat, userLocation.lng]}
                  radius={radius * 1000}
                  pathOptions={{ fillColor: '#ec5b13', fillOpacity: 0.1, color: '#ec5b13', weight: 1 }}
                />
                <Marker position={[userLocation.lat, userLocation.lng]}>
                  <Popup>You are here</Popup>
                </Marker>
              </>
            )}

            {jobs.map((job) => {
              // Only plot jobs that have locationPoint coordinates
              if (job.locationPoint && job.locationPoint.coordinates && job.locationPoint.coordinates.length === 2) {
                const [lng, lat] = job.locationPoint.coordinates;
                // Basic validation
                if (lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90) {
                  return (
                    <Marker key={job._id} position={[lat, lng]}>
                      <Popup>
                        <div className="flex flex-col gap-1">
                          <strong>{job.title}</strong>
                          <span>{job.category}</span>
                          <Link to={`/job/${job._id}`} className="text-primary font-bold">View</Link>
                        </div>
                      </Popup>
                    </Marker>
                  );
                }
              }
              return null;
            })}
          </MapContainer>
        </div>

        {/* Job Feed */}
        <div className="w-full md:w-[480px] flex-shrink-0 bg-white dark:bg-background-dark flex flex-col z-20">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold">{useLocationFilter ? "Jobs Near You" : "All Available Jobs"}</h2>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{jobs.length} Results</span>
            </div>
            {useLocationFilter && (
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">location_searching</span> GPS
                </span>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">radar</span> &lt; {radius} KM
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {jobs.length > 0 ? jobs.map(element => (
              <div key={element._id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-2xl font-bold">work</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{element.title}</h3>
                      <p className="text-xs text-slate-500 font-medium">{element.city}, {element.country}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider">
                    {element.category}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {element.fixedSalary ? `$${element.fixedSalary}` : `$${element.salaryFrom} - $${element.salaryTo}`}
                    <span className="text-[10px] text-slate-400 font-normal"> {element.fixedSalary ? '/ fixed' : '/ range'}</span>
                  </div>
                  <Link to={`/job/${element._id}`} className="px-4 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-primary/20">
                    View Details
                  </Link>
                </div>
              </div>
            )) : (
              <p className="text-center text-slate-500 mt-10">No jobs found.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Jobs;
