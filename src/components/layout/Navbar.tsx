import { Link, useNavigate } from 'react-router-dom';
import { Heart, Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { Button } from '../ui/Button';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
            <span className="text-xl font-bold bg-linear-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              WedSite
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="#features" className="text-gray-600 hover:text-pink-500 transition-colors">
              ฟีเจอร์
            </Link>
            <Link to="#templates" className="text-gray-600 hover:text-pink-500 transition-colors">
              เทมเพลต
            </Link>
            <Link to="/pricing" className="text-gray-600 hover:text-pink-500 transition-colors">
              ราคา
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-gray-600 hover:text-pink-500"
                >
                  <User className="w-5 h-5" />
                  {user?.name}
                </Link>
                {user?.plan === 'free' && (
                  <Link to="/pricing">
                    <Button size="sm">Upgrade Pro</Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">เข้าสู่ระบบ</Button>
                </Link>
                <Link to="/register">
                  <Button>สมัครสมาชิก</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="#features"
              className="block py-2 text-gray-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              ฟีเจอร์
            </Link>
            <Link
              to="#templates"
              className="block py-2 text-gray-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              เทมเพลต
            </Link>
            <Link
              to="/pricing"
              className="block py-2 text-gray-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              ราคา
            </Link>
            <div className="pt-3 border-t space-y-2">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="block">
                    <Button className="w-full">Dashboard</Button>
                  </Link>
                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    ออกจากระบบ
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block">
                    <Button variant="outline" className="w-full">เข้าสู่ระบบ</Button>
                  </Link>
                  <Link to="/register" className="block">
                    <Button className="w-full">สมัครสมาชิก</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
