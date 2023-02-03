import Friend from '../friend'

const FriendList = ({ friends, refresh, setRefresh }) => {
  const allFriends = friends
    .filter((f) => f.friendsStatus === 3)
    .map((f) => (
      <Friend
        key={f._id}
        friend={f}
        refresh={refresh}
        setRefresh={setRefresh}
      />
    ))
  return <>{allFriends}</>
}

export default FriendList
