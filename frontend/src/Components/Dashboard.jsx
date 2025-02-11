import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../axiosInstance";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserdata] = useState(null);
  const [showusers, setShowusers] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("token");
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
  }, []);

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
            onClick={() => {
              setShowusers(true);
            }}
            className="bg-amber-300 p-3 rounded-xl"
          >
            Show all users
          </button>
          <button className="bg-amber-300 p-3 rounded-xl">Transfer Fund</button>
        </div>
      </div>
      {showusers && (
        <div className="flex flex-wrap  justify-start items-center m-12">
          <div className="p-6 border-1 border-gray-500 w-[500px] rounded-lg m-4">
            <h1 className="text-xl font-bold">Hello sujan</h1>
            <h2>Current Balance : 500</h2>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
