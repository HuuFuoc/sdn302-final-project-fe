import React from "react";
import { MessageOutlined } from "@ant-design/icons";

const TESTIMONIALS = [
  {
    quote:
      "Bé nhà tôi rất thích học, mỗi ngày đều đòi mở máy học vẽ. Giáo viên nhiệt tình, nội dung phong phú.",
    author: "Chị Hương - Phụ huynh",
    avatar: "H",
    color: "bg-primary",
  },
  {
    quote:
      "Con tôi trước đây nhút nhát, sau khi học vài tháng đã tự tin hơn nhiều. Cảm ơn các thầy cô!",
    author: "Anh Minh - Phụ huynh",
    avatar: "M",
    color: "bg-secondary",
  },
  {
    quote:
      "Platform dễ dùng, bé tự học được. Tôi rất yên tâm khi cho con học online tại đây.",
    author: "Chị Lan - Phụ huynh",
    avatar: "L",
    color: "bg-fun",
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 text-center mb-4">
          Phụ huynh nói gì về chúng tôi
        </h2>
        <p className="text-slate-600 text-center max-w-2xl mx-auto mb-14">
          Hàng nghìn gia đình đã tin tưởng và đồng hành cùng con trên hành trình
          sáng tạo mỹ thuật.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100"
            >
              <MessageOutlined className="text-3xl text-primary/40 mb-4" />
              <p className="text-slate-700 leading-relaxed mb-6">{item.quote}</p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full ${item.color} text-white font-bold flex items-center justify-center`}
                >
                  {item.avatar}
                </div>
                <span className="font-semibold text-slate-800">{item.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
