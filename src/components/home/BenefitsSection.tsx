import React from "react";
import {
  BulbOutlined,
  HeartOutlined,
  SmileOutlined,
  StarOutlined,
} from "@ant-design/icons";

const BENEFITS = [
  {
    icon: <BulbOutlined className="text-2xl" />,
    title: "Phát triển tư duy sáng tạo",
    desc: "Bé được khuyến khích thể hiện ý tưởng, tăng khả năng tư duy không gian và trí tưởng tượng.",
  },
  {
    icon: <HeartOutlined className="text-2xl" />,
    title: "Rèn luyện sự kiên nhẫn",
    desc: "Học vẽ giúp bé tập trung, kiên trì hoàn thành tác phẩm — kỹ năng quý báu cho tương lai.",
  },
  {
    icon: <SmileOutlined className="text-2xl" />,
    title: "Tự tin thể hiện bản thân",
    desc: "Mỗi bức vẽ là câu chuyện riêng, giúp bé mạnh dạn chia sẻ cảm xúc và ý tưởng.",
  },
  {
    icon: <StarOutlined className="text-2xl" />,
    title: "Nền tảng thẩm mỹ",
    desc: "Tiếp xúc sớm với màu sắc, hình khối giúp bé phát triển cảm quan nghệ thuật.",
  },
];

const BenefitsSection: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Lợi ích khi bé học vẽ
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Học vẽ không chỉ là vui chơi — đây là cơ hội để bé phát triển toàn diện.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BENEFITS.map((item, i) => (
            <div
              key={i}
              className="flex gap-6 p-8 rounded-2xl bg-slate-50 hover:bg-primary/5 border border-slate-100 hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
