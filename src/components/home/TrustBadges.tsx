import React from "react";
import { SafetyOutlined, TeamOutlined, ClockCircleOutlined, TrophyOutlined } from "@ant-design/icons";

const TRUST_ITEMS = [
  {
    icon: <SafetyOutlined className="text-2xl" />,
    title: "An toàn & thân thiện",
    desc: "Môi trường học tập được kiểm soát, phù hợp lứa tuổi",
  },
  {
    icon: <TeamOutlined className="text-2xl" />,
    title: "Giáo viên chuyên môn",
    desc: "Đội ngũ có kinh nghiệm dạy mỹ thuật thiếu nhi",
  },
  {
    icon: <ClockCircleOutlined className="text-2xl" />,
    title: "Linh hoạt học tập",
    desc: "Học mọi lúc mọi nơi trên thiết bị của bạn",
  },
  {
    icon: <TrophyOutlined className="text-2xl" />,
    title: "Chứng nhận hoàn thành",
    desc: "Nhận chứng nhận sau khi hoàn thành khóa học",
  },
];

const TrustBadges: React.FC = () => {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TRUST_ITEMS.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50/80 hover:bg-primary/5 border border-slate-100 hover:border-primary/20 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
