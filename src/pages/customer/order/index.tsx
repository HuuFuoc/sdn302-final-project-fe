import OrderSuccessList from "../../../components/customer/order/OrderSuccess.com";

export default function OrderHistory() {
  return (
    <>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 20 }}>Lịch sử đơn hàng</h2>
      <OrderSuccessList />
    </>
  );
}
