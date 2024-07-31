import Layout from "../components/layout";
import menuBackgroundImage from "../assets/images/bg-cafe-3.jpg";
import useSWR from "swr";
import type { Menu } from "../lib/models";
import { Modal, Button, NumberInput, Alert, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Loading from "../components/loading";
import { IconAlertTriangleFilled } from "@tabler/icons-react";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { v4 as uuidv4 } from "uuid";

interface ModalParams {
  drink_id: number | null;
  drink_name: string | null;
}

interface OrderData {
  id: string;
  menu_id: number;
  quantity: number;
  total_price: number;
  is_completed: boolean;
  order_time: string;
  note: string;
}

const initialOrderData: OrderData = {
  id: "",
  menu_id: 0,
  quantity: 1,
  total_price: 0,
  is_completed: false,
  order_time: "",
  note: "",
};

export default function Menu() {
  const { data: menus, isLoading, error } = useSWR<Menu[]>("/menus");
  const [opened, { open, close }] = useDisclosure(false);
  const [modalParams, setModalParams] = useState<ModalParams>({ drink_id: null, drink_name: null });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderData, setOrderData] = useState<OrderData>(initialOrderData);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [note, setNote] = useState("");

  const openModal = (params: ModalParams) => {
    setModalParams(params);
    open();
  };

  const handleSubmit = async (values: OrderData) => {
    values.id = uuidv4();
    values.menu_id = modalParams.drink_id as number;
    values.quantity = quantities[modalParams.drink_id as number] ?? 1;
    values.total_price = (menus?.find((menu) => menu.id === modalParams.drink_id)?.price ?? 0) * (quantities[modalParams.drink_id as number] ?? 1);
    values.is_completed = false;
    values.order_time = new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" });
    values.note = note;
    try {
      setIsProcessing(true);
      await axios.post(`/orders`, values);
      notifications.show({
        title: "สั่งซื้อสำเร็จ",
        message: "รหัสคำสั่งซื้อของคุณคือ " + values.id,
        color: "teal",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          notifications.show({
            title: "ไม่พบเครื่องดื่มในฐานข้อมูล",
            message: "โปรดติดต่อผู้ดูแลระบบ",
            color: "red",
          });
        } else if (error.response?.status === 422) {
          notifications.show({
            title: "ข้อมูลไม่ถูกต้อง",
            message: "กรุณาลองใหม่อีกครั้ง",
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
      setIsProcessing(false);
      close();
    }
  };

  const handleQuantityChange = (id: number, value: number) => {
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(event.currentTarget.value);
  };

  const handleModalClose = () => {
    close();
    setOrderData(initialOrderData);
    setNote("");
  };

  return (
    <Layout>
      <Modal
        opened={opened}
        onClose={handleModalClose}
        centered
        title="ยืนยันการสั่งซื้อ"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 4,
        }}
      >
        <div className="grid grid-cols-2 pb-4">
          <p className="text-md">{modalParams.drink_name}</p>
          <NumberInput
            label="จำนวน"
            placeholder="จำนวน"
            min={1}
            max={10}
            value={quantities[modalParams.drink_id as number] || 1}
            onChange={(value) => handleQuantityChange(modalParams.drink_id as number, Number(value))}
            className="pb-4"
          />
          <p>ราคาทั้งหมด</p>
          <p>{(menus?.find((menu) => menu.id === modalParams.drink_id)?.price || 0) * (quantities[modalParams.drink_id as number] || 1)} บาท</p>
        </div>
        <Textarea
            label="หมายเหตุ"
            placeholder="ขอลาเต้แบบที่ไม่ใส่นม"
            value={note}
            onChange={handleNoteChange}
            className="pb-4"
          />
        <div className="flex justify-between pb-4">
          <Button onClick={handleModalClose} color="red">
            ยกเลิก
          </Button>
          <Button
            onClick={() => {
              const selectedQuantity = quantities[modalParams.drink_id as number] || 1;
              const selectedMenu = menus?.find((menu) => menu.id === modalParams.drink_id);

              if (selectedMenu) {
                setOrderData((prev) => ({
                  ...prev,
                  menu_id: modalParams.drink_id as number,
                  quantity: selectedQuantity,
                  total_price: selectedQuantity * selectedMenu.price,
                  note: note,
                }));
                handleSubmit(orderData);
              } else {
                notifications.show({
                  title: "เกิดข้อผิดพลาด",
                  message: "ไม่พบเครื่องดื่มที่เลือกในฐานข้อมูล",
                  color: "red",
                });
              }
            }}
            color="green"
            loading={isLoading || isProcessing}
          >
            ยืนยัน
          </Button>
        </div>
      </Modal>
      <section
        className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
        style={{
          backgroundImage: `url(${menuBackgroundImage})`,
        }}
      >
        <h1 className="text-5xl mb-2">เมนู</h1>
        <h2>คาเฟ่ที่ไม่มีเครื่องดื่ม คงไม่ใช่คาเฟ่</h2>
      </section>

      {isLoading && !error && <Loading />}
      {error && (
        <Alert color="red" title="เกิดข้อผิดพลาดในการอ่านข้อมูล" icon={<IconAlertTriangleFilled />}>
          {error.message}
        </Alert>
      )}

      <section className="container mx-auto py-8">
        <h1 className="pb-2">รายการเครื่องดื่ม</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {menus?.map((menu) => (
            <div className="border border-solid border-neutral-200" key={menu.id}>
              <img src={menu.img} alt={menu.name} className="w-full object-cover aspect-[3/4]" />
              <div className="p-3">
                <h3 className="text-lg">{menu.name}</h3>
                <p className="text-sm pb-4">{menu.price} บาท</p>
                <NumberInput
                  label="จำนวน"
                  placeholder="จำนวน"
                  min={1}
                  max={10}
                  value={quantities[menu.id] || 1}
                  onChange={(value) => handleQuantityChange(menu.id, Number(value))}
                  className="pb-4"
                />
                <Button
                  onClick={() =>
                    openModal({
                      drink_id: menu.id,
                      drink_name: menu.name,
                    })
                  }
                >
                  สั่งซื้อ
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
