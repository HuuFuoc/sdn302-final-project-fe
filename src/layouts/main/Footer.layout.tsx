const FooterLayout = () => {
  return (
    <footer className="bg-primary text-white py-8 px-4 rounded-t-3xl">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="transform transition-transform hover:translate-y-[-4px] duration-300">
            <h3 className="font-bold text-lg mb-3 border-b-2 border-white/30 pb-2">Về Chúng Tôi</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover-primary">Về Nền Tảng</a></li>
              <li><a href="#" className="hover-primary">Đội Ngũ Giáo Viên</a></li>
              <li><a href="#" className="hover-primary">Phương Pháp Học</a></li>
              <li><a href="#" className="hover-primary">Tuyển Dụng</a></li>
            </ul>
          </div>

          <div className="transform transition-transform hover:translate-y-[-4px] duration-300">
            <h3 className="font-bold text-lg mb-3 border-b-2 border-white/30 pb-2">Tài Liệu Học Tập</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover-primary">Khóa Học Vẽ</a></li>
              <li><a href="#" className="hover-primary">Mỹ Thuật Sáng Tạo</a></li>
              <li><a href="#" className="hover-primary">Tài Liệu Tham Khảo</a></li>
              <li><a href="#" className="hover-primary">Video Hướng Dẫn</a></li>
            </ul>
          </div>

          <div className="transform transition-transform hover:translate-y-[-4px] duration-300">
            <h3 className="font-bold text-lg mb-3 border-b-2 border-white/30 pb-2">Tin Tức & Sự Kiện</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover-primary">Tin Tức</a></li>
              <li><a href="#" className="hover-primary">Sự Kiện Sáng Tạo</a></li>
              <li><a href="#" className="hover-primary">Triển Lãm Bé Vẽ</a></li>
              <li><a href="#" className="hover-primary">Mạng Xã Hội</a></li>
            </ul>
          </div>

          <div className="transform transition-transform hover:translate-y-[-4px] duration-300">
            <h3 className="font-bold text-lg mb-3 border-b-2 border-white/30 pb-2">Liên Hệ</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover-primary">Liên Hệ Hỗ Trợ</a></li>
              <li><a href="#" className="hover-primary">Đăng Ký Nhận Tin</a></li>
              <li><a href="#" className="hover-primary">Chính Sách Bảo Mật</a></li>
              <li><a href="#" className="hover-primary">Điều Khoản Sử Dụng</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/30 text-center">
          <p className="text-white/90 font-title font-medium">© 2025 Nền tảng học vẽ & mỹ thuật thiếu nhi. Bản quyền thuộc về chúng tôi.</p>
        </div>
      </div>
    </footer>
  )
}

export default FooterLayout