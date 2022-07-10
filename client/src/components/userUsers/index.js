import Request from "../request";
import { v4 as uuidv4 } from "uuid";
import Requestings from "../requestings";
import Requests from "../requests";
import { AuthContext } from "../../contexts/authContext";
import { useContext, useState, useEffect } from "react";
import { getFriendsReqAPI, getsendedFriendRedAPI } from "../../api/api";
const UserUsers = () => {
  const { currentUser} = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [requesting, setRequesting] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchRequest = async () => {
      const requests = await getFriendsReqAPI();
      setRequests(requests.data.friends);
    };
    fetchRequest();
  }, [currentUser, refresh]);

  useEffect(() => {
    const fetchRequest = async () => {
      const requests = await getsendedFriendRedAPI();
      setRequesting(requests.data.friends);
    };
    fetchRequest();
  }, [currentUser]);
  return (
    <div className="twoRequests">
      <Requests requests={requests} refresh={refresh} setRefresh={setRefresh} />
      <Requestings requestings={requesting} />
    </div>
  );
};

export default UserUsers;
