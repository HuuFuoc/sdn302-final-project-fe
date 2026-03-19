import React from "react";
import { Link } from "react-router-dom";
import { ROUTER_URL } from "../../consts/router.path.const";

const FinalCTA: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-primary via-secondary to-accent">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Bắt đầu hành trình sáng tạo cùng bé ngay hôm nay
        </h2>
        <p className="text-white/90 text-lg mb-8">
          Tham gia cộng đồng học vẽ và mỹ thuật thiếu nhi. Đăng ký miễn phí để
          xem thử các khóa học.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={ROUTER_URL.CLIENT.COURSE}
            className="px-8 py-4 rounded-2xl font-semibold bg-white text-primary hover:bg-slate-100 transition-colors"
          >
            Xem khóa học
          </Link>
          <Link
            to={ROUTER_URL.AUTH.SIGN_UP}
            className="px-8 py-4 rounded-2xl font-semibold border-2 border-white text-white hover:bg-white/10 transition-colors"
          >
            Đăng ký tài khoản
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
