import {Button, ButtonGroup} from "flowbite-react";

const pageSizeButtons = [4, 8, 12];

type Props = {
    pageSize: number;
    setPageSize: (size: number) => void;
}

export default function Filters({ pageSize, setPageSize }: Props) {
    return (
        <div className="flex justify-between items-center mb-4">
            <div>
                <span className="uppercase text-sm text-gray-500 mr-2">Page size</span>
                <ButtonGroup>
                    {pageSizeButtons.map((value, index) => (
                        <Button 
                            key={index}
                            onClick={() => setPageSize(value)}
                            color={`${pageSize === value ? "red" : "gray"}`}  //flowbite syntax
                            className="focus:ring-0"
                        >{value}</Button>
                    ))}
                </ButtonGroup>
            </div>
        </div>
    );
}