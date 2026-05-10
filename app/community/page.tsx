"use client";

import MainLayout from "../../layouts/MainLayout";
import { Typography, Card, Button } from "antd";
import { TeamOutlined, PlusOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

export default function Community() {
  return (
    <MainLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="max-w-5xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <Title level={2} className="text-gray-800 m-0 tracking-tight">Community Hub</Title>
            <Text className="text-gray-500">Connect with global explorers and share your journeys.</Text>
          </div>
          <Button 
            type="primary" 
            size="large" 
            icon={<PlusOutlined />} 
            className="bg-primary rounded-xl shadow-md h-12 px-6 font-bold hover:bg-primary/90 transition-colors border-none"
          >
            Post Update
          </Button>
        </div>

        <Card className="rounded-3xl border border-gray-100 shadow-sm bg-white text-center py-20">
          <div className="flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-6">
              <TeamOutlined className="text-4xl text-primary" />
            </div>
            <Title level={3} className="text-gray-800 mb-2">Community Coming Soon</Title>
            <Text className="text-gray-500 max-w-md mx-auto text-lg">
              We're building an exclusive space for Traveloop members to share itineraries, tips, and connect with like-minded travelers.
            </Text>
          </div>
        </Card>
      </motion.div>
    </MainLayout>
  );
}
