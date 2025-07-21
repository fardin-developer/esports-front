import Head from 'next/head';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>About Us - Zennova</title>
        <meta name="description" content="Learn more about Zennova Technologies Private Limited, our mission, and our commitment to innovation." />
      </Head>
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">About Zennova</h1>
        <p className="text-sm text-gray-600 mb-4">Updated at 2025-01-01</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Who We Are</h2>
        <p className="mb-4">
          Zennova Technologies Private Limited is a dynamic technology company incorporated under the laws of India, with our registered office at HD-445, WeWork, DLF Two Horizon Centre, 5th Floor, DLF Phase-5, Sector-43, Golf Course Road, Gurugram, Haryana 122002, India. We are dedicated to delivering innovative digital solutions that empower businesses and individuals to thrive in a connected world.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
        <p className="mb-4">
          At Zennova, our mission is to harness cutting-edge technology to create seamless, user-centric products and services. We strive to bridge the gap between ideas and reality by providing intuitive platforms and tools that enhance productivity, connectivity, and customer satisfaction.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">What We Do</h2>
        <p className="mb-4">
          Zennova develops and provides a range of innovative products and services accessible through our Platform, including our website (https://www.zennova.com) and mobile applications. Our offerings are designed to meet the needs of both individual users and organizations, enabling them to manage relationships, streamline processes, and achieve their goals efficiently. From personalized user experiences to robust transaction processing, we are committed to delivering excellence at every step.
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
          <strong>Via Email:</strong> info@zennova.com
        </p>
        <p className="mb-4">
          <strong>Address:</strong> Zennova Technologies Private Limited<br />
          HD-445, WeWork, DLF Two Horizon Centre, 5th Floor, DLF Phase-5, Sector-43, Golf Course Road, Gurugram, Haryana 122002, India
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Grievance Redressal</h2>
        <p className="mb-4">
          For any complaints or concerns, you may contact our Nodal Grievance Redressal Officer as required under the Information Technology Act, 2000 and rules made thereunder:
        </p>
        <p className="mb-4">
          <strong>NAME:</strong> Mr. Jagath Ravikumar<br />
          <strong>Address:</strong> BB-7, Qutab Plaza, Phase-1, Gurgaon 122 002<br />
          <strong>TEL:</strong> +91 9611104546<br />
          <strong>EMAIL:</strong> jagath.ravikumar@zennova.com
        </p>
      </div>
    </div>
  );
};

export default AboutUs;