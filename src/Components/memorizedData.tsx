import  React from "react";
import { DataTable, IDataTableProps } from "uxp/components";

interface IMemorizedDataTable extends IDataTableProps{}

const MemorizedDataTable: React.FunctionComponent<IMemorizedDataTable> = (props) => {

    return <DataTable {...props}/> 
}
export default React.memo(MemorizedDataTable)