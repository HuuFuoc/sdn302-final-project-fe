import { Link } from 'react-router-dom'
import { Form, Input, Button, DatePicker, message } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { useRegister } from '../../../hooks/useAuth'
import { ROUTER_URL } from '../../../consts/router.path.const'
import Background from '../../../assets/cover.jpg'
import dayjs from 'dayjs'

const validatePassword = (_: any, value: string) => {
  if (!value) return Promise.resolve()

  const hasUpperCase = /[A-Z]/.test(value)
  const hasLowerCase = /[a-z]/.test(value)
  const hasNumbers = /\d/.test(value)

  if (value.length < 8) {
    return Promise.reject(new Error('Mật khẩu phải có ít nhất 8 ký tự'))
  }

  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return Promise.reject(new Error('Mật khẩu phải bao gồm chữ hoa, chữ thường và số'))
  }

  return Promise.resolve()
}

const validateEmail = (_: any, value: string) => {
  if (!value) return Promise.resolve()

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    return Promise.reject(new Error('Email không hợp lệ'))
  }

  return Promise.resolve()
}

const validateName = (_: any, value: string) => {
  if (!value) return Promise.resolve()

  const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/
  if (!nameRegex.test(value)) {
    return Promise.reject(new Error('Tên chỉ được chứa chữ cái và khoảng trắng'))
  }

  if (value.trim().length < 2) {
    return Promise.reject(new Error('Tên phải có ít nhất 2 ký tự'))
  }

  return Promise.resolve()
}

const validateDateOfBirth = (_: any, value: any) => {
  if (!value) return Promise.resolve()

  const today = dayjs()
  const birthDate = dayjs(value)
  const age = today.diff(birthDate, 'year')

  if (birthDate.isAfter(today)) {
    return Promise.reject(new Error('Ngày sinh không thể trong tương lai'))
  }

  if (age < 13) {
    return Promise.reject(new Error('Bạn phải ít nhất 13 tuổi để đăng ký'))
  }

  if (age > 100) {
    return Promise.reject(new Error('Vui lòng kiểm tra lại ngày sinh'))
  }

  return Promise.resolve()
}

const validatePasswordConfirmation = (getFieldValue: any) => ({
  validator(_: any, value: string) {
    if (!value || getFieldValue('password') === value) {
      return Promise.resolve()
    }
    return Promise.reject(new Error('Mật khẩu xác nhận không khớp'))
  },
})

const RegisterPage = () => {
  const [form] = Form.useForm()
  const { mutate: register } = useRegister()

  const handleSubmit = async (values: any) => {
    try {
      const formattedValues = {
        name: values.name?.trim(),
        email: values.email?.trim(),
        password: values.password,
        confirm_password: values.confirm_password,
        date_of_birth: dayjs(values.date_of_birth).format('YYYY-MM-DD'),
      }

      console.log('Submitting registration with data:', formattedValues)

      register(formattedValues)
    } catch (error) {
      console.error('Form submission error:', error)
      message.error('Registration failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-purple-900/70 mix-blend-multiply z-10"></div>
        <div className="absolute inset-0 backdrop-blur-sm z-0"></div>
        <img
          src={Background}
          alt="Background"
          className="w-full h-full object-cover animate-slow-zoom"
        />
      </div>

      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden w-full max-w-2xl relative z-20 transition-all duration-700 hover:shadow-blue-900/20 animate-fade-in">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[80px] border-t-[#0056b3] border-l-[80px] border-l-transparent z-10"></div>
        <div className="absolute bottom-0 left-0 w-0 h-0 border-b-[80px] border-b-[#0056b3] border-r-[80px] border-r-transparent z-10"></div>

        <div className="px-10 pt-14 pb-10">
          <Link to="/" className="transition-transform hover:scale-105 duration-300 block">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold mb-2">PDP</h1>
              <h2 className="text-lg uppercase tracking-wider text-gray-800">Đăng ký tài khoản</h2>
            </div>
          </Link>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
            className="space-y-2"
          >
            <Form.Item
              name="name"
              label="Họ và tên"
              rules={[
                { required: true, message: 'Vui lòng nhập họ và tên' },
                { validator: validateName },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { validator: validateEmail },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu' },
                { validator: validatePassword },
              ]}
              help="Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số"
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
            </Form.Item>

            <Form.Item
              name="confirm_password"
              label="Xác nhận mật khẩu"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                validatePasswordConfirmation(form.getFieldValue),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
            </Form.Item>

            <Form.Item
              name="date_of_birth"
              label="Ngày sinh"
              rules={[
                { required: true, message: 'Vui lòng chọn ngày sinh' },
                { validator: validateDateOfBirth },
              ]}
            >
              <DatePicker
                className="w-full"
                placeholder="Ngày sinh"
                disabledDate={(current) => {
                  const today = dayjs()
                  const hundredYearsAgo = today.subtract(100, 'year')
                  return current && (current.isAfter(today, 'day') || current.isBefore(hundredYearsAgo, 'day'))
                }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12 bg-primary hover:bg-[#0056b3] text-white rounded transition-all duration-300 font-medium hover:shadow-lg"
              >
                Đăng ký
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Đã có tài khoản?{' '}
              <Link
                to={ROUTER_URL.AUTH.LOGIN}
                className="text-primary hover:underline font-medium transition-colors duration-300"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
