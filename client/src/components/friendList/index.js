import Friend from "../friend";

const FriendList = ({ friends, switchs }) => {
  const allFriends = friends
    .filter((f) => f.friendsStatus === 3)
    .map((f) => <Friend key={f._id} friend={f} switchs={switchs} />);
  return <>{allFriends}</>;
};

export default FriendList;