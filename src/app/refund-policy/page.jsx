import Head from 'next/head';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-gray-700  bg-[#a6f2da]">
      <Head>
        <title>Leafstore Refund & Return Policy</title>
        <meta name="description" content="Leafstore Refund and Return Policy" />
      </Head>
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Return & Refund Policy</h1>
        <p className="text-sm text-gray-600 mb-4">Updated at 2025-07-22</p>

        <p className="mb-4">
          At <strong>Leafstore.in</strong>, operated by <strong>ONESTEPLINK (OPC) PRIVATE LIMITED</strong>, we are committed to delivering a seamless and reliable top-up experience for all our users. Our return and refund policy outlines the conditions under which refunds may be provided for failed transactions.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Refund Eligibility</h2>
        <p className="mb-4">
          We offer refunds in the following situations:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>The purchased top-up or digital currency was not delivered due to a technical error.</li>
          <li>The user did not receive the in-game credits (e.g., Diamonds, UC, Coins) after a successful transaction.</li>
          <li>Service was not provided as described at the time of purchase.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Non-Refundable Scenarios</h2>
        <p className="mb-4">
          Refunds will not be issued in the following cases:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>The user entered incorrect player ID, user ID, or game account details.</li>
          <li>The user changed their mind after a successful top-up delivery.</li>
          <li>The game developer or platform delayed or rejected the transaction.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Refund Process</h2>
        <p className="mb-4">
          If your transaction qualifies for a refund, please contact our support team within <strong>48 hours</strong> of the transaction with the following details:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Order ID / Transaction ID</li>
          <li>Registered email or phone number</li>
          <li>Screenshot or proof of failed delivery</li>
        </ul>
        <p className="mb-4">
          Once verified, the refund will be processed to your original payment method within <strong>3-5 business days</strong>.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p className="mb-4">
          For any refund-related queries or support, please reach out to us at:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Email:</strong> support@zeonnova.in</li>
          <li><strong>WhatsApp:</strong> 7086303816</li>
        </ul>

        <p className="text-sm text-gray-500 mt-8">
          Please note that by using our platform, you agree to the terms outlined in this Refund Policy. We reserve the right to update or modify this policy at any time without prior notice.
        </p>
      </div>
    </div>
  );
};

export default RefundPolicy;
