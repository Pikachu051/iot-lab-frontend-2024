import Layout from "../components/layout";
import menuBackgroundImage from "../assets/images/bg-cafe-3.jpg";

export default function Menu() {
    return (
        <Layout>
            <section
                className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
                style={{
                backgroundImage: `url(${menuBackgroundImage})`,
                }}
            >
                <h1 className="text-5xl mb-2">เมนู</h1>
                <h2>คาเฟ่ที่ไม่มีเครื่องดื่ม คงไม่ใช่คาเฟ่</h2>
            </section>

            <section className="container mx-auto py-8">
            <h1 className="pb-2">รายการเครื่องดื่ม</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="border border-solid border-neutral-200">
                        <div className="p-4">
                            <img src="https://placehold.co/75x75" alt="Coffee" className="w-full h-48 object-cover" />
                            <h3 className="text-lg font-medium">ชื่อเครื่องดื่ม</h3>
                            <p className="text-gray-500">ราคา: 100 บาท</p>
                            <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">สั่งซื้อ</button>
                        </div>
                        
                    </div>
                </div>
            </section>
        </Layout>
    );
}