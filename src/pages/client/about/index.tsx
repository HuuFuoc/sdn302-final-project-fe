import { 
  AcademicCapIcon, 
  HeartIcon, 
  UserGroupIcon,
  BookOpenIcon,
  ClipboardDocumentCheckIcon,
  CalendarDaysIcon,
  SpeakerWaveIcon,
  UserIcon,
  PresentationChartBarIcon,
  SparklesIcon,
  EyeIcon,
  StarIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export default function About() {
  return (
    <div className="bg-white w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1A8FE3] via-[#6610F2] to-[#6610F2] text-white py-32 w-full">
        <div className="absolute inset-0 bg-white/5"></div>
        <div className="relative w-full max-w-[1400px] text-center px-6 md:px-20 lg:px-32">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur">
              <SparklesIcon className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-8 leading-tight bg-gradient-to-r from-white to-[#E6C229]/90 bg-clip-text text-transparent">
            Vì thế giới sắc màu của bé,<br />
            <span className="bg-gradient-to-r from-[#E6C229] to-white bg-clip-text text-transparent">vì niềm vui sáng tạo mỗi ngày</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-5xl mx-auto mb-12 leading-relaxed font-light">
            Chúng tôi tin rằng mỹ thuật và học vẽ giúp trẻ phát triển tư duy và cảm xúc. 
            Bằng nội dung chất lượng và đội ngũ giáo viên tận tâm, chúng tôi mang đến nền tảng học vẽ thân thiện, an toàn cho thiếu nhi.
          </p>
          <div className="flex justify-center">
            <div className="w-40 h-1 bg-gradient-to-r from-[#E6C229] to-white rounded-full shadow-lg"></div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-6 md:px-20 lg:px-32 bg-gradient-to-br from-[#e8f4fc] to-[#efe6fc]/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="group">
              <div className="bg-white p-10 rounded-3xl shadow-xl border border-[#1A8FE3]/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1A8FE3] to-[#6610F2] rounded-t-3xl"></div>
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#1A8FE3] to-[#6610F2] rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                    <HeartIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-[#1A8FE3] to-[#6610F2] bg-clip-text text-transparent">Sứ Mệnh Của Chúng Tôi</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Sứ mệnh của chúng tôi là mang đến môi trường học vẽ và mỹ thuật chất lượng, an toàn cho thiếu nhi. 
                  Thông qua các khóa học sáng tạo và giáo viên tận tâm, chúng tôi giúp bé phát triển năng khiếu, 
                  tư duy thẩm mỹ và sự tự tin qua từng nét vẽ.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white p-10 rounded-3xl shadow-xl border border-[#E6C229]/30 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#F17105] to-[#E6C229] rounded-t-3xl"></div>
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#F17105] to-[#E6C229] rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                    <EyeIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-[#F17105] to-[#E6C229] bg-clip-text text-transparent">Tầm Nhìn Của Chúng Tôi</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Chúng tôi hướng tới việc trở thành nền tảng học vẽ và mỹ thuật thiếu nhi được tin chọn nhất. 
                  Mỗi bé đều có cơ hội khám phá sắc màu, phát triển sáng tạo trong môi trường vui tươi, 
                  thân thiện và được đồng hành bởi đội ngũ giáo viên giàu kinh nghiệm.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 px-6 md:px-20 lg:px-32 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-indigo-50/50"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-[#1A8FE3] to-[#6610F2] bg-clip-text text-transparent mb-8">Câu Chuyện Của Chúng Tôi</h2>
            <div className="flex justify-center">
              <div className="w-32 h-1 bg-gradient-to-r from-[#1A8FE3] to-[#6610F2] rounded-full shadow-md"></div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#e8f4fc] via-[#efe6fc]/50 to-[#fdf9e6] p-12 md:p-16 rounded-3xl shadow-2xl border border-[#1A8FE3]/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1A8FE3]/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#E6C229]/15 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative">
              <p className="text-gray-700 text-xl leading-relaxed mb-8">
                Mọi chuyện bắt đầu từ tình yêu với hội họa và mong muốn lan tỏa niềm vui sáng tạo: 
                <span className="font-semibold bg-gradient-to-r from-[#1A8FE3] to-[#6610F2] bg-clip-text text-transparent"> Làm thế nào để mỗi bé đều có cơ hội học vẽ và phát triển năng khiếu mỹ thuật?</span>
              </p>
              
              <p className="text-gray-700 text-xl leading-relaxed mb-8">
                Chúng tôi lắng nghe phụ huynh, hợp tác với giáo viên mỹ thuật và nhận ra nhu cầu một nền tảng 
                học vẽ trực tuyến chất lượng, an toàn và thân thiện với trẻ nhỏ.
              </p>
              
              <p className="text-gray-700 text-xl leading-relaxed mb-10">
                Nền tảng học vẽ & mỹ thuật thiếu nhi ra đời từ đó. Chúng tôi tin rằng công nghệ có thể 
                kết nối bé với giáo viên giỏi, mang khóa học chất lượng đến mọi gia đình và tạo không gian 
                sáng tạo, vui nhộn để bé thỏa sức vẽ và khám phá màu sắc.
              </p>
              
              <div className="bg-white p-8 rounded-2xl border-l-4 border-[#F17105] shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#F17105] to-[#E6C229] rounded-xl flex items-center justify-center flex-shrink-0">
                    <StarIcon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-800 font-medium italic text-lg leading-relaxed">
                    "Nền tảng này là tâm huyết của chúng tôi – được xây dựng với mong muốn mỗi bé đều có thể 
                    học vẽ vui vẻ, an toàn và phát triển năng khiếu mỹ thuật từ sớm."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-24 px-6 md:px-20 lg:px-32 bg-gradient-to-br from-gray-50 to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-[#1A8FE3] to-[#6610F2] bg-clip-text text-transparent mb-8">Cách Chúng Tôi Hành Động</h2>
            <div className="flex justify-center">
              <div className="w-32 h-1 bg-gradient-to-r from-[#1A8FE3] to-[#6610F2] rounded-full shadow-md"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: BookOpenIcon,
                title: "Khóa học vẽ & mỹ thuật",
                desc: "Các khóa học trực tuyến được thiết kế theo lứa tuổi, giúp bé làm quen với màu sắc, nét vẽ và sáng tạo.",
                gradient: "from-[#1A8FE3] to-[#1572b6]"
              },
              {
                icon: ClipboardDocumentCheckIcon,
                title: "Khám phá năng khiếu",
                desc: "Bài khảo sát nhẹ nhàng giúp phụ huynh và bé hiểu hơn về sở thích, mức độ quan tâm tới mỹ thuật.",
                gradient: "from-[#6610F2] to-[#520dc2]"
              },
              {
                icon: UserGroupIcon,
                title: "Gặp giáo viên & đồng hành",
                desc: "Đội ngũ giáo viên mỹ thuật thân thiện. Đặt lịch gặp giáo viên dễ dàng, thuận tiện cho bé và phụ huynh.",
                gradient: "from-[#F17105] to-[#c25c04]"
              },
              {
                icon: SpeakerWaveIcon,
                title: "Hoạt động sáng tạo",
                desc: "Các chương trình, sự kiện vẽ và triển lãm nhỏ giúp bé tự tin thể hiện tác phẩm và giao lưu cùng bạn bè.",
                gradient: "from-[#E6C229] to-[#c9a822]"
              }
            ].map((item, index) => (
              <div key={index} className="group">
                <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-full h-1 rounded-t-3xl bg-gradient-to-r ${item.gradient}`}></div>
                  <div className={`w-16 h-16 bg-gradient-to-r ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-4 text-center text-gray-800 group-hover:text-[#1A8FE3] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-center">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Highlight */}
      <section className="py-24 px-6 md:px-20 lg:px-32 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/30"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-[#1A8FE3] to-[#6610F2] bg-clip-text text-transparent mb-8">Tính Năng Nổi Bật</h2>
            <div className="flex justify-center">
              <div className="w-32 h-1 bg-gradient-to-r from-[#1A8FE3] to-[#6610F2] rounded-full shadow-md"></div>
            </div>
          </div>

          <div className="space-y-6">
            {[
              {
                icon: AcademicCapIcon,
                title: "Khóa học vẽ trực tuyến",
                desc: "Các khóa học mỹ thuật phù hợp theo lứa tuổi: làm quen màu sắc, vẽ cơ bản, sáng tạo theo chủ đề cho thiếu nhi và phụ huynh tham khảo.",
                gradient: "from-[#1A8FE3] to-[#1572b6]"
              },
              {
                icon: ClipboardDocumentCheckIcon,
                title: "Khám phá năng khiếu",
                desc: "Bài khảo sát nhẹ nhàng giúp bé và phụ huynh hiểu sở thích, mức độ quan tâm tới mỹ thuật và nhận gợi ý phù hợp.",
                gradient: "from-[#6610F2] to-[#520dc2]"
              },
              {
                icon: CalendarDaysIcon,
                title: "Đặt lịch gặp giáo viên",
                desc: "Kết nối nhanh chóng với giáo viên mỹ thuật giàu kinh nghiệm để bé được hướng dẫn và tư vấn học vẽ.",
                gradient: "from-[#F17105] to-[#c25c04]"
              },
              {
                icon: SpeakerWaveIcon,
                title: "Hoạt động sáng tạo",
                desc: "Tham gia các chương trình vẽ, triển lãm nhỏ và sự kiện mỹ thuật được tổ chức định kỳ cho thiếu nhi.",
                gradient: "from-[#E6C229] to-[#c9a822]"
              },
              {
                icon: UserIcon,
                title: "Quản lý giáo viên",
                desc: "Hệ thống lưu trữ hồ sơ, bằng cấp và lịch dạy của đội ngũ giáo viên mỹ thuật.",
                gradient: "from-[#1A8FE3] to-[#6610F2]"
              },
              {
                icon: UserIcon,
                title: "Hồ sơ học viên",
                desc: "Theo dõi hành trình học vẽ, khóa học đã tham gia và tiến bộ để phụ huynh và bé cùng quản lý.",
                gradient: "from-[#F17105] to-[#E6C229]"
              },
              {
                icon: PresentationChartBarIcon,
                title: "Dashboard & Báo cáo",
                desc: "Giao diện thống kê trực quan hỗ trợ quản trị viên theo dõi và tối ưu hoạt động nền tảng.",
                gradient: "from-[#6610F2] to-[#3d0a91]"
              }
            ].map((item, index) => (
              <div key={index} className="group">
                <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-[#1A8FE3]/30 hover:bg-gradient-to-r hover:from-[#e8f4fc] hover:to-[#efe6fc]/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1A8FE3]/0 to-transparent group-hover:via-[#1A8FE3]/5 transition-all duration-500 rounded-3xl"></div>
                  <div className="relative flex items-start space-x-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${item.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#1A8FE3] text-xl mb-3 group-hover:text-[#1572b6] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-6 md:px-20 lg:px-32 bg-gradient-to-br from-gray-50 to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-[#1A8FE3] to-[#6610F2] bg-clip-text text-transparent mb-8">Đội Ngũ Của Chúng Tôi</h2>
            <div className="flex justify-center">
              <div className="w-32 h-1 bg-gradient-to-r from-[#1A8FE3] to-[#6610F2] rounded-full shadow-md"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-10 mb-16">
            <div className="group">
              <div className="bg-white p-10 rounded-3xl shadow-xl text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-blue-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <UserGroupIcon className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-blue-800 mb-4">Những Người Sáng Lập</h4>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Nhóm những tình nguyện viên đầy nhiệt huyết, cùng chung một sứ mệnh bảo vệ cộng đồng
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white p-10 rounded-3xl shadow-xl text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-emerald-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-green-600"></div>
                <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <UserIcon className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-emerald-800 mb-4">Giáo Viên Mỹ Thuật</h4>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Đội ngũ giáo viên mỹ thuật với nhiều năm kinh nghiệm giảng dạy và đồng hành cùng thiếu nhi
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white p-10 rounded-3xl shadow-xl text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-purple-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-violet-600"></div>
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <HeartIcon className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-purple-800 mb-4">Cộng Tác Viên</h4>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Trái tim của nền tảng — đội ngũ cộng tác viên đang đồng hành cùng bé học vẽ và sáng tạo
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-xl text-center border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-amber-400"></div>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-amber-400 rounded-2xl flex items-center justify-center shadow-lg">
                <StarIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <p className="text-gray-700 text-xl italic leading-relaxed max-w-4xl mx-auto">
              "Và trái tim của tổ chức chính là hàng trăm tình nguyện viên – những người đã và đang 
              cống hiến thời gian và tâm huyết để biến những ý tưởng này thành hiện thực."
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6 md:px-20 lg:px-32 bg-gradient-to-br from-[#1A8FE3] via-[#6610F2] to-[#6610F2] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#E6C229]/20 rounded-full translate-y-40 -translate-x-40"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-10 bg-gradient-to-r from-white to-[#E6C229]/90 bg-clip-text text-transparent">
            Cùng Bé Học Vẽ, Cùng Bé Sáng Tạo!
          </h2>
          <p className="text-xl text-white/90 max-w-4xl mx-auto mb-16 leading-relaxed font-light">
            Dù bạn là phụ huynh tìm khóa học cho con, giáo viên muốn hợp tác, hay đơn vị muốn đồng hành, 
            luôn có cách để bạn góp phần vào hành trình mỹ thuật của thiếu nhi.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group">
              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl hover:bg-white/20 transition-all duration-500 hover:-translate-y-2 border border-white/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <BookOpenIcon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4">Tìm Hiểu Khóa Học Vẽ</h4>
                  <p className="text-blue-100 mb-6 leading-relaxed">
                    Khám phá các khóa học vẽ và mỹ thuật được thiết kế cho thiếu nhi
                  </p>
                  <button className="bg-white text-[#1A8FE3] px-8 py-3 rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Xem Khóa Học
                  </button>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl hover:bg-white/20 transition-all duration-500 hover:-translate-y-2 border border-white/20 relative overflow-hidden h-full flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-green-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex flex-col h-full">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <HeartIcon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4">Tham Gia Cùng Chúng Tôi</h4>
                  <p className="text-blue-100 mb-6 leading-relaxed flex-grow">
                    Gia nhập đội ngũ giáo viên và cộng tác viên đồng hành cùng bé
                  </p>
                  <button className="bg-white text-emerald-800 px-8 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl mt-auto">
                    Đăng Ký Ngay
                  </button>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl hover:bg-white/20 transition-all duration-500 hover:-translate-y-2 border border-white/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-violet-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4">Liên Hệ Hợp Tác</h4>
                  <p className="text-blue-100 mb-6 leading-relaxed">
                    Kết nối với chúng tôi để xây dựng những dự án ý nghĩa
                  </p>
                  <button className="bg-white text-purple-800 px-8 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Liên Hệ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Message */}
      <section className="py-20 px-6 md:px-20 lg:px-32 bg-gradient-to-br from-white to-[#e8f4fc] relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1A8FE3]/5 to-transparent"></div>
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-[#1A8FE3] to-[#6610F2] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <SparklesIcon className="w-10 h-10 text-white" />
            </div>
          </div>
          <h3 className="text-4xl font-bold bg-gradient-to-r from-[#1A8FE3] to-[#6610F2] bg-clip-text text-transparent mb-8">
            Cùng Bé Khám Phá Thế Giới Sắc Màu
          </h3>
          <p className="text-gray-700 text-xl leading-relaxed">
            Mỗi nét vẽ hôm nay có thể mở ra niềm yêu thích nghệ thuật suốt đời. 
            Hãy cùng chúng tôi mang đến môi trường học vẽ an toàn, vui nhộn và đầy cảm hứng 
            cho thiếu nhi.
          </p>
        </div>
      </section>
    </div>
  );
}
