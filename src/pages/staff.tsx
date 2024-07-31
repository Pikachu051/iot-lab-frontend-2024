import Layout from "../components/layout";
import { Card, Button, Text, Group, Badge, Alert } from "@mantine/core";
import useSWR from "swr";
import Loading from "../components/loading";
import type { Order, Menu } from "../lib/models";
import { IconAlertTriangleFilled } from "@tabler/icons-react";
import menuBackgroundImage from "../assets/images/bg-cafe-4.jpg";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

export default function Staff() {
  const { data: orders, isLoading, error } = useSWR<Order[]>("/orders");
  const { data: menus } = useSWR<Menu[]>("/menus");
  const [processingOrder, setProcessingOrder] = useState<string | null>(null);

  const handleCompleteOrder = async (orderId: string) => {
    try {
      setProcessingOrder(orderId);
      await axios.patch(`/orders/${orderId}`, { is_completed: true });
      notifications.show({
        title: "คำสั่งซื้อสำเร็จ",
        message: "คำสั่งซื้อถูกทำเสร็จเรียบร้อยแล้ว รหัสคำสั่งซื้อ " + orderId,
        color: "teal",
      });
      setTimeout(() => {
        window.location.reload();
    }, 2000);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          notifications.show({
            title: "ไม่พบข้อมูลคำสั่งซื้อ",
            message: "ไม่พบข้อมูลคำสั่งซื้อที่ต้องการแก้ไขสถานะ",
            color: "red",
          });
        } else if (error.response?.status === 422) {
          notifications.show({
            title: "เกิดข้อผิดพลาดในการประมวลผลข้อมูล",
            message: "กรุณาแจ้งผู้เชี่ยวชาญให้ตรวจสอบระบบหลังบ้านแล้วลองใหม่อีกครั้ง",
            color: "red",
          });
        } else if (error.response?.status || 500 >= 500) {
          notifications.show({
            title: "เกิดข้อผิดพลาดบางอย่าง",
            message: "กรุณาลองใหม่อีกครั้ง",
            color: "red",
          });
        }
      } else {
        notifications.show({
          title: "เกิดข้อผิดพลาดบางอย่าง",
          message: "กรุณาลองใหม่อีกครั้ง หรือดูที่ Console สำหรับข้อมูลเพิ่มเติม",
          color: "red",
        });
      }
    } finally {
      setProcessingOrder(null);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      setProcessingOrder(orderId);
      await axios.delete(`/orders/${orderId}`);
      notifications.show({
        title: "ยกเลิกคำสั่งซื้อสำเร็จ",
        message: "คำสั่งซื้อถูกยกเลิกเรียบร้อยแล้ว รหัสคำสั่งซื้อ " + orderId,
        color: "teal",
      });
      setTimeout(() => {
        window.location.reload();
    }, 2000);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          notifications.show({
            title: "ไม่พบข้อมูลคำสั่งซื้อ",
            message: "ไม่พบข้อมูลคำสั่งซื้อที่ต้องการยกเลิก",
            color: "red",
          });
        } else if (error.response?.status === 422) {
          notifications.show({
            title: "เกิดข้อผิดพลาดในการประมวลผลข้อมูล",
            message: "กรุณาแจ้งผู้เชี่ยวชาญให้ตรวจสอบระบบหลังบ้านแล้วลองใหม่อีกครั้ง",
            color: "red",
          });
        } else if (error.response?.status || 500 >= 500) {
          notifications.show({
            title: "เกิดข้อผิดพลาดบางอย่าง",
            message: "กรุณาลองใหม่อีกครั้ง",
            color: "red",
          });
        }
      } else {
        notifications.show({
          title: "เกิดข้อผิดพลาดบางอย่าง",
          message: "กรุณาลองใหม่อีกครั้ง หรือดูที่ Console สำหรับข้อมูลเพิ่มเติม",
          color: "red",
        });
      }
    } finally {
      setProcessingOrder(null);
    }
  };

  const incompleteOrders = orders
    ?.filter((order) => !order.is_completed)
    .sort((a, b) => new Date(a.order_time).getTime() - new Date(b.order_time).getTime());

  const completeOrders = orders?.filter((order) => order.is_completed);
  return (
    <Layout>
      <section
        className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
        style={{
          backgroundImage: `url(${menuBackgroundImage})`,
        }}
      >
        <h1 className="text-5xl mb-2">พนักงาน</h1>
        <h2>ถ้าไม่มีพวกคุณ คาเฟ่คงล่มจม</h2>
      </section>
      {isLoading && !error && <Loading />}
      {error && (
        <Alert color="red" title="เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูลรายการคำสั่งซื้อ" icon={<IconAlertTriangleFilled />}>
          {error.message}
        </Alert>
      )}
      <section className="container mx-auto py-8">
        <h1>รายการที่ยังไม่เสร็จ</h1>
        {incompleteOrders?.length === 0 ? (
          <p className="py-10 text-center">ไม่มีรายการคำสั่งซื้อ ณ ตอนนี้</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-5">
            {incompleteOrders?.map((order, index) => {
              const menu = menus?.find((menu) => menu.id === order.menu_id);
              const menuName = menu?.name || "เมนูที่ไม่รู้จัก";

              return (
                <Card key={order.id} shadow="sm" padding="lg" radius="md" withBorder>
                  <Card.Section></Card.Section>
                  <Group justify="space-between" mt="md" mb="xs">
                    <Text fw={500}>คำสั่งซื้อลำดับที่ {index + 1}</Text>
                    <Badge color="pink">ยังไม่เสร็จ</Badge>
                  </Group>

                  <Text className="pb-4" size="sm">
                    <div className="grid grid-cols-2">
                      <p className="pb-3">{menuName}</p>
                      <p className="text-right">{order.quantity} รายการ</p>
                    </div>
                    <p className="text-center mb-4">{order.total_price} บาท</p>
                    {order.note !== "" ? (
                      <p className="sm pb-4">หมายเหตุ: {order.note}</p>
                    ) : (
                      <div></div>
                    )}
                  </Text>
                  <Text size="sm" c="dimmed">
                    ID: {order.id}
                  </Text>

                  <div className="grid grid-cols-2">
                    <Button
                      color="red"
                      fullWidth
                      mt="md"
                      className="mr-1"
                      radius="md"
                      onClick={() => handleCancelOrder(order.id)}
                      loading={processingOrder === order.id}
                    >
                      ยกเลิก
                    </Button>
                    <Button
                      color="green"
                      fullWidth
                      mt="md"
                      className="ml-1"
                      radius="md"
                      onClick={() => handleCompleteOrder(order.id)}
                      loading={processingOrder === order.id}
                    >
                      เสร็จสิ้น
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
        <h1>รายการที่สำเร็จแล้ว</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-5">
          {completeOrders?.map((order) => {
            const menu = menus?.find((menu) => menu.id === order.menu_id);
            const menuName = menu?.name || "เมนูที่ไม่รู้จัก";

            return (
              <Card key={order.id} shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section></Card.Section>
                <Group justify="space-between" mt="md" mb="xs">
                  <Text fw={500}>คำสั่งซื้อ</Text>
                  <Badge color="teal">เสร็จสิ้น</Badge>
                </Group>
                <Text className="pb-4" size="sm">
                  <div className="grid grid-cols-2">
                    <p className="pb-3">{menuName}</p>
                    <p className="text-right">{order.quantity} รายการ</p>
                  </div>
                  <p className="text-center mb-4">{order.total_price} บาท</p>
                </Text>
                <Text size="sm" c="dimmed">
                  ID: {order.id}
                </Text>
              </Card>
            );
          })}
        </div>
      </section>
    </Layout>
  );
}
