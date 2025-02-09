import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-primary-foreground py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl text-white font-bold">PayWallet</h1>
          <nav className="flex gap-3">
            <button className="mr-2 bg-blue-500 px-4 rounded-md py-1 text-white">
              <Link to="/login">Login</Link>
            </button>
            <button className="mr-2 bg-blue-500 px-4 rounded-md py-1 text-white">
              <Link to="/signup">Sign Up</Link>
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Welcome to PayWallet</h2>
          <p className="text-xl mb-6">
            The easiest way to manage and transfer your money.
          </p>
          <button className="mr-2 bg-blue-500 px-4 rounded-md py-1 text-white">
            <Link to="/signup">Get Started</Link>
          </button>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              title: "Easy Transfers",
              description:
                "Send money to anyone, anytime with just a few clicks.",
            },
            {
              title: "Secure Storage",
              description:
                "Your funds are protected with state-of-the-art encryption.",
            },
            {
              title: "Real-time Updates",
              description:
                "Instantly see your balance and transaction history.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-5 flex justify-start items-start gap-3  rounded-md flex-col border-1 border-gray-200"
            >
              <h1 className="text-2xl font-bold">{feature.title}</h1>
              <p>{feature.description}</p>
            </div>
          ))}
        </section>

        <section className="text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
          <button className="mr-2 bg-blue-500 px-4 rounded-md py-1 text-white">
            <Link to="/signup">Create Account</Link>
          </button>
          <button className="mr-2 bg-blue-500 px-4 rounded-md py-1 text-white">
            <Link to="/login">Login</Link>
          </button>
        </section>
      </main>

      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 PayWallet. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
