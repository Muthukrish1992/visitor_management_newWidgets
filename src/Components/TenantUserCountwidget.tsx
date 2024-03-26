import React, { useCallback, useEffect } from "react";
import { DatePicker, Button, Checkbox, DataTable, FilterPanel, FormField, IconButton, Input, Label, Modal, ProfileImage, SearchBox, Select, TitleBar, useToast, WidgetWrapper, useEventSubscriber, useDebounce } from "uxp/components";
import { IContextProvider, registerWidget } from "../uxp";
import MemorizedData from "./memorizedData";
import { x64 } from "crypto-js";

interface ITenantUserProps {
    uxpContext?: IContextProvider,
    instanceId?: string,
    onClose?: () => void
}

const TenantUserCountwidget: React.FunctionComponent<ITenantUserProps> = (props) => {
    let [alltenant, setTenants] = React.useState<any>([]);
    let [tenantID, Settenant] = React.useState("");
    let [data, setdata] = React.useState<any>([]);
    let [disabledselect, setstatus] = React.useState<any>("");
    let [userGroupselect, SetUserGroupselect] = React.useState("");
    let [tenantIDselect, settenantselect] = React.useState("");
    const query = useDebounce(tenantIDselect, 300);
    let [tenantlogID, Setlogtenant] = React.useState("")
    let Toast = useToast();
    
    // Format date function to set time based on the flag
    const formatDate = (date: Date, isEndDate: boolean = false) => {
        const isoDate = date.toISOString().split('T')[0]; // Get ISO date without time
        const time = isEndDate ? '23:59:00Z' : '00:00:00Z'; // Adjust time based on isEndDate flag
        return `${isoDate}T${time}`; // Append time
    };

    let [selectedStartDate, setSelectedStartDate] = React.useState(formatDate(new Date())); // Start Date always has time 00:00:00Z

    // End Date is always the selected start date with time set to 23:59:00Z
    const selectedEndDate = formatDate(new Date(selectedStartDate), true);

    let [allfloors, setFloors] = React.useState<any>([]);
    let [floorID, Setfloor] = React.useState("");

    const getPaginatedData = useCallback((max: number, lastToken: string) => {
        return new Promise<{ items: any[], pageToken: string }>((done, nope) => {
            let last = 0;
            if (lastToken) last = Number(lastToken);

            props.uxpContext.executeAction("AccessControl", "GetTenantsCountByType", { max: max, last: last, tenantID: tenantID, StartDate: selectedStartDate, EndDate: selectedEndDate, Floor: floorID }, {json: true} )
                .then(res => {
                    done({ items: res, pageToken: ( last + res.length ).toString() })
                })
                .catch(e => {
                    console.log(e)
                    Toast.error
                    done({items: [], pageToken: lastToken})
                })
        })
    }, [tenantID, selectedStartDate, selectedEndDate, floorID]);

    async function getTenants() {
        props.uxpContext.executeAction('Tenant', 'GetAllTenants', {}, { json: true })
            .then(res => {
                const tenants = res.tenants;
                if (tenants) {
                    setTenants(tenants);
                } else {
                    console.error("Invalid response structure:", res);
                }
            })
            .catch(e => {
                console.error("API Error:", e);
            });
    }

    async function getFloors() {
        props.uxpContext.executeAction('Tenant', 'GetAllFloors', {}, { json: true })
            .then(res => {
                let FloorArray = [];
                let floors = res;
                for (var j = 0; j < floors.length; j++) {
                    FloorArray.push({ FloorName: floors[j]["FloorName"], floorID: floors[j]["floorID"] });
                }
                setFloors(FloorArray);
            })
            .catch(e => {
                console.error("API Error:", e);
            });
    }

    React.useEffect(() => {
        getFloors();
        getTenants();
    }, []);

    const columns = React.useMemo(() => {
        return [
            {
                title: "Tenant Name",
                width: "20%",
                renderColumn: (item: any) => (
                    <div>
                        <div className="data-list visitorName">{item.tenant}</div>
                    </div>
                ),
            },
            {
                title: "User Type",
                width: "20%",
                renderColumn: (item: any) => (
                    <div>
                        <div className="data-list UserGroup">{item.userGroupName}</div>
                    </div>
                ),
            },
            {
                title: "Count",
                width: "20%",
                renderColumn: (item: any) => (
                    <div>
                        <div className="data-list count">{item.count}</div>
                    </div>
                ),
            }
        ];
    }, []);

    return (
        <WidgetWrapper className="tenant-widget-wrpper-0dfd811f-8ce6-4d12-e83f-04cf0c9779dc">
            <TitleBar className="visitor-title" title="User Attendance">
                <FilterPanel
                    onClear={() => {
                        Setfloor("");
                        Settenant("");
                        setstatus("");
                        SetUserGroupselect("");
                        setSelectedStartDate(formatDate(new Date()));
                    }}
                >
                    <Label>Tenant</Label>
                    <Select
                        placeholder="Select a Tenant"
                        options={alltenant}
                        labelField="tenantID"
                        valueField="tenantID"
                        selected={tenantID}
                        onChange={(val) => {
                            Settenant(val);
                        }}
                    ></Select>  

                    <Label>Floor</Label>
                    <Select
                        placeholder="Select a Floor"
                        options={allfloors}
                        labelField="floorID"
                        valueField="floorID"
                        selected={floorID}
                        onChange={(val) => {
                            Setfloor(val);
                        }}
                    ></Select> 

                    <Label>Date</Label>
                    <DatePicker
                        title="Start Date"
                        date={selectedStartDate}
                        onChange={(date) => setSelectedStartDate(formatDate(date))}
                    />
                </FilterPanel>
            </TitleBar>

            <div className="dataTableWrapper">
                <MemorizedData
                    data={getPaginatedData}
                    pageSize={10}
                    className="visitorLog"
                    columns={columns}
                />
            </div>
        </WidgetWrapper>
    );
};

export default TenantUserCountwidget;
