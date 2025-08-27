import Head from 'next/head';

const AboutUs = () => {
  return (
    <div className="min-h-screen text-gray-700 py-12 px-4 sm:px-6 lg:px-8 text-justify bg-yellow-300">
      <Head>
        <title>About Us - Zennova</title>
        <meta name="description" content="Learn more about Zennova Technologies Private Limited, our mission, and our commitment to innovation." />
      </Head>
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">About Zennova</h1>
        <p className="text-sm text-gray-600 mb-4">Updated at 2025-01-01</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Who We Are</h2>
        <p className="mb-4">
  Zeonnova.in is a premier gaming top‑up platform in India, empowering players with instant, secure access to in‑game currencies such as UC, Diamonds, Coins, and digital vouchers. Our streamlined system ensures a seamless top‑up experience for gamers across all their favorite titles.
</p>

<p className="mb-4">
  Operated by <strong>ONESTEPLINK (OPC) PRIVATE LIMITED</strong> (CIN: <strong>U82990AS2023OPC025559</strong>), we are registered at:
</p>

<p className="mb-4">
  <strong>
    House No. 451, Palash Basti Road, Barsala, Bogipukhuri,<br />
    Sonitpur, Alisinga, Assam – 784112, India.
  </strong>
</p>


        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
        <p className="mb-4">
          At Zennova, our mission is to harness cutting-edge technology to create seamless, user-centric products and services. We strive to bridge the gap between ideas and reality by providing intuitive platforms and tools that enhance productivity, connectivity, and customer satisfaction.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">What We Do</h2>
        <p className="mb-4">
          Zennova develops and provides a range of innovative products and services accessible through our Platform, including our website (https://www.zennova.in) and mobile applications. Our offerings are designed to meet the needs of both individual users and organizations, enabling them to manage relationships, streamline processes, and achieve their goals efficiently. From personalized user experiences to robust transaction processing, we are committed to delivering excellence at every step.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Values</h2>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Innovation:</strong> We embrace creativity and continuously push the boundaries of technology to deliver transformative solutions.</li>
          <li><strong>Integrity:</strong> We operate with transparency and uphold the highest standards of ethics in all our interactions.</li>
          <li><strong>Customer-Centricity:</strong> Your needs drive our innovation. We listen, adapt, and deliver solutions tailored to your success.</li>
          <li><strong>Security:</strong> We prioritize the protection of your data, implementing robust measures to ensure privacy and trust.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Commitment to Privacy</h2>
        <p className="mb-4">
          At Zennova, we understand the importance of your privacy. We are committed to safeguarding your personal information in accordance with our Privacy Policy and applicable laws, including the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011. For more details, please review our <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p className="mb-4">
          We’d love to hear from you! If you have any questions about our company, products, or services, please reach out to us.
        </p>
        <p className="mb-4">
          <strong>Via Email:</strong> info@zennova.in
        </p>
        <p className="mb-4">
          <strong>Address:</strong> Zennova Technologies<br />
          Palash Basti, House No451, Palash Basti Road,barsala, Bogipukhuri, Sonitpur, Alisinga, Assam, India, 784112
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Grievance Redressal</h2>
        <p className="mb-4">
          For any complaints or concerns, you may contact our Nodal Grievance Redressal Officer as required under the Information Technology Act, 2000 and rules made thereunder:
        </p>
        <p className="mb-4">
          <strong>NAME:</strong> Mr. Ibne Alam Khan<br />
          <strong>Address:</strong> Palash Basti, House No451, Palash Basti Road,barsala, Bogipukhuri, Sonitpur, Alisinga, Assam, India, 784112<br />
          <strong>TEL:</strong> +91 9611104546<br />
          <strong>EMAIL:</strong> support@zennova.in
        </p>
      </div>
    </div>
  );
};

export default AboutUs;