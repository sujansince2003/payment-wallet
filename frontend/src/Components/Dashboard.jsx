import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../axiosInstance";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserdata] = useState(null);
  const [showusers, setShowusers] = useState(false);
  const [allusers, setAllusers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transferFund, setTransferFund] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);

  const [transferData, setTransferData] = useState({
    receiverID: "",
    amount: 0,
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const accountInfo = async () => {
      try {
        const res = await API.get("/account/getUserAccountInfo", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const response = await res.data;

        setUserdata(response);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    accountInfo();
  }, [token, transferSuccess]);

  async function showAllusers() {
    if (allusers) {
      setShowusers(!showusers);
      return;
    }
    try {
      const res = await API.get("/account", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await res.data;

      setAllusers(response.accounts);

      setShowusers(true);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  function handleInputChange(e) {
    setTransferData({
      ...transferData,
      [e.target.name]:
        e.target.name === "amount" ? Number(e.target.value) : e.target.value,
    });
  }
  async function handleTransfer(e) {
    e.preventDefault();
    const response = await API.post(
      "/account/transfers",
      {
        receiverID: transferData.receiverID,
        amount: Number(transferData.amount),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status !== 200) {
      return;
    }
    if (response.status === 200) {
      setTransferSuccess(true);
      setTransferFund(!transferFund);
    }
  }
  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <>
      <header>
        <nav className="flex bg-gray-800 justify-between items-center p-3">
          <h1 className="text-2xl font-bold text-white">Paypurse</h1>

          <button
            onClick={handleLogout}
            className="bg-amber-300 p-3 rounded-xl "
          >
            Logout
          </button>
        </nav>
      </header>

      <div className="flex justify-between items-center mx-12">
        <div className="p-6 border-1 border-gray-500 w-72 rounded-lg m-4">
          {loading ? (
            <>
              <div className="flex items-center justify-center ">
                <p className="text-xl">Loading...</p>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold">
                Hello {userData?.account?.userID?.username}
              </h1>
              <h2>
                Current Balance :{" "}
                {typeof userData?.account?.balance === "number"
                  ? userData?.account?.balance.toFixed(2)
                  : NaN}
              </h2>
            </>
          )}
        </div>

        <div className="flex gap-2 justify-between">
          <button
            onClick={showAllusers}
            className="bg-amber-300 p-3 rounded-xl"
          >
            Show all users
          </button>
          <button
            onClick={() => setTransferFund(!transferFund)}
            className="bg-amber-300 p-3 rounded-xl"
          >
            Transfer Fund
          </button>
        </div>
      </div>
      {transferFund && (
        <>
          <div>
            <form
              className="flex mx-12 p-6 flex-col justify-center items-center gap-2 "
              onSubmit={handleTransfer}
            >
              <div>
                <label htmlFor="ReceiverID">ReceiverID</label>
                <input
                  className="border-2 border-blue-400"
                  type="text"
                  name="receiverID"
                  id=""
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="amount">Amount</label>
                <input
                  className="border-2 border-blue-400"
                  type="number"
                  onChange={handleInputChange}
                  name="amount"
                  id=""
                />
              </div>
              <button
                type="submit"
                disabled={!transferData.receiverID || transferData.amount <= 0}
                className={`p-3 rounded-xl ${
                  transferData.receiverID && transferData.amount > 0
                    ? "bg-amber-300"
                    : "bg-gray-400"
                }`}
              >
                Send Money
              </button>
            </form>
          </div>
        </>
      )}
      {showusers && (
        <div className="flex flex-wrap  justify-start items-center m-12">
          {allusers?.map((user) => {
            return (
              <div
                key={user._id}
                className="p-6 border-1 border-gray-500 w-[500px] rounded-lg m-4"
              >
                <h1 className="text-xl font-bold">
                  username: {user?.userID?.username}
                </h1>
                <h2> UserID: {user?.userID?._id}</h2>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Dashboard;
