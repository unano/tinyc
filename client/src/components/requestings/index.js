import Requesting from "../requesting";
import { v4 as uuidv4 } from "uuid";
const Requestings = ({ requestings }) => {
  const allRequestings = requestings.map((r) => (
    <Requesting key={uuidv4()} requesting={r} />
  ));
  return (
    <div className="requests">
      <div className="requestTitle">My pending requests</div>
      {allRequestings}
    </div>
  );
};

export default Requestings;
