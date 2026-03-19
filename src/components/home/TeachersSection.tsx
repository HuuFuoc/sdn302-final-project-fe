import React from "react";
import { Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { ROUTER_URL } from "../../consts/router.path.const";

const TEACHERS_PREVIEW = [
  {
    name: "Đội ngũ giảng viên mỹ thuật",
    role: "Chuyên gia mỹ thuật thiếu nhi",
    desc: "Giảng viên tốt nghiệp các trường mỹ thuật uy tín, có kinh nghiệm dạy trẻ em và phương pháp sư phạm phù hợp.",
  },
  {
    name: "Phương pháp học vui",
    role: "Kích thích sáng tạo",
    desc: "Mỗi bài học được thiết kế để bé vừa học vừa chơi, phát huy trí tưởng tượng và niềm yêu thích hội họa.",
  },
];

const TeachersSection: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Đội ngũ giáo viên tâm huyết
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Đội ngũ giảng viên giàu kinh nghiệm, yêu trẻ và tận tâm với nghề.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {TEACHERS_PREVIEW.map((item, i) => (
            <div
              key={i}
              className="flex gap-6 p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-colors"
            >
              <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                <UserOutlined className="text-3xl text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-slate-800 mb-1">{item.name}</h3>
                <p className="text-primary text-sm font-medium mb-2">{item.role}</p>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to={ROUTER_URL.CLIENT.COUNSEL}
            className="inline-flex items-center px-8 py-4 rounded-2xl font-semibold text-primary border-2 border-primary hover:bg-primary hover:text-white transition-colors"
          >
            Gặp giảng viên & tư vấn
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TeachersSection;
