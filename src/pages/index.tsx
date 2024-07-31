import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-1.jpg";
import ajPanwitImage from "../assets/images/aj-panwit.jpg";
import coffeeImage from "../assets/images/coffee-1.jpg";
import myImage from "../assets/images/me.jpg";

export default function HomePage() {
  return (
    <Layout>
      <section
        className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
        style={{
          backgroundImage: `url(${cafeBackgroundImage})`,
        }}
      >
        <h1 className="text-5xl mb-2">ยินดีต้อนรับสู่ IoT Library & Cafe</h1>
        <h2>ร้านกาแฟที่มีหนังสืออยู่นิดหน่อยให้คุณได้อ่าน</h2>
      </section>

      <section className="container mx-auto py-8">
        <h1>เกี่ยวกับเรา</h1>

        <div className="grid grid-cols-3 gap-4">
          <p className="text-left col-span-2">
            IoT Library & Cafe เป็นร้านกาแฟที่มีหนังสืออยู่นิดหน่อยให้คุณได้อ่าน
            และเรียนรู้เรื่องใหม่ๆ ที่เกี่ยวกับเทคโนโลยี IoT โดยคาเฟ่ของเรานั้น ก่อตั้งขึ้นโดย
            ผศ.ดร. ปานวิทย์ ธุวะนุติ ซึ่งเป็นอาจารย์ในวิชา Internet of Things และนายกฤตณัฏฐ์
            ศิริพรนพคุณ เป็นผู้ช่วยสอนในหัวข้อ FastAPI และ React ในวิชานี้
          </p>

          <div>
            <img src={ajPanwitImage} alt="Panwit Tuwanut" className="h-full w-full object-cover" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-5">
          <div>
            <img src={myImage} alt="Me" className="h-80 w-full object-cover" />
          </div>
          <p className="text-right mt-8 col-span-2">
            ปัจจุบันค่าเฟ่ และห้องสมุดของเรา อยู่ในช่วงการดูแลของ นักศึกษารหัส 65070232 
            ชื่อ นายสหชินเดช เกตุดี ใช่ครับ ผมเอง ที่นั่งอยู่ตรงเกือบหน้าสุดฝั่งซ้าย 
            ดันกลายมาเป็นผู้ดูแลร้านคาเฟ่และห้องสมุด IoT แห่งนี้ไปเสียได้ หาก 
            {/* TODO: ชื่อของตนเอง, รหัสประจำตัวนักศึกษา และแนะนำคาเฟ่นี้ต่ออีกสักหน่อย + ใส่รูปของตนเอง (ไม่จำเป็นหากไม่สะดวกใจใส่รูป) */}
            พูดถึงที่นี่ ผมบอกได้เลยครับว่าที่นี่เป็นหนึ่งในคาเฟ่ที่นั่งสบาย และบันเทิงมากที่สุดในเทอมนี้
            ด้วยวิธีการสอนของ นายกฤตณัฏฐ์ ศิริพรนพคุณ และ ผศ.ดร. ปานวิทย์ ธุวะนุติ ที่ให้บรรยากาศสบายๆ เป็นกันเอง เฮฮา
            และการนำเนื้อหาที่มีความน่าสนใจมาสอนให้กับผู้ที่ผ่านไปผ่านมาอย่างพวกเรา แถมยังไม่มีภาษา C มากวนใจอีก (ใช่ครับ ผมเกลียดภาษา C) 
            ทำให้ผมไม่แปลกใจเลยว่าทำไมที่นี่ถึงเป็นสถานที่โปรดของผม
          </p>
        </div>
      </section>

      <section className="w-full flex justify-center">
        <img src={coffeeImage} alt="Coffee" className="w-full" />
      </section>
    </Layout>
  );
}
