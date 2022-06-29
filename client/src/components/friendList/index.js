import Friend from "../friend";

const FriendList = ({ friends }) => {
  const allFriends = friends
    .filter((f) => f.friendsStatus === 3)
    .map((f) => <Friend key={f._id} friend={f} />);
  return <>{allFriends}</>;
};

export default FriendList;