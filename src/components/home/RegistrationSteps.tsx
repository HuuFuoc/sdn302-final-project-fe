import React from "react";
import { Link } from "react-router-dom";
import {
  SearchOutlined,
  TeamOutlined,
  CreditCardOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { ROUTER_URL } from "../../consts/router.path.const";

const STEPS = [
  {
    step: 1,
    icon: <SearchOutlined className="text-xl" />,
    title: "Chọn khóa học",
    desc: "Xem danh sách khóa học và chọn khóa phù hợp với độ tuổi, sở thích của bé.",
    link: ROUTER_URL.CLIENT.COURSE,
  },
  {
    step: 2,
    icon: <TeamOutlined className="text-xl" />,
    title: "Tư vấn miễn phí",
    desc: "Đặt lịch gặp chuyên gia để được tư vấn lộ trình học và phương pháp phù hợp.",
    link: ROUTER_URL.CLIENT.APPOINTMENTS,
  },
  {
    step: 3,
    icon: <CreditCardOutlined className="text-xl" />,
    title: "Đăng ký & thanh toán",
    desc: "Hoàn tất đăng ký và thanh toán an toàn qua cổng VNPay.",
    link: ROUTER_URL.CLIENT.CART,
  },
  {
    step: 4,
    icon: <PlayCircleOutlined className="text-xl" />,
    title: "Bắt đầu học",
    desc: "Truy cập khóa học và bắt đầu hành trình sáng tạo ngay.",
    link: ROUTER_URL.CLIENT.COURSE,
  },
];

const RegistrationSteps: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-slate-50/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Quy trình đăng ký đơn giản
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Chỉ 4 bước để bé bắt đầu hành trình học vẽ cùng chúng tôi.
          </p>
        </div>

        <div className="relative">
          {/* Connector line - hidden on mobile */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-slate-200" style={{ top: "3rem" }} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((item) => (
              <Link
                key={item.step}
                to={item.link}
                className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-slate-100 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mb-4 font-bold text-lg z-10">
                  {item.step}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationSteps;
