import React, { useContext, useState } from "react";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setIsAuthorized(false);
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
      setIsAuthorized(true);
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-3xl font-bold">location_on</span>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase hidden sm:block">
              Hyperlocal <span className="text-primary">Hiring</span>
            </h2>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/" className="text-sm font-semibold text-slate-900 dark:text-white hover:text-primary transition-colors">
              {t("Home")}
            </Link>
            <Link to="/job/getall" className="text-sm font-semibold text-slate-900 dark:text-white hover:text-primary transition-colors">
              {t("All Jobs")}
            </Link>

            {isAuthorized && (
              <>
                <Link to="/applications/me" className="text-sm font-semibold text-slate-900 dark:text-white hover:text-primary transition-colors">
                  {user && user.role === "Employer" ? "Applicant's Applications" : t("My Applications")}
                </Link>
                {user && user.role === "Employer" && (
                  <>
                    <Link to="/job/post" className="text-sm font-semibold text-slate-900 dark:text-white hover:text-primary transition-colors">
                      {t("Post New Job")}
                    </Link>
                    <Link to="/job/me" className="text-sm font-semibold text-slate-900 dark:text-white hover:text-primary transition-colors">
                      {t("View Your Jobs")}
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button onClick={() => changeLanguage('en')} className={`px-2 py-1 text-xs font-bold rounded ${i18n.language === 'en' ? 'bg-white dark:bg-slate-700 shadow shadow-sm text-primary' : 'text-slate-500'}`}>EN</button>
            <button onClick={() => changeLanguage('hi')} className={`px-2 py-1 text-xs font-bold rounded ${i18n.language === 'hi' ? 'bg-white dark:bg-slate-700 shadow shadow-sm text-primary' : 'text-slate-500'}`}>HI</button>
            <button onClick={() => changeLanguage('gu')} className={`px-2 py-1 text-xs font-bold rounded ${i18n.language === 'gu' ? 'bg-white dark:bg-slate-700 shadow shadow-sm text-primary' : 'text-slate-500'}`}>GU</button>
          </div>

          {!isAuthorized ? (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-primary">{t("Login")}</Link>
              <Link to="/register" className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-primary/90 shadow-lg shadow-primary/20">{t("Sign Up")}</Link>
            </div>
          ) : (
            <>
              <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">notifications</span>
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary"></span>
              </button>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 border-2 border-primary overflow-hidden hidden sm:flex items-center justify-center">
                  <span className="font-bold text-primary">{user?.name?.charAt(0)}</span>
                </div>
                <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-lg">
                  {t("Logout")}
                </button>
              </div>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden text-slate-600 dark:text-slate-300 pl-2" onClick={() => setShow(!show)}>
            <span className="material-symbols-outlined text-3xl">{show ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {show && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl p-4 flex flex-col gap-4 z-50">
          <div className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mb-2">
            <button onClick={() => changeLanguage('en')} className={`px-4 py-2 text-sm font-bold rounded ${i18n.language === 'en' ? 'bg-white dark:bg-slate-700 shadow shadow-sm text-primary' : 'text-slate-500'}`}>EN</button>
            <button onClick={() => changeLanguage('hi')} className={`px-4 py-2 text-sm font-bold rounded ${i18n.language === 'hi' ? 'bg-white dark:bg-slate-700 shadow shadow-sm text-primary' : 'text-slate-500'}`}>हिंदी</button>
            <button onClick={() => changeLanguage('gu')} className={`px-4 py-2 text-sm font-bold rounded ${i18n.language === 'gu' ? 'bg-white dark:bg-slate-700 shadow shadow-sm text-primary' : 'text-slate-500'}`}>ગુજરાતી</button>
          </div>

          <Link to="/" onClick={() => setShow(false)} className="text-sm font-bold p-2 text-slate-700 dark:text-slate-300">{t("Home")}</Link>
          <Link to="/job/getall" onClick={() => setShow(false)} className="text-sm font-bold p-2 text-slate-700 dark:text-slate-300">{t("All Jobs")}</Link>

          {isAuthorized && (
            <>
              <Link to="/applications/me" onClick={() => setShow(false)} className="text-sm font-bold p-2 text-slate-700 dark:text-slate-300">
                {user && user.role === "Employer" ? "Applicant's Applications" : t("My Applications")}
              </Link>
              {user && user.role === "Employer" && (
                <>
                  <Link to="/job/post" onClick={() => setShow(false)} className="text-sm font-bold p-2 text-slate-700 dark:text-slate-300">{t("Post New Job")}</Link>
                  <Link to="/job/me" onClick={() => setShow(false)} className="text-sm font-bold p-2 text-slate-700 dark:text-slate-300">{t("View Your Jobs")}</Link>
                </>
              )}
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
