"use client";

import React, { useState } from "react";
import FutureLayout from "../../../layouts/FutureLayout";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  InputNumber, 
  Upload, 
  Switch, 
  Button, 
  message 
} from "antd";
import { 
  RocketOutlined, 
  EnvironmentOutlined, 
  CloudUploadOutlined, 
  DollarOutlined, 
  TeamOutlined 
} from "@ant-design/icons";

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Dragger } = Upload;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100 }
  }
};

export default function CreateTrip() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = (values: any) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      message.success({
        content: 'Mission parameters logged. Trip successfully created!',
        className: 'custom-message',
        style: { marginTop: '10vh' }
      });
      setIsSubmitting(false);
      router.push("/explore-3d");
    }, 2000);
  };

  return (
    <FutureLayout>
      <div className="max-w-4xl mx-auto pb-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-block px-4 py-1 rounded-full border border-cyan-500/50 bg-cyan-500/10 text-cyan-400 text-xs font-bold tracking-widest mb-4 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            NEW MISSION PROTOCOL
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Create New Trip</h1>
          <p className="text-white/60 text-lg">Define the parameters of your upcoming dimensional journey.</p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          {/* Decorative glow behind form */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
          
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            className="relative z-10 custom-dark-form"
          >
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              {/* 1. Trip Name */}
              <Form.Item
                name="title"
                label={<span className="text-white/80 font-medium tracking-wide">Trip Name</span>}
                rules={[{ required: true, message: "Mission designation is required" }]}
                className="col-span-1 md:col-span-2"
              >
                <Input 
                  size="large" 
                  placeholder="e.g. Summer Europe Adventure" 
                  prefix={<RocketOutlined className="text-cyan-400 mr-2" />}
                  className="bg-black/40 border-white/10 text-white hover:border-cyan-500/50 focus:border-cyan-400 focus:bg-black/60 rounded-xl py-3"
                />
              </Form.Item>

              {/* 2. Destination */}
              <Form.Item
                name="destination"
                label={<span className="text-white/80 font-medium tracking-wide">Destination</span>}
                rules={[{ required: true, message: "Target coordinates required" }]}
              >
                <Select
                  size="large"
                  showSearch
                  placeholder="Search sector or city"
                  className="w-full custom-dark-select"
                  styles={{ popup: { root: { backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' } } }}
                  options={[
                    { value: 'tokyo', label: 'Tokyo, Japan' },
                    { value: 'paris', label: 'Paris, France' },
                    { value: 'bali', label: 'Bali, Indonesia' },
                    { value: 'newyork', label: 'New York City, USA' },
                    { value: 'moon', label: 'Lunar Base Alpha (Simulated)' },
                  ]}
                />
              </Form.Item>

              {/* 3 & 4. Dates */}
              <Form.Item
                name="dates"
                label={<span className="text-white/80 font-medium tracking-wide">Mission Window (Start - End)</span>}
                rules={[{ required: true, message: "Timeframe required" }]}
              >
                <RangePicker 
                  size="large" 
                  className="w-full bg-black/40 border-white/10 hover:border-cyan-500/50 rounded-xl py-3" 
                  classNames={{ popup: { root: "custom-dark-datepicker" } }}
                />
              </Form.Item>

              {/* 6. Estimated Budget */}
              <Form.Item
                name="budget"
                label={<span className="text-white/80 font-medium tracking-wide">Estimated Budget</span>}
              >
                <InputNumber 
                  size="large"
                  className="w-full bg-black/40 border-white/10 hover:border-cyan-500/50 rounded-xl py-1 text-white"
                  prefix={<DollarOutlined className="text-cyan-400 mr-1" />}
                  formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                  placeholder="5000"
                />
              </Form.Item>

              {/* 7. Travelers Count */}
              <Form.Item
                name="travelers"
                label={<span className="text-white/80 font-medium tracking-wide">Crew Size</span>}
              >
                <InputNumber 
                  size="large"
                  className="w-full bg-black/40 border-white/10 hover:border-cyan-500/50 rounded-xl py-1"
                  min={1}
                  max={20}
                  prefix={<TeamOutlined className="text-cyan-400 mr-1" />}
                  placeholder="2"
                />
              </Form.Item>

              {/* 8. Travel Type */}
              <Form.Item
                name="type"
                label={<span className="text-white/80 font-medium tracking-wide">Expedition Type</span>}
                className="col-span-1 md:col-span-2"
              >
                <Select
                  size="large"
                  placeholder="Select type"
                  className="w-full md:w-1/2 custom-dark-select"
                  styles={{ popup: { root: { backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' } } }}
                  options={[
                    { value: 'solo', label: 'Solo' },
                    { value: 'family', label: 'Family' },
                    { value: 'friends', label: 'Friends' },
                    { value: 'couple', label: 'Couple' },
                    { value: 'business', label: 'Business' },
                  ]}
                />
              </Form.Item>

              {/* 5. Trip Description */}
              <Form.Item
                name="description"
                label={<span className="text-white/80 font-medium tracking-wide">Briefing / Description</span>}
                className="col-span-1 md:col-span-2"
              >
                <TextArea 
                  rows={4} 
                  placeholder="Detail the objectives and expectations of this journey..." 
                  className="bg-black/40 border-white/10 text-white hover:border-cyan-500/50 focus:border-cyan-400 rounded-xl p-4 resize-none"
                />
              </Form.Item>

              {/* 10. Tags / Interests */}
              <Form.Item
                name="tags"
                label={<span className="text-white/80 font-medium tracking-wide">Interests & Modifiers</span>}
                className="col-span-1 md:col-span-2"
              >
                <Select
                  mode="tags"
                  size="large"
                  placeholder="Add tags (e.g., Cyberpunk, Food, Nature)"
                  className="w-full custom-dark-tags"
                  styles={{ popup: { root: { backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' } } }}
                  options={[
                    { value: 'adventure', label: 'Adventure' },
                    { value: 'beach', label: 'Beach' },
                    { value: 'food', label: 'Food' },
                    { value: 'nature', label: 'Nature' },
                    { value: 'luxury', label: 'Luxury' },
                    { value: 'culture', label: 'Culture' },
                  ]}
                />
              </Form.Item>

              {/* 9. Cover Photo Upload */}
              <Form.Item
                name="coverImage"
                label={<span className="text-white/80 font-medium tracking-wide">Cover Visual (Optional)</span>}
                className="col-span-1 md:col-span-2"
                valuePropName="fileList"
                getValueFromEvent={(e: any) => {
                  if (Array.isArray(e)) return e;
                  return e?.fileList;
                }}
              >
                <Dragger 
                  name="file" 
                  multiple={false} 
                  action="/api/upload"
                  className="bg-black/20 border-white/10 hover:border-cyan-400 hover:bg-cyan-500/5 transition-colors rounded-xl"
                >
                  <p className="ant-upload-drag-icon text-cyan-400">
                    <CloudUploadOutlined className="text-4xl" />
                  </p>
                  <p className="text-white/80 font-medium text-lg">Click or drag image to upload</p>
                  <p className="text-white/40 mt-2">Support for high-res orbital telemetry images</p>
                </Dragger>
              </Form.Item>
            </motion.div>

            {/* Bottom Actions */}
            <motion.div variants={itemVariants} className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
              {/* 11. Privacy Settings */}
              <Form.Item name="isPublic" valuePropName="checked" className="mb-0">
                <div className="flex items-center gap-3">
                  <Switch className="bg-white/20 checked:bg-cyan-500" />
                  <span className="text-white/60">Make itinerary public to other explorers</span>
                </div>
              </Form.Item>

              {/* 12. Submit Button */}
              <div className="flex gap-4 w-full md:w-auto">
                <Button 
                  size="large" 
                  onClick={() => router.back()}
                  className="flex-1 md:flex-none bg-transparent border-white/20 text-white hover:text-cyan-400 hover:border-cyan-400 rounded-xl px-8 h-12"
                >
                  Abort
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  size="large" 
                  loading={isSubmitting}
                  className="flex-1 md:flex-none bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 border-none text-white font-bold rounded-xl px-10 h-12 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                >
                  Initialize Trip
                </Button>
              </div>
            </motion.div>
          </Form>
        </motion.div>
      </div>

      {/* Embedded Styles for Ant Design Dark Mode Overrides */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-dark-select .ant-select-selector,
        .custom-dark-tags .ant-select-selector {
          background-color: rgba(0, 0, 0, 0.4) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          border-radius: 0.75rem !important;
          padding-top: 0.5rem !important;
          padding-bottom: 0.5rem !important;
        }
        .custom-dark-select:hover .ant-select-selector,
        .custom-dark-tags:hover .ant-select-selector,
        .custom-dark-select-focused .ant-select-selector {
          border-color: rgba(34, 211, 238, 0.5) !important;
        }
        .ant-select-selection-placeholder {
          color: rgba(255, 255, 255, 0.3) !important;
        }
        .ant-select-selection-item {
          color: white !important;
        }
        .ant-picker {
          background-color: rgba(0, 0, 0, 0.4) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        .ant-picker-input > input {
          color: white !important;
        }
        .ant-picker-input > input::placeholder {
          color: rgba(255, 255, 255, 0.3) !important;
        }
        .ant-picker-separator {
          color: rgba(255, 255, 255, 0.5) !important;
        }
        .ant-picker-suffix {
          color: rgba(34, 211, 238, 1) !important;
        }
        .ant-input-number {
          background-color: transparent !important;
          border-color: transparent !important;
          color: white !important;
        }
        .ant-input-number-input {
          color: white !important;
        }
        .ant-upload.ant-upload-drag {
          background: rgba(0, 0, 0, 0.2) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        .ant-upload.ant-upload-drag:hover {
          border-color: #22d3ee !important;
        }
        /* Style for Select Dropdown items */
        .ant-select-dropdown {
          background-color: #0f172a !important;
        }
        .ant-select-item-option {
          color: rgba(255, 255, 255, 0.8) !important;
        }
        .ant-select-item-option-active {
          background-color: rgba(34, 211, 238, 0.1) !important;
        }
        .ant-select-item-option-selected {
          background-color: rgba(34, 211, 238, 0.2) !important;
          color: #22d3ee !important;
        }
        .ant-select-multiple .ant-select-selection-item {
          background: rgba(34, 211, 238, 0.1) !important;
          border-color: rgba(34, 211, 238, 0.3) !important;
          color: #22d3ee !important;
        }
      `}} />
    </FutureLayout>
  );
}
