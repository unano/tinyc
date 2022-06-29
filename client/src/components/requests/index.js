import Request from "../request";
import { v4 as uuidv4 } from "uuid";
const Requestings = ({ requests }) => {
  const allRequests = requests.map((r) => (
    <Request key={uuidv4()} request={r} />
  ));
  return (
    <div className="requests">
      <div className="requestTitle">Friends requests</div>
      { allRequests }
    </div>
  );
};

export default Requestings;
