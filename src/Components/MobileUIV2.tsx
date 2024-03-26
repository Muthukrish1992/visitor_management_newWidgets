import React from "react";
import {
  AsyncButton,
  Button,
  DateTimePicker,
  Input,
  Select,
} from "uxp/components";
import { IContextProvider } from "../uxp";
import { addHours } from "date-fns";

interface IUIProps {
  uxpContext?: IContextProvider;
}
interface ILocation {
  LocationID: string;
  LocationName: string;
}
interface IVisitorType {
  VisitorType: string;
}
function getQueryString(key: string) {
  return new URLSearchParams(location.search).get(key);
}
const MobileUIV2: React.FunctionComponent<IUIProps> = (props) => {
  let sd = new Date();
  sd.setHours(sd.getHours() + 1);
  let minutes = sd.getMinutes();
  let roundedMinutes = minutes - (minutes % 15);
  sd.setMinutes(roundedMinutes);
  let ed = addHours(sd, 1);
  // let [host, setHost] = React.useState('');
  let [email, setEmail] = React.useState("");

  let [startDate, setStartDate] = React.useState<Date>(sd);
  let [endDate, setEndDate] = React.useState<Date>(ed);

  let [title, setTitle] = React.useState("");
  let [venue, setVenue] = React.useState("");
  let [visitors, setVisitors] = React.useState([]);
  let [newVisitorName, setNewVisitorName] = React.useState("");
  let [newVisitorEmail, setNewVisitorEmail] = React.useState("");
  let [remarks, setRemarks] = React.useState("");
  const [newVisitorId, setNewVisitorId] = React.useState("");
  const [newVisitorPhone, setNewVisitorPhone] = React.useState("");
  let [locations, setLocations] = React.useState<ILocation[]>([]);
  const [submitted, setSubmitted] = React.useState(false);
  const [duration, setDuration] = React.useState("60");

  React.useEffect(() => {
    props.uxpContext
      .executeAction("VisitorManagement", "AllLocations", {}, { json: true })
      .then((data: any) => {
        setLocations(data);
      });
  }, []);
  if (submitted) {
    return (
      <div className="mobile-submitted">
        <div className="icon" />
        <div className="txt">Your request has been submitted</div>
      </div>
    );
  }
  return (
    <div className="mobile-ui">
      <div className="banner">Visitor Registration</div>
      <div className="field">
        <label>* Purpose</label>
        <Input
          placeholder="Purpose of the visit"
          value={title}
          onChange={setTitle}
        />
      </div>


        <div className="field">
          <label className="label">Start Date </label>
          <DateTimePicker
            datetime={startDate}
            onChange={(date) => {
              setStartDate(date);
            }}
            title={""}
          />
        </div>


        <div className="field">
          <label className="label">End Date </label>
          <DateTimePicker
            datetime={endDate}
            onChange={(date) => {
              setEndDate(date);
            }}
            title={""}
          />
        </div>


      <div className="field">
        <label>* Location</label>
        {/* <Input placeholder="Building 1" value={venue} onChange={setVenue} /> */}
        <Select
          options={locations}
          labelField={"LocationName"}
          valueField={"LocationID"}
          selected={venue}
          onChange={(newLocation) => {
            setVenue(newLocation);
          }}
        />
      </div>
      <div className="field">
        <label>Remarks</label>
        <Input
          value={remarks}
          type="text"
          onChange={setRemarks}
          placeholder="Remarks"
        />
      </div>
      <div className="visitors">
        {visitors.map((v, i) => {
          return (
            <div className="visitor">
              <div className="name">{v.name}</div>
              <div className="more">
                <div className="email">{v.email}</div>
                <div className="phone">{v.phone}</div>
                <div className="id">{v.id}</div>
                <div className="remarks">{v.remarks}</div>
              </div>
              <div
                className="deleter"
                onClick={() => {
                  visitors.splice(i, 1);
                  setVisitors(visitors.slice());
                }}
              >
                Remove
              </div>
            </div>
          );
        })}
      </div>
      <div className="new-visitor">
        <div className="h">Add a visitor</div>
        <div className="field">
          <label>* Name</label>
          <Input
            placeholder="Name"
            value={newVisitorName}
            onChange={setNewVisitorName}
          />
        </div>
        <div className="field">
          <label>* Email</label>
          <Input
            placeholder="Email"
            type="email"
            value={newVisitorEmail}
            onChange={setNewVisitorEmail}
          />
        </div>
        <div className="field">
          <label>Phone</label>
          <Input
            placeholder="Phone Number"
            type="text"
            value={newVisitorPhone}
            onChange={setNewVisitorPhone}
          />
        </div>
        <div className="field">
          <label>ID</label>
          <Input
            placeholder="Identification Number"
            type="text"
            value={newVisitorId}
            onChange={setNewVisitorId}
          />
        </div>

        <div>
          <Button
            onClick={() => {
              if (!newVisitorName) {
                alert("Please enter a name for the visitor");
                return;
              }
              if (!newVisitorEmail) {
                alert("Please enter a name for the visitor");
                return;
              }
              visitors.push({
                name: newVisitorName,
                email: newVisitorEmail,
                phone: newVisitorPhone,
                id: newVisitorId,
              });
              setVisitors(visitors.slice());
              setNewVisitorPhone("");
              setNewVisitorId("");
              setNewVisitorEmail("");
              setNewVisitorName("");
            }}
            title={"Add Another Visitor"}
          />
        </div>
      </div>
      <div className="spacer" />
      <div className="actions">
        <AsyncButton
          onClick={async () => {
            visitors = [];
            if (newVisitorName && newVisitorEmail) {
              // Check if the duration is more than one day
              const durationInDays = Math.floor(
                (endDate.getTime() - startDate.getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              if (durationInDays > 0) {
                // If duration is more than one day, add entry for each day
                for (let i = 0; i <= durationInDays; i++) {
                  const currentDate = new Date(startDate);
                  currentDate.setDate(currentDate.getDate() + i);
                  visitors.push({
                    name: newVisitorName,
                    email: newVisitorEmail,
                    phone: newVisitorPhone,
                    id: newVisitorId,
                  });
                }
              } else {
                // If duration is one day or less, add single entry
                visitors.push({
                  name: newVisitorName,
                  email: newVisitorEmail,
                  phone: newVisitorPhone,
                  id: newVisitorId,
                });
              }
            }
            console.log("visitors :", visitors);
            if (visitors.length === 0) {
              alert("Please add some visitors");
              return;
            }

            if (!venue) {
              alert(
                "You need to select the location at which the visitor should arrive"
              );
              return;
            }
            if (!title) {
              alert("Please enter the purpose of this visit");
              return;
            }

            try {
              // Validate all visitors
              let validateVisitors = await props.uxpContext.executeAction(
                "VisitorManagement",
                "ValidateAllVisitors",
                { visitors },
                { json: true }
              );
              for (let i = 0; i < validateVisitors.length; i++) {
                if (validateVisitors[i].status === "blacklisted") {
                  throw `Blacklisted visitor - ${validateVisitors[i].email} found`;
                }
              }
            } catch (error) {
              // Handle other errors that might occur during the validation
              alert(error);
              return;
            }

            let r = await props.uxpContext.executeAction(
              "VisitorManagement",
              "RegisterMultipleVisits",
              {
                date: startDate,
                duration: endDate,
                location: venue,
                title,
                visitors,
                token: getQueryString("token"),
                url: location.href,
                source: "Mobile " + newVisitorEmail,
              },
              { json: true }
            );
            setSubmitted(true);
          }}
          title={"Submit"}
        />
      </div>
      <div className="spacer" />
    </div>
  );
};
export default MobileUIV2;
