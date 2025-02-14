import { AiOutlineDownload } from "react-icons/ai";
import { Button } from 'flowbite-react';
export const Export = ({ onExport }) => (
    <Button
      onClick={onExport}
      className='bg-primary text-secondary rounded-full shadow-lg hover:bg-gray-900 flex items-center'
    >       
      <AiOutlineDownload className="text-2xl" />
    </Button>
);