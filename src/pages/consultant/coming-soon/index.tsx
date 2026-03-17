import { Result } from "antd";

type ComingSoonPageProps = {
  title: string;
};

const ComingSoonPage = ({ title }: ComingSoonPageProps) => (
  <div className="min-h-[320px] flex items-center justify-center">
    <Result
      status="info"
      title={title}
      subTitle="Tính năng này đang được hoàn thiện."
    />
  </div>
);

export default ComingSoonPage;
