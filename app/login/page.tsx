"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Form, Input, Button, Checkbox, message } from "antd";
import { 
  MailOutlined, 
  LockOutlined, 
  GoogleOutlined, 
  GithubOutlined,
  ArrowRightOutlined
} from "@ant-design/icons";

export default function Login() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      message.success(isLogin ? "Successfully logged in!" : "Account created successfully!");
      router.push("/");
    }, 1500);
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-surface text-on-surface-variant">
      {/* Left Side: Hero Section */}
      <motion.section 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden md:flex relative md:w-1/2 lg:w-3/5 xl:w-2/3 h-screen overflow-hidden"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          alt="Adventure travel lifestyle" 
          className="absolute inset-0 w-full h-full object-cover" 
          src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=2000&q=80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-black/20"></div>
        {/* Hero Branding Overlay */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="absolute bottom-xl left-xl right-xl text-white"
        >
          <div className="flex items-center gap-xs mb-md">
            <span className="material-symbols-outlined text-[40px]">flight_takeoff</span>
            <h1 className="font-headline-lg text-headline-lg m-0">Traveloop</h1>
          </div>
          <h2 className="font-display-lg text-display-lg mb-sm max-w-xl m-0">Start your next curated adventure today.</h2>
          <p className="font-body-lg text-body-lg text-surface-container-highest max-w-md m-0 mt-4">Join over 50,000 global explorers who trust our concierge-level trip planning and community-driven insights.</p>
        </motion.div>
      </motion.section>

      {/* Right Side: Auth Form Container */}
      <motion.section 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="flex-1 flex flex-col justify-center items-center px-margin-mobile md:px-xl py-xl bg-surface relative"
      >
        {/* Mobile Brand Header (Hidden on Desktop) */}
        <div className="md:hidden flex flex-col items-center mb-lg pt-8">
          <span className="material-symbols-outlined text-primary text-[48px] mb-xs">flight_takeoff</span>
          <span className="font-headline-lg text-headline-lg text-primary">Traveloop</span>
        </div>

        <div className="w-full max-w-[440px] bg-white p-8 rounded-3xl shadow-sm border border-outline-variant/30">
          {/* Toggle Mode Navigation */}
          <div className="flex gap-md mb-8 border-b border-outline-variant/50 relative">
            <button 
              onClick={() => { setIsLogin(true); form.resetFields(); }}
              className={`pb-sm font-label-md text-label-md transition-all flex-1 text-center bg-transparent border-none cursor-pointer ${isLogin ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'}`}
            >
              LOGIN
            </button>
            <button 
              onClick={() => { setIsLogin(false); form.resetFields(); }}
              className={`pb-sm font-label-md text-label-md transition-all flex-1 text-center bg-transparent border-none cursor-pointer ${!isLogin ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'}`}
            >
              SIGN UP
            </button>
            {/* Active Indicator Line */}
            <div 
              className={`absolute bottom-0 h-[2px] bg-secondary transition-all duration-300 w-1/2`}
              style={{ left: isLogin ? '0%' : '50%' }}
            />
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h3 className="font-headline-md text-headline-md text-primary mb-xs m-0">
              {isLogin ? "Welcome back" : "Create an account"}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant m-0 mt-1">
              {isLogin ? "Please enter your details to access your hub." : "Join us to start planning your dream trips."}
            </p>
          </div>

          {/* Authentication Form */}
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            requiredMark={false}
            className="space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {/* Email Input */}
              <motion.div
                key="email"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Form.Item
                  name="email"
                  label={<span className="font-label-md text-label-md text-primary uppercase">Email Address</span>}
                  rules={[
                    { required: true, message: 'Please input your email!' },
                    { type: 'email', message: 'Please enter a valid email!' }
                  ]}
                  className="mb-0"
                >
                  <Input 
                    size="large"
                    prefix={<MailOutlined className="text-gray-400 mr-2" />} 
                    placeholder="explorer@traveloop.com" 
                    className="rounded-xl bg-gray-50 hover:bg-white focus:bg-white py-3 transition-colors"
                  />
                </Form.Item>
              </motion.div>

              {/* Password Input */}
              <motion.div
                key="password"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.1 }}
                className="mt-4"
              >
                <Form.Item
                  name="password"
                  label={
                    <div className="flex justify-between w-full items-center">
                      <span className="font-label-md text-label-md text-primary uppercase">Password</span>
                      {isLogin && (
                        <a className="font-label-md text-label-md text-secondary hover:underline cursor-pointer">FORGOT PASSWORD?</a>
                      )}
                    </div>
                  }
                  rules={[
                    { required: true, message: 'Please input your password!' },
                    { min: 6, message: 'Password must be at least 6 characters!' }
                  ]}
                  className="mb-0"
                >
                  <Input.Password 
                    size="large"
                    prefix={<LockOutlined className="text-gray-400 mr-2" />} 
                    placeholder="••••••••" 
                    className="rounded-xl bg-gray-50 hover:bg-white focus:bg-white py-3 transition-colors"
                  />
                </Form.Item>
              </motion.div>

              {/* Confirm Password (Signup Only) */}
              {!isLogin && (
                <motion.div
                  key="confirmPassword"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 overflow-hidden"
                >
                  <Form.Item
                    name="confirmPassword"
                    label={<span className="font-label-md text-label-md text-primary uppercase mt-2 block">Confirm Password</span>}
                    dependencies={['password']}
                    rules={[
                      { required: true, message: 'Please confirm your password!' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('The new password that you entered do not match!'));
                        },
                      }),
                    ]}
                    className="mb-0"
                  >
                    <Input.Password 
                      size="large"
                      prefix={<LockOutlined className="text-gray-400 mr-2" />} 
                      placeholder="••••••••" 
                      className="rounded-xl bg-gray-50 hover:bg-white focus:bg-white py-3 transition-colors"
                    />
                  </Form.Item>
                </motion.div>
              )}

              {/* Remember Me (Login Only) */}
              {isLogin && (
                <motion.div
                  key="remember"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-4"
                >
                  <Form.Item name="remember" valuePropName="checked" className="mb-0">
                    <Checkbox className="text-on-surface-variant font-body-sm">Remember me for 30 days</Checkbox>
                  </Form.Item>
                </motion.div>
              )}

              {/* Action Button */}
              <motion.div
                key="submit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-8"
              >
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  size="large"
                  loading={isLoading}
                  icon={!isLoading && <ArrowRightOutlined />}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-headline-sm rounded-xl shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-sm border-none"
                >
                  {isLogin ? "Login to Dashboard" : "Create Account"}
                </Button>
              </motion.div>
            </AnimatePresence>
          </Form>

          {/* Divider */}
          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/40"></div>
            </div>
            <span className="relative px-md bg-white font-label-md text-label-md text-on-surface-variant">OR CONTINUE WITH</span>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-md">
            <Button 
              size="large"
              icon={<GoogleOutlined className="text-lg" />}
              className="flex items-center justify-center gap-sm h-12 border border-outline-variant rounded-xl font-label-md text-label-md text-primary hover:bg-surface-container-low transition-colors"
            >
              GOOGLE
            </Button>
            <Button 
              size="large"
              icon={<GithubOutlined className="text-lg" />}
              className="flex items-center justify-center gap-sm h-12 border border-outline-variant rounded-xl font-label-md text-label-md text-primary hover:bg-surface-container-low transition-colors"
            >
              GITHUB
            </Button>
          </div>
        </div>

        {/* Footer Section */}
        <footer className="mt-8 w-full max-w-[440px]">
          <div className="flex flex-wrap justify-center gap-md pt-4">
            <a className="font-label-xs text-label-xs text-on-surface-variant hover:text-primary transition-colors" href="#">PRIVACY POLICY</a>
            <a className="font-label-xs text-label-xs text-on-surface-variant hover:text-primary transition-colors" href="#">TERMS OF SERVICE</a>
            <a className="font-label-xs text-label-xs text-on-surface-variant hover:text-primary transition-colors" href="#">SUPPORT</a>
          </div>
          <p className="text-center font-label-xs text-label-xs text-on-surface-variant/60 mt-sm">© 2026 Traveloop Inc.</p>
        </footer>
      </motion.section>
    </main>
  );
}
