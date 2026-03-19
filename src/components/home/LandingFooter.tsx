import React from "react";
import { Link } from "react-router-dom";
import { ROUTER_URL } from "../../consts/router.path.const";

const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-white py-14 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="font-bold text-lg mb-4">Về chúng tôi</h3>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link to={ROUTER_URL.COMMON.ABOUT} className="hover:text-white transition-colors">
                  Về nền tảng
                </Link>
              </li>
              <li>
                <Link to={ROUTER_URL.CLIENT.COUNSEL} className="hover:text-white transition-colors">
                  Đội ngũ giáo viên
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Phương pháp học
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Khóa học</h3>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link to={ROUTER_URL.CLIENT.COURSE} className="hover:text-white transition-colors">
                  Khóa học vẽ
                </Link>
              </li>
              <li>
                <Link to={ROUTER_URL.CLIENT.PROGRAM} className="hover:text-white transition-colors">
                  Chương trình cộng đồng
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Hỗ trợ</h3>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link to={ROUTER_URL.COMMON.CONTACT} className="hover:text-white transition-colors">
                  Liên hệ
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Nền tảng học vẽ</h3>
            <p className="text-slate-400 text-sm">
              Sáng tạo mỹ thuật cho thiếu nhi — an toàn, vui nhộn và chuyên
              nghiệp.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-700 text-center text-slate-400 text-sm">
          © {new Date().getFullYear()} Nền tảng học vẽ & mỹ thuật thiếu nhi.
          Bản quyền thuộc về chúng tôi.
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
