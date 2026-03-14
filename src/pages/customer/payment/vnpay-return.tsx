import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SectionLoader } from "../../../components/common/loaders";
import { BaseService } from "../../../app/api/base.service";
import { API_PATH } from "../../../consts/api.path.const";
import { ROUTER_URL } from "../../../consts/router.path.const";

const VnpayReturnPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        // Gửi toàn bộ query lên backend để xác thực giao dịch
        const payload: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          payload[key] = value;
        });

        // Không chặn UI nếu backend trả lỗi – chỉ log
        await BaseService.get({
          url: API_PATH.VNPAY.RETURN,
          payload,
          isLoading: false,
        });
      } catch (error) {
        console.error("Lỗi xác thực thanh toán VNPAY:", error);
      } finally {
        const responseCode = searchParams.get("vnp_ResponseCode");
        if (responseCode === "00") {
          navigate(ROUTER_URL.CLIENT.PAYMENT_SUCCESS, { replace: true });
        } else {
          navigate(ROUTER_URL.CLIENT.PAYMENT_FAIL, { replace: true });
        }
      }
    };

    confirmPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen">
      <SectionLoader className="min-h-screen">
        <p className="text-gray-600 text-base">
          Đang xử lý kết quả thanh toán VNPAY, vui lòng chờ trong giây lát...
        </p>
      </SectionLoader>
    </div>
  );
};

export default VnpayReturnPage;

