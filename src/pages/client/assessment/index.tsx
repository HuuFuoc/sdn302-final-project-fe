import { CheckCircleOutlined, BulbOutlined, BookOutlined, TeamOutlined, StarFilled } from "@ant-design/icons";

export default function Assessment() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9FCFF] via-white to-[#FFFDF9] relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#DCEEFF] rounded-full blur-3xl opacity-60" />
      <div className="absolute top-24 -right-24 w-80 h-80 bg-[#FFEAD6] rounded-full blur-3xl opacity-60" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#20558A] text-white text-sm font-medium mb-5 shadow-sm">
            <StarFilled />
            Khám phá năng khiếu cho bé
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#20558A] mb-4">Khám Phá Năng Khiếu Mỹ Thuật</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Trang này giúp phụ huynh nắm các thông tin cơ bản để đồng hành cùng bé trong hành trình học mỹ thuật:
            hiểu điểm mạnh, chọn hướng học phù hợp và theo dõi tiến bộ theo từng giai đoạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="rounded-2xl border border-[#DCEEFF] bg-[#F5FAFF] p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm">
              <BulbOutlined className="text-2xl text-[#20558A]" />
            </div>
            <h2 className="text-xl font-semibold text-[#20558A] mb-2">Nhận diện năng khiếu</h2>
            <p className="text-gray-600">
              Quan sát sở thích màu sắc, khả năng tập trung và cách bé thể hiện ý tưởng khi vẽ.
            </p>
          </div>

          <div className="rounded-2xl border border-[#FFE5CF] bg-[#FFF8F2] p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm">
              <BookOutlined className="text-2xl text-[#20558A]" />
            </div>
            <h2 className="text-xl font-semibold text-[#20558A] mb-2">Định hướng lộ trình</h2>
            <p className="text-gray-600">
              Bắt đầu từ nền tảng cơ bản, sau đó nâng dần theo độ tuổi và mục tiêu học tập của bé.
            </p>
          </div>

          <div className="rounded-2xl border border-[#DDF4E0] bg-[#F7FFF8] p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm">
              <TeamOutlined className="text-2xl text-[#20558A]" />
            </div>
            <h2 className="text-xl font-semibold text-[#20558A] mb-2">Đồng hành cùng phụ huynh</h2>
            <p className="text-gray-600">
              Cập nhật tiến độ thường xuyên để phụ huynh dễ theo dõi và hỗ trợ bé đúng cách tại nhà.
            </p>
          </div>
        </div>

        <div className="rounded-2xl p-8 bg-gradient-to-r from-[#EEF6FF] via-white to-[#FFF6EA] border border-[#E6EEF8] shadow-sm">
          <h2 className="text-2xl font-bold text-[#20558A] mb-6 text-center">Thông tin cơ bản dành cho phụ huynh</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div className="flex items-start gap-3 bg-white/70 rounded-xl p-4">
              <CheckCircleOutlined className="text-green-600 mt-1" />
              <p>Nên cho bé luyện vẽ đều đặn 2-3 buổi/tuần để duy trì hứng thú và hình thành kỹ năng.</p>
            </div>
            <div className="flex items-start gap-3 bg-white/70 rounded-xl p-4">
              <CheckCircleOutlined className="text-green-600 mt-1" />
              <p>Ưu tiên môi trường học khuyến khích sáng tạo hơn là đặt nặng thành tích.</p>
            </div>
            <div className="flex items-start gap-3 bg-white/70 rounded-xl p-4">
              <CheckCircleOutlined className="text-green-600 mt-1" />
              <p>Phù hợp nhất là lớp học có nội dung theo độ tuổi và giáo viên giàu kinh nghiệm dạy thiếu nhi.</p>
            </div>
            <div className="flex items-start gap-3 bg-white/70 rounded-xl p-4">
              <CheckCircleOutlined className="text-green-600 mt-1" />
              <p>Phụ huynh nên khích lệ bé chia sẻ tác phẩm để tăng tự tin và yêu thích mỹ thuật lâu dài.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
